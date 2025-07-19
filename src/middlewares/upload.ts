import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

const FILE_TYPE_MAP: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError: Error | null = null;

    if (!isValid) {
      uploadError = new Error('Invalid image type');
    }

    cb(uploadError, 'public/uploads');
  },

  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  }
});

export const uploadOptions = multer({ storage });
