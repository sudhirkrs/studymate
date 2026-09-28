// Turns an uploaded file into content the model can read. PDFs go to Claude
// natively (it reads scanned pages and layout too); DOCX and text are
// extracted to plain text here.
import mammoth from 'mammoth';

export const ALLOWED_TYPES = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
  'text/markdown': 'txt',
};

export function kindFor(mime, filename) {
  if (ALLOWED_TYPES[mime]) return ALLOWED_TYPES[mime];
  const ext = String(filename).toLowerCase().split('.').pop();
  if (ext === 'pdf') return 'pdf';
  if (ext === 'docx') return 'docx';
  if (ext === 'txt' || ext === 'md') return 'txt';
  return null;
}

export async function extractText(buffer, kind) {
  if (kind === 'docx') {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }
  if (kind === 'txt') return buffer.toString('utf8');
  return null; // PDFs are sent as document blocks
}

export function isPdfBuffer(buffer) {
  return buffer.subarray(0, 5).toString('latin1') === '%PDF-';
}
