import express from 'express';
import ChaptersService from './chapters.service'

export default class ChaptersController {
    #chapterService;
    #router;

    constructor() {
        this.#chapterService = new ChaptersService();
        this.#router = express.Router();
    }

    getRouter() {
        this.#router.post('/', (req, res) => {
            try {
				const course_id = parseInt(req.body?.course_id ?? "0");
                this.#chapterService.findChaptersByCourseId(course_id, { id: true, title: true, course_id: true, order: true }).then(chapterData => {
					if (chapterData) {
						this.#chapterService.findLecturesByCourseId(chapterData, course_id).then(lectureData => {
							if (lectureData) {
								return res.send({ ok: true, result: lectureData });
							} else {
								return res.send({ ok: false, error: "존재하지 않는 강의입니다." });
							}
						});
					} else {
						return res.send({ ok: false, error: "존재하지 않는 챕터입니다." });
					}
				});
            } catch {
                return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
            }
        });
        return this.#router;
    }
}