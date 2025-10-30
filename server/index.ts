import express, { Request, Response } from 'express';
import multer from 'multer';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { PDFDocument, rgb } from 'pdf-lib';

const app = express();

// Server configuration constants
const ALLOWED_ORIGINS: string[] = process.env.CORS_ORIGINS?.split(',')
  .map((s) => s.trim())
  .filter(Boolean) ?? ['http://localhost:3000'];
const ALLOWED_MIME_TYPES: string[] = process.env.ALLOWED_MIME_TYPES?.split(',')
  .map((s) => s.trim())
  .filter(Boolean) ?? ['application/pdf', 'application/octet-stream'];

// PDF drawing constants
const DRAW_MARGIN = 24;
const SIGN_HEADER_Y_OFFSET = 40;
const SIGN_HEADER_FONT_SIZE = 12;
const SIGN_HEADER_COLOR = rgb(0.86, 0.07, 0.07);
const WATERMARK_TEXT = 'DEMO SIGNED';
const WATERMARK_FONT_SIZE = 36;
const WATERMARK_OPACITY = 0.15;
const WATERMARK_ROTATE_DEGREES = 30;
const WATERMARK_COLOR = rgb(0.9, 0.1, 0.1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 600,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  })
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

function looksLikePdf(buffer: Buffer | Uint8Array): boolean {
  if (!buffer || buffer.length < 4) return false;
  return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46; // %PDF
}

app.post('/api/sign', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).type('text/plain').send('No file uploaded');
    }
    if (!looksLikePdf(req.file.buffer)) {
      return res.status(400).type('text/plain').send('Invalid PDF file');
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer, {
      ignoreEncryption: false,
    });

    const pages = pdfDoc.getPages();
    const now = new Date();
    const signedStamp = `SIGNED - ${now.toISOString()}`;

    for (const page of pages) {
      const { width, height } = page.getSize();

      page.drawText(signedStamp, {
        x: DRAW_MARGIN,
        y: height - SIGN_HEADER_Y_OFFSET,
        size: SIGN_HEADER_FONT_SIZE,
        color: SIGN_HEADER_COLOR,
        opacity: 0.9,
      });

      page.drawText(WATERMARK_TEXT, {
        x: width / 4,
        y: height / 3,
        size: WATERMARK_FONT_SIZE,
        color: WATERMARK_COLOR,
        opacity: WATERMARK_OPACITY,
        rotate: { type: 'degrees', angle: WATERMARK_ROTATE_DEGREES },
      });
    }

    const signedBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="signed.pdf"');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(Buffer.from(signedBytes));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to sign PDF';
    return res.status(400).type('text/plain').send(message);
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req: Request, res: Response) => {
  res
    .status(200)
    .type('text/plain')
    .send('Mock signing server. Try POST /api/sign or GET /api/health');
});

app.get('/favicon.ico', (_req: Request, res: Response) => res.sendStatus(204));

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock signing server listening on http://localhost:${PORT}`);
});
