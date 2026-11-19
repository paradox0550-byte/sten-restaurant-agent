import ExcelJS from "exceljs";

function assertSheets(sheets) {
  if (!Array.isArray(sheets) || sheets.length === 0) throw new TypeError("At least one worksheet is required.");
  const names = new Set();
  for (const sheet of sheets) {
    if (!sheet || typeof sheet.name !== "string" || !sheet.name.trim()) throw new TypeError("Every worksheet requires a name.");
    if (sheet.name.length > 31 || /[\\/*?:\[\]]/.test(sheet.name)) throw new TypeError(`Invalid Excel worksheet name: ${sheet.name}`);
    if (names.has(sheet.name)) throw new TypeError(`Duplicate worksheet name: ${sheet.name}`);
    names.add(sheet.name);
    if (sheet.columns && !Array.isArray(sheet.columns)) throw new TypeError("Worksheet columns must be an array.");
    if (sheet.rows && !Array.isArray(sheet.rows)) throw new TypeError("Worksheet rows must be an array.");
  }
}

export function createWorkbook({ title = "STEN report", creator = "STEN", sheets }) {
  assertSheets(sheets);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = creator;
  workbook.subject = "STEN generated spreadsheet";
  workbook.title = title;
  workbook.created = new Date();
  for (const definition of sheets) {
    const sheet = workbook.addWorksheet(definition.name);
    if (definition.columns) sheet.columns = definition.columns;
    if (definition.rows) sheet.addRows(definition.rows);
    if (definition.freezeRows) sheet.views = [{ state: "frozen", ySplit: definition.freezeRows }];
    if (definition.autoFilter && sheet.rowCount > 0) sheet.autoFilter = definition.autoFilter === true
      ? { from: "A1", to: sheet.getRow(1).getCell(sheet.columnCount).address }
      : definition.autoFilter;
    if (definition.headerStyle !== false && sheet.rowCount > 0) {
      const header = sheet.getRow(1);
      header.font = { bold: true };
      header.alignment = { vertical: "middle", wrapText: true };
    }
    sheet.eachRow((row) => row.eachCell((cell) => {
      if (cell.value && typeof cell.value === "object" && "formula" in cell.value && !cell.value.result) {
        cell.note = "Formula result is not calculated by ExcelJS. Open in a spreadsheet application or supply an independent validation result.";
      }
    }));
  }
  return workbook;
}

export async function writeXlsxBuffer(workbook) {
  if (!workbook?.xlsx?.writeBuffer) throw new TypeError("A valid ExcelJS workbook is required.");
  return Buffer.from(await workbook.xlsx.writeBuffer());
}

export async function readXlsxBuffer(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
    throw new TypeError("Input is not a ZIP-based XLSX workbook.");
  }
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  return {
    title: workbook.title || null,
    creator: workbook.creator || null,
    sheets: workbook.worksheets.map((sheet) => ({
      name: sheet.name,
      rowCount: sheet.rowCount,
      columnCount: sheet.columnCount,
      rows: Array.from({ length: sheet.rowCount }, (_, rowIndex) => {
        const row = sheet.getRow(rowIndex + 1);
        return Array.from({ length: sheet.columnCount }, (_, columnIndex) => {
          const cell = row.getCell(columnIndex + 1);
          const value = cell.value;
          if (value && typeof value === "object" && "formula" in value) {
            return { formula: value.formula, result: value.result ?? null, address: cell.address };
          }
          if (value && typeof value === "object" && "error" in value) {
            return { error: value.error, address: cell.address };
          }
          if (value instanceof Date) return value.toISOString();
          if (value && typeof value === "object" && "richText" in value) return value.richText.map((part) => part.text).join("");
          return value ?? null;
        });
      }),
    })),
  };
}

export function workbookToTabularData(workbook) {
  return workbook.worksheets.map((sheet) => ({
    name: sheet.name,
    rows: Array.from({ length: sheet.rowCount }, (_, rowIndex) =>
      Array.from({ length: sheet.columnCount }, (_, columnIndex) => {
        const value = sheet.getRow(rowIndex + 1).getCell(columnIndex + 1).value;
        if (value && typeof value === "object" && "formula" in value) return `=${value.formula}`;
        if (value && typeof value === "object" && "richText" in value) return value.richText.map((part) => part.text).join("");
        if (value instanceof Date) return value.toISOString();
        if (value && typeof value === "object" && "text" in value && "hyperlink" in value) return value.text;
        return value ?? "";
      })
    ),
  }));
}
