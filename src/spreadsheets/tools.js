import { createWorkbook, readXlsxBuffer, writeXlsxBuffer } from "./workbook.js";
import { validateWorkbookFormulas } from "./formula-validator.js";
import { exportDocxBuffer, exportPdfBuffer } from "./documents.js";
import { createGoogleSpreadsheet, readGoogleSheetRange } from "./google-sheets.js";
import { uploadToYandexDisk } from "./yandex-disk.js";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PDF_MIME = "application/pdf";

function requireArtifactStore(artifacts) {
  if (!artifacts || typeof artifacts.save !== "function" || typeof artifacts.get !== "function") {
    throw new TypeError("A tenant-aware artifact store with save() and get() methods is required.");
  }
}

function requireSheets(sheets) {
  if (!Array.isArray(sheets) || sheets.length === 0) throw new TypeError("At least one sheet is required.");
}

function safeName(value, fallback) {
  const name = String(value || fallback).replace(/[\\/:*?"<>|]/g, "_").trim();
  return name || fallback;
}

async function saveArtifact(artifacts, tenantId, name, mimeType, buffer) {
  const saved = await artifacts.save({ tenantId, name, mimeType, buffer });
  if (!saved?.id) throw new Error("Artifact store did not return an artifact id.");
  return { artifactId: saved.id, name: saved.name ?? name, mimeType, size: buffer.length };
}

export function registerSpreadsheetTools({
  registry,
  artifacts,
  getGoogleAccessToken,
  getYandexDiskAccessToken,
  getPdfFontPath,
  fetchImpl = fetch,
}) {
  if (!registry || typeof registry.register !== "function") throw new TypeError("A compatible STEN ToolRegistry is required.");
  requireArtifactStore(artifacts);

  registry.register({
    name: "spreadsheet.create_xlsx",
    description: "Create an XLSX workbook and save it to the tenant's artifact store.",
    schema: { type: "object", required: ["title", "sheets"], additionalProperties: false, properties: { title: { type: "string" }, sheets: { type: "array" } } },
    execute: async ({ tenantId, title, sheets }) => {
      requireSheets(sheets);
      const buffer = await writeXlsxBuffer(createWorkbook({ title, sheets }));
      return saveArtifact(artifacts, tenantId, safeName(title, "sten-report") + ".xlsx", XLSX_MIME, buffer);
    },
  });

  registry.register({
    name: "spreadsheet.read_xlsx",
    description: "Read an XLSX artifact, preserving formulas and cached values separately.",
    schema: { type: "object", required: ["artifactId"], additionalProperties: false, properties: { artifactId: { type: "string" } } },
    execute: async ({ tenantId, artifactId }) => {
      const artifact = await artifacts.get({ tenantId, artifactId });
      if (!artifact?.buffer) throw new Error("Artifact not found for this tenant.");
      return readXlsxBuffer(artifact.buffer);
    },
  });

  registry.register({
    name: "spreadsheet.validate_formulas",
    description: "Audit XLSX formula integrity against approved formulas and independent expected values.",
    schema: { type: "object", required: ["artifactId", "rules"], additionalProperties: false, properties: { artifactId: { type: "string" }, rules: { type: "array" }, requireRulesForEveryFormula: { type: "boolean" } } },
    execute: async ({ tenantId, artifactId, rules, requireRulesForEveryFormula = false }) => {
      const artifact = await artifacts.get({ tenantId, artifactId });
      if (!artifact?.buffer) throw new Error("Artifact not found for this tenant.");
      const parsed = await readXlsxBuffer(artifact.buffer);
      const workbook = createWorkbook({ title: parsed.title ?? "STEN validation", sheets: parsed.sheets.map((sheet) => ({
        name: sheet.name,
        rows: sheet.rows.map((row) => row.map((cell) => cell && typeof cell === "object" && "formula" in cell
          ? { formula: cell.formula, ...(cell.result !== null ? { result: cell.result } : {}) }
          : cell)),
        headerStyle: false,
      })) });
      return validateWorkbookFormulas(workbook, { rules, requireRulesForEveryFormula });
    },
  });

  registry.register({
    name: "spreadsheet.export_docx",
    description: "Export structured report sheets to DOCX and save the document for the tenant.",
    schema: { type: "object", required: ["title", "sheets"], additionalProperties: false, properties: { title: { type: "string" }, sheets: { type: "array" } } },
    execute: async ({ tenantId, title, sheets }) => {
      requireSheets(sheets);
      const buffer = await exportDocxBuffer({ title, sheets });
      return saveArtifact(artifacts, tenantId, safeName(title, "sten-report") + ".docx", DOCX_MIME, buffer);
    },
  });

  registry.register({
    name: "spreadsheet.export_pdf",
    description: "Export structured report sheets to PDF. Supply fontPath through host policy for Cyrillic/non-Latin text.",
    schema: { type: "object", required: ["title", "sheets"], additionalProperties: false, properties: { title: { type: "string" }, sheets: { type: "array" } } },
    execute: async ({ tenantId, title, sheets }) => {
      requireSheets(sheets);
      const buffer = await exportPdfBuffer({ title, sheets, fontPath: typeof getPdfFontPath === "function" ? await getPdfFontPath(tenantId) : undefined });
      return saveArtifact(artifacts, tenantId, safeName(title, "sten-report") + ".pdf", PDF_MIME, buffer);
    },
  });

  if (typeof getGoogleAccessToken === "function") {
    registry.register({
      name: "spreadsheet.google_create",
      description: "Create a Google spreadsheet using the authenticated user's connected Google account.",
      schema: { type: "object", required: ["title", "sheets"], additionalProperties: false, properties: { title: { type: "string" }, sheets: { type: "array" } } },
      execute: async ({ tenantId, title, sheets }) => createGoogleSpreadsheet({ accessToken: await getGoogleAccessToken(tenantId), title, sheets, fetchImpl }),
    });
    registry.register({
      name: "spreadsheet.google_read",
      description: "Read a Google spreadsheet range with formulas returned as formula text.",
      schema: { type: "object", required: ["spreadsheetId", "range"], additionalProperties: false, properties: { spreadsheetId: { type: "string" }, range: { type: "string" } } },
      execute: async ({ tenantId, spreadsheetId, range }) => readGoogleSheetRange({ accessToken: await getGoogleAccessToken(tenantId), spreadsheetId, range, fetchImpl }),
    });
  }

  if (typeof getYandexDiskAccessToken === "function") {
    registry.register({
      name: "spreadsheet.yandex_upload",
      description: "Upload a generated XLSX artifact to the authenticated user's Yandex Disk.",
      schema: { type: "object", required: ["artifactId", "path"], additionalProperties: false, properties: { artifactId: { type: "string" }, path: { type: "string" } } },
      execute: async ({ tenantId, artifactId, path }) => {
        const artifact = await artifacts.get({ tenantId, artifactId });
        if (!artifact?.buffer) throw new Error("Artifact not found for this tenant.");
        return uploadToYandexDisk({ accessToken: await getYandexDiskAccessToken(tenantId), path, content: artifact.buffer, contentType: artifact.mimeType ?? XLSX_MIME, fetchImpl });
      },
    });
  }

  return registry;
}
