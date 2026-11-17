import ExcelJS from "exceljs";
import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
import PDFDocument from "pdfkit";
import { workbookToTabularData } from "./workbook.js";

function normalizeCell(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && "formula" in value) return `=${value.formula}`;
  if (typeof value === "object" && "richText" in value) return value.richText.map((part) => part.text).join("");
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function toRows(sheets) {
  if (!Array.isArray(sheets) || !sheets.length) throw new TypeError("At least one sheet is required.");
  return sheets.map((sheet) => ({ name: sheet.name, rows: (sheet.rows ?? []).map((row) => Array.isArray(row) ? row.map(normalizeCell) : Object.values(row).map(normalizeCell)) }));
}

export async function exportDocxBuffer({ title = "STEN report", sheets }) {
  const data = toRows(sheets);
  const children = [new Paragraph({ text: title, heading: HeadingLevel.TITLE })];
  for (const sheet of data) {
    children.push(new Paragraph({ text: sheet.name, heading: HeadingLevel.HEADING_1 }));
    if (!sheet.rows.length) continue;
    const width = Math.max(1, ...sheet.rows.map((row) => row.length));
    const tableRows = sheet.rows.map((row) => new TableRow({
      children: Array.from({ length: width }, (_, index) => new TableCell({
        children: [new Paragraph(String(row[index] ?? ""))],
      })),
    }));
    children.push(new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
  }
  return Packer.toBuffer(new Document({ sections: [{ children }] }));
}

export async function exportPdfBuffer({ title = "STEN report", sheets }) {
  const data = toRows(sheets);
  const doc = new PDFDocument({ size: "A4", margin: 36, layout: "landscape", info: { Title: title, Author: "STEN" } });
  const chunks = [];
  const finished = new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
  doc.fontSize(18).text(title, { underline: true });
  for (const sheet of data) {
    doc.moveDown().fontSize(14).text(sheet.name);
    doc.moveDown(0.4).fontSize(7);
    const widths = Math.max(1, ...sheet.rows.map((row) => row.length));
    for (const row of sheet.rows) {
      const line = Array.from({ length: widths }, (_, index) => String(row[index] ?? "")).join("   |   ");
      doc.text(line, { continued: false });
    }
  }
  doc.end();
  return finished;
}

export async function exportWorkbookDocx(workbook, options = {}) {
  return exportDocxBuffer({ ...options, sheets: workbookToTabularData(workbook) });
}

export async function exportWorkbookPdf(workbook, options = {}) {
  return exportPdfBuffer({ ...options, sheets: workbookToTabularData(workbook) });
}
