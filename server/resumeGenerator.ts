import fs from 'fs';
import path from 'path';
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Packer,
} from 'docx';

const OPTIMIZED_DIR = path.resolve(process.cwd(), 'uploads', 'optimized');

if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'auto' };
const dividerBorder = {
  top: noBorder,
  left: noBorder,
  right: noBorder,
  bottom: { style: BorderStyle.SINGLE, size: 10, color: 'CBD5E1' },
};

export async function generateResumeDocx(
  resumeText: string,
  atsScore: number,
  targetScore = 90
): Promise<{
  success: boolean;
  message: string;
  filename: string;
  filepath: string;
  download_url: string;
  text_download_url?: string;
}> {
  try {
    const timestamp = Date.now();
    const cleanScore = Math.round(atsScore);
    const filename = `Tailored_Resume_ATS${cleanScore}_${timestamp}.docx`;
    const textFilename = `Tailored_Resume_ATS${cleanScore}_${timestamp}.txt`;
    const filepath = path.join(OPTIMIZED_DIR, filename);
    const textFilepath = path.join(OPTIMIZED_DIR, textFilename);

    // Persist plain text version
    fs.writeFileSync(textFilepath, resumeText, 'utf-8');

    const lines = resumeText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const bodyElements: (Paragraph | Table)[] = [];

    // Parse candidate name, title, contact info from top lines
    const candidateName = lines[0] || 'ARYAMAN DEWANGAN';
    let candidateHeadline = 'SOFTWARE ENGINEER';
    const contactLines: string[] = [];

    let bodyStartIndex = 1;
    for (let i = 1; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      const isHeading = [
        'SUMMARY',
        'PROFESSIONAL SUMMARY',
        'TECHNICAL SKILLS',
        'EXPERIENCE',
        'PROJECTS',
        'EDUCATION',
      ].includes(line.toUpperCase().replace(/[^A-Z ]/g, '').trim());

      if (isHeading) {
        bodyStartIndex = i;
        break;
      }

      if (line.includes('@') || line.includes('Phone') || line.includes('+') || line.includes('http') || line.includes('github') || line.includes('linkedin')) {
        // Contact line
        const parts = line.split(/[|•]/).map((p) => p.trim()).filter((p) => p.length > 0);
        contactLines.push(...parts);
      } else if (i === 1 && !line.includes('@')) {
        candidateHeadline = line.toUpperCase();
      }
    }

    // 1. EXECUTIVE HEADER TABLE (Two Columns: Left Name/Title, Right Contact Info)
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        left: noBorder,
        right: noBorder,
        bottom: { style: BorderStyle.SINGLE, size: 12, color: '94A3B8' },
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: candidateName.toUpperCase(),
                      bold: true,
                      size: 36, // 18pt
                      font: 'Calibri',
                      color: '0F172A',
                    }),
                  ],
                  spacing: { before: 0, after: 60 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: candidateHeadline,
                      bold: true,
                      size: 19, // 9.5pt
                      font: 'Calibri',
                      color: '475569',
                    }),
                  ],
                  spacing: { before: 0, after: 120 },
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
              children: (contactLines.length > 0 ? contactLines : [
                'Email: aryamanharshdewangan@gmail.com',
                'Phone: +1 (555) 234-5678',
                'San Francisco, CA, USA',
                'github.com/aryamandewangan',
              ]).map((c) =>
                new Paragraph({
                  alignment: 'right',
                  children: [
                    new TextRun({
                      text: c,
                      font: 'Calibri',
                      size: 18,
                      color: '334155',
                    }),
                  ],
                  spacing: { before: 0, after: 30 },
                })
              ),
            }),
          ],
        }),
      ],
    });

    bodyElements.push(headerTable);

    // Spacing paragraph
    bodyElements.push(
      new Paragraph({
        children: [new TextRun({ text: ' ', size: 8 })],
        spacing: { before: 100, after: 100 },
      })
    );

    // 2. Parse and render subsequent body sections
    for (let i = bodyStartIndex; i < lines.length; i++) {
      const line = lines[i];

      const cleanUpper = line.toUpperCase().replace(/[^A-Z ]/g, '').trim();
      const isKnownSection = [
        'SUMMARY',
        'PROFESSIONAL SUMMARY',
        'TECHNICAL SKILLS',
        'SKILLS',
        'EXPERIENCE',
        'WORK EXPERIENCE',
        'PROJECTS',
        'TECHNICAL PROJECTS',
        'EDUCATION',
        'CERTIFICATIONS',
        'ACHIEVEMENTS',
        'LEADERSHIP',
      ].includes(cleanUpper);

      const isAllCapsHeading =
        line.toUpperCase() === line && line.length >= 3 && line.length <= 32 && /[A-Z]/.test(line);

      if (isKnownSection || isAllCapsHeading) {
        // Section Header with border line underneath
        bodyElements.push(
          new Paragraph({
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 8, color: 'CBD5E1' },
            },
            children: [
              new TextRun({
                text: cleanUpper,
                bold: true,
                size: 23, // ~11.5pt
                font: 'Calibri',
                color: '0F172A',
              }),
            ],
            spacing: { before: 200, after: 80 },
          })
        );
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const bulletText = line.replace(/^[•\-\*]\s*/, '').trim();
        bodyElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '•  ',
                bold: true,
                font: 'Calibri',
                size: 21,
                color: '3B82F6',
              }),
              new TextRun({
                text: bulletText,
                font: 'Calibri',
                size: 21,
                color: '1E293B',
              }),
            ],
            spacing: { before: 0, after: 40 },
          })
        );
      } else {
        // Regular line (e.g. Subtitles, Company | Dates, Paragraph narrative)
        const isRoleLine = line.includes('|') || line.includes('–') || line.includes('-');
        bodyElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                bold: isRoleLine,
                size: isRoleLine ? 22 : 21,
                font: 'Calibri',
                color: isRoleLine ? '0F172A' : '334155',
              }),
            ],
            spacing: { before: isRoleLine ? 80 : 0, after: 50 },
          })
        );
      }
    }

    const doc = new Document({
      creator: "Aryaman's Job Application Agent",
      title: 'Executive Resume',
      description: 'Executive High-Impact ATS Resume',
      styles: {
        default: {
          document: {
            run: {
              font: 'Calibri',
              size: 21,
              color: '1E293B',
            },
            paragraph: {
              spacing: {
                line: 260,
                before: 0,
                after: 60,
              },
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,    // 0.5 inch
                right: 720,  // 0.5 inch
                bottom: 720, // 0.5 inch
                left: 720,   // 0.5 inch
              },
            },
          },
          children: bodyElements,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filepath, buffer);

    return {
      success: true,
      message: `Executive tailored resume generated with ATS score ${cleanScore}!`,
      filename,
      filepath,
      download_url: `/download/${filename}`,
      text_download_url: `/download/${textFilename}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to generate executive docx: ${error.message}`,
      filename: '',
      filepath: '',
      download_url: '',
    };
  }
}

export async function generateTailoredResume(
  optimizedResume: string,
  atsScore: number,
  targetScore = 90
): Promise<{
  success: boolean;
  message: string;
  filename: string;
  filepath: string;
  download_url: string;
  text_download_url?: string;
  ats_score: number;
}> {
  const result = await generateResumeDocx(optimizedResume, atsScore, targetScore);
  return {
    ...result,
    ats_score: atsScore,
  };
}
