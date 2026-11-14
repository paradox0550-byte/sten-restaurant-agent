# Excel analysis adapter boundary

Current package does not include an XLSX parsing dependency or a spreadsheet execution engine. For uploaded workbooks:
1. preserve original workbook and sheet names;
2. inspect headers, merged cells, formulas, hidden rows/columns and date/number formats;
3. distinguish formula values from cached values;
4. retain source cell/range lineage in extracted facts;
5. report parsing gaps; never silently replace blanks with zero.
A concrete parser can be added only after dependency and runtime approval.
