
import AppDataSource from "../db";
import Chapter from "./chapters.entity";

/**
 * 챕터 정보 조회
 * /chapter
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

export const getChapterByCourseId = async (req, res) => {
	try {
		const chapterRepository = AppDataSource.getRepository(Chapter);
		const course_id = parseInt(req.body?.course_id ?? "0");
		const chapterData = await chapterRepository.find({ 
			where: { course_id },
			select: ["id", "title", "course_id", "order"]
		});

		if (chapterData) {
			for (const [_, chapter] of Object.entries(chapterData)) {
				chapter.lectures = [];
			}

			const lectureData = await chapterRepository.query(`SELECT lecture.chapter_id, lecture.id, lecture.title, lecture.order, completionrecord.lecture_id FROM lecture \
			LEFT JOIN completionrecord ON lecture.id = completionrecord.lecture_id \
			WHERE lecture.course_id = ${course_id}`);
			if (lectureData) {
				for (const [_, lecture] of Object.entries(lectureData)) {
					if (lecture.lecture_id) {
						lecture.isCompleted = true;
					} else {
						lecture.isCompleted = false;
					}
					delete lecture.lecture_id;
					for (const [_, chapter] of Object.entries(chapterData)) {
						if (lecture.chapter_id === chapter.id) {
							delete lecture.chapter_id;
							chapter.lectures.push(lecture);
						}
					}
				}
				return res.send({ ok: true, result: chapterData});
			} else {
				return res.send({ ok: false, error: "존재하지 않는 강의입니다." });
			}
		} else {
			return res.send({ ok: false, error: "존재하지 않는 챕터입니다." });
		}

	} catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
	}
};