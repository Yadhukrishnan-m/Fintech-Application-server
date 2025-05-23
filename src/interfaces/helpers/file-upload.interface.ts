import { Buffer } from "buffer";

export interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export interface IUploadToS3 {
  upload(file: UploadedFile): Promise<string>;
  getSignedUrl(fileKey: string, expiresIn: number): Promise<string>;
  delete(fileKey: string): Promise<void>;
}
