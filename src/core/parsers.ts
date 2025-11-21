import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { RawBomRow } from './types';

export const parseCsvFile = (file: File): Promise<RawBomRow[]> =>
  new Promise((resolve, reject) => {
    Papa.parse<RawBomRow>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<RawBomRow>) => resolve(results.data as RawBomRow[]),
      error: (error: Error) => reject(error),
    });
  });

export const parseXlsxFile = async (file: File): Promise<RawBomRow[]> => {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.worksheets[0];
  if (!sheet) return [];

  const headers: string[] = [];
  sheet.getRow(1).eachCell((cell, colNumber) => {
    headers[colNumber - 1] = String(cell.value ?? `column_${colNumber}`);
  });

  const rows: RawBomRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const rowData: RawBomRow = {};
    row.eachCell((cell, colNumber) => {
      const key = headers[colNumber - 1];
      rowData[key] = cell.value as RawBomRow[string];
    });
    rows.push(rowData);
  });

  return rows;
};

export const parseBomFile = async (file: File): Promise<RawBomRow[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'csv') return parseCsvFile(file);
  if (extension === 'xlsx' || extension === 'xls') return parseXlsxFile(file);
  throw new Error('Unsupported file format. Please upload CSV or XLSX.');
};
