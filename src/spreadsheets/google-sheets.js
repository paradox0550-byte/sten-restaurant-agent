const API = "https://sheets.googleapis.com/v4";

async function requestJson(fetchImpl, url, { token, method = "GET", body } = {}) {
  const response = await fetchImpl(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`Google Sheets API request failed with HTTP ${response.status}.`);
    error.status = response.status;
    error.providerMessage = payload.error?.message ?? null;
    throw error;
  }
  return payload;
}

function validateToken(token) {
  if (typeof token !== "string" || !token.trim()) throw new TypeError("A Google OAuth access token is required.");
}

export async function createGoogleSpreadsheet({ accessToken, title, sheets, fetchImpl = fetch }) {
  validateToken(accessToken);
  if (!title || !Array.isArray(sheets) || !sheets.length) throw new TypeError("title and at least one sheet are required.");
  const created = await requestJson(fetchImpl, `${API}/spreadsheets`, {
    token: accessToken,
    method: "POST",
    body: {
      properties: { title },
      sheets: sheets.map((sheet, index) => ({ properties: { title: sheet.name, index } })),
    },
  });
  const data = sheets.map((sheet) => ({
    range: `'${sheet.name.replace(/'/g, "''")}'!A1`,
    majorDimension: "ROWS",
    values: sheet.rows ?? [],
  }));
  if (data.length) {
    await requestJson(fetchImpl, `${API}/spreadsheets/${encodeURIComponent(created.spreadsheetId)}/values:batchUpdate`, {
      token: accessToken,
      method: "POST",
      body: { valueInputOption: "USER_ENTERED", data },
    });
  }
  return { spreadsheetId: created.spreadsheetId, title: created.properties?.title ?? title, url: created.spreadsheetUrl };
}

export async function readGoogleSheetRange({ accessToken, spreadsheetId, range, fetchImpl = fetch }) {
  validateToken(accessToken);
  if (!spreadsheetId || !range) throw new TypeError("spreadsheetId and A1 range are required.");
  const url = new URL(`${API}/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`);
  url.searchParams.set("valueRenderOption", "FORMULA");
  url.searchParams.set("dateTimeRenderOption", "SERIAL_NUMBER");
  return requestJson(fetchImpl, url.toString(), { token: accessToken });
}
