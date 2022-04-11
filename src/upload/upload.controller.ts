import env from '@/commons/config';
import express, { Request, Response, Router } from 'express';
import { IController } from '@/commons/interfaces';
import { DeleteFileDTO, UploadFileDTO } from './upload.dto';
import {
  SingleCoverImageMiddleware,
  SingleLectureVideoMiddleware,
} from './upload.middleware';
import UploadService from './upload.service';

export default class UploadController implements IController {
  public readonly route: string;
  private readonly router: Router;
  private readonly uploadService: UploadService;

  constructor() {
    this.route = '/upload';
    this.router = express.Router();
    this.uploadService = new UploadService();
  }

  private async upload(req: Request, res: Response) {
    try {
      if (req.file) {
        const result = await this.uploadService.uploadFile({
          username: 'test',
          file: req.file,
        });

        return res.send({ ok: true, result });
      } else {
        return res.send({ ok: false, error: '파일을 읽지 못했습니다.' });
      }
    } catch (error) {
      console.log(error);
      return res.send({ error });
    }
  }

  private async delete(req: Request, res: Response) {
    try {
      if (req.body.filePath) {
        const result = await this.uploadService.deleteFile({
          key: req.body.filePath,
        });
        return res.send({ ok: true, result });
      } else {
        return res.send({ ok: false, error: 'body에 filePath를 보내주세요' });
      }
    } catch (error) {
      return res.send({ error });
    }
  }

  getRouter() {
    this.router.post(
      '/cover-image/create',
      SingleCoverImageMiddleware,
      this.upload,
    );
    this.router.post('/cover-image/delete', this.delete);

    this.router.post(
      '/lecture-video/create',
      SingleLectureVideoMiddleware,
      this.upload,
    );
    this.router.post('/lecture-video/delete', this.delete);

    return this.router;
  }
}
