import Papa from 'papaparse';
import * as XLSX from 'xlsx';
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
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheet = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheet];
  const rows = XLSX.utils.sheet_to_json<RawBomRow>(worksheet, {
    defval: '',
  });
  return rows;
};

export const parseBomFile = async (file: File): Promise<RawBomRow[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'csv') return parseCsvFile(file);
  if (extension === 'xlsx' || extension === 'xls') return parseXlsxFile(file);
  throw new Error('Unsupported file format. Please upload CSV or XLSX.');
};
