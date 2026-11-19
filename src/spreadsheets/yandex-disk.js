const API = "https://cloud-api.yandex.net/v1/disk";

function requireToken(token) {
  if (typeof token !== "string" || !token.trim()) throw new TypeError("A Yandex Disk OAuth token is required.");
}

async function parseResponse(response, label) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`${label} failed with HTTP ${response.status}.`);
    error.status = response.status;
    error.providerMessage = body.message ?? body.description ?? null;
    throw error;
  }
  return body;
}

/**
 * Uploads a generated workbook to the user's Yandex Disk.
 * Yandex exposes file storage APIs here; this is not live cell-level Sheets sync.
 */
export async function uploadToYandexDisk({ accessToken, path, content, contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fetchImpl = fetch }) {
  requireToken(accessToken);
  if (typeof path !== "string" || !path.trim() || !path.startsWith("/")) throw new TypeError("Yandex Disk destination path must be an absolute path beginning with /.");
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content ?? []);
  if (!bytes.length) throw new TypeError("File content must not be empty.");

  const uploadUrl = new URL(`${API}/resources/upload`);
  uploadUrl.searchParams.set("path", `disk:${path}`);
  uploadUrl.searchParams.set("overwrite", "false");
  const link = await parseResponse(await fetchImpl(uploadUrl, {
    headers: { Authorization: `OAuth ${accessToken}` },
  }), "Yandex Disk upload-link request");
  if (!link.href || link.method !== "PUT") throw new Error("Yandex Disk returned an invalid upload link.");

  const uploaded = await fetchImpl(link.href, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: bytes,
  });
  if (!uploaded.ok) {
    const error = new Error(`Yandex Disk file upload failed with HTTP ${uploaded.status}.`);
    error.status = uploaded.status;
    throw error;
  }

  const metadataUrl = new URL(`${API}/resources`);
  metadataUrl.searchParams.set("path", `disk:${path}`);
  const metadata = await parseResponse(await fetchImpl(metadataUrl, {
    headers: { Authorization: `OAuth ${accessToken}` },
  }), "Yandex Disk metadata request");
  return { path, name: metadata.name, size: metadata.size, mimeType: metadata.mime_type, modified: metadata.modified, storage: "yandex-disk", spreadsheetSync: false };
}
