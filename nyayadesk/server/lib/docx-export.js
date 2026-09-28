// Converts a plain-text draft into a court-ready .docx: A4 (legal practice in
// most Indian courts), Times New Roman 14pt body, 1.5 line spacing, generous
// left margin for binding, centred headings, page numbers in the footer.
import { AlignmentType, Document, Footer, Packer, PageNumber, Paragraph, TextRun } from 'docx';

const FONT = 'Times New Roman';

function isHeading(line) {
  const t = line.trim();
  return t.length > 2 && t.length < 90 && t === t.toUpperCase() && /[A-Z]/.test(t) && !/^\(?[a-z0-9ivx]+[.)]/i.test(t);
}

function paragraphFor(line) {
  const t = line.replace(/\s+$/, '');
  if (!t.trim()) return new Paragraph({ children: [], spacing: { after: 0 } });
  // Right-aligned signature/role blocks are indented with many spaces in plain text.
  if (/^\s{20,}\S/.test(t)) {
    return new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: t.trim(), font: FONT, size: 28 })] });
  }
  // "... PETITIONER" suffixes on cause-title lines.
  const causeTitle = t.match(/^(.*?)\s{3,}(\.{2,}.*)$/);
  if (causeTitle) {
    return new Paragraph({
      children: [
        new TextRun({ text: causeTitle[1].trim(), font: FONT, size: 28 }),
        new TextRun({ text: `\t${causeTitle[2].trim()}`, font: FONT, size: 28, bold: true }),
      ],
      tabStops: [{ type: 'right', position: 9000 }],
    });
  }
  if (isHeading(t)) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 120 },
      children: [new TextRun({ text: t.trim(), font: FONT, size: 28, bold: true })],
    });
  }
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: 120 },
    children: [new TextRun({ text: t.trim(), font: FONT, size: 28 })],
  });
}

export async function draftToDocx(title, body) {
  // Drafting notes after the "---" separator are for the advocate, not the filing.
  const [doc] = String(body).split(/\n-{3,}\s*\n/);
  const paragraphs = doc.split('\n').map(paragraphFor);
  const file = new Document({
    creator: 'NyayaDesk',
    title,
    styles: { default: { document: { run: { font: FONT, size: 28 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 1440, bottom: 1440, left: 2160, right: 1080 },
          },
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 22 })] })],
          }),
        },
        children: paragraphs,
      },
    ],
  });
  return Packer.toBuffer(file);
}
