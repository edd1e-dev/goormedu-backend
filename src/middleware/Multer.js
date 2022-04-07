import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  // accessKeyId와 secretAccessKey는 @deprecated라고 뜸
  // 실제 aws 배포 환경에서는 다른 방식으로 accessKey와 secretKey를 전달
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.REGION,
});

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'goorm-s3-lecture',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        Math.floor(Math.random() * 1000).toString() +
          Date.now() +
          '.' +
          file.originalname.split('.').pop()
      );
    },
  }),
});
