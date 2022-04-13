import multer from 'multer';

const multers = multer({ storage: multer.memoryStorage() });

export const SingleCoverImageMiddleware = multers.single('cover_image'); 

export const SingleLectureVideoMiddleware = multers.single('lecture_video');
