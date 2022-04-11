export class UploadFileDTO {
  username: string;
  file: Express.Multer.File;
}
export class DeleteFileDTO {
  key: string;
}
