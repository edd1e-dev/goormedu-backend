import { IService } from '@/commons/interfaces';
import { DeleteFileDTO, UploadFileDTO } from './upload.dto';
import {
  DeleteObjectCommandOutput,
  PutObjectCommandOutput,
  S3,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import env from '@/commons/config';

export default class UploadService implements IService {
  private readonly options: S3ClientConfig;
  constructor() {
    this.options = {
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_CLIENT_ID,
        secretAccessKey: env.AWS_SECRET,
      },
    };
  }

  getTest() {
    return '';
  }
  /** 
  async uploadFile({
    username,
    file,
  }: UploadFileDTO): Promise<PutObjectCommandOutput> {
    const s3 = new S3(this.options);
    const data = await s3.putObject({
      Bucket: env.AWS_S3,
      Key: `${file.fieldname}/${username}/${Date.now()}`,
      ACL: 'public-read',
      ContentType: file.mimetype,
      Body: file.buffer,
    });
    return data;
  }

  async deleteFile({
    key: Key,
  }: DeleteFileDTO): Promise<DeleteObjectCommandOutput> {
    const s3 = new S3(this.options);
    const result = await s3.deleteObject({
      Bucket: env.AWS_S3,
      Key,
    });
    return result;
  }*/
}
