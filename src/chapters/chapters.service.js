import Chapter from "./chapters.entity";
import AppDataSource from "../db";

export default class ChaptersService {
    #chapterRepository;
  
    constructor() {
      this.#chapterRepository = AppDataSource.getRepository(Chapter);
    }
  
    /**
     * @param select Categories 조회 결과 형식을 지정
     * @returns 성공 시 Chapters 조회 및 강의 빈 배열 추가 결과 실패 시 null
     */
    async findChaptersByCourseId(where, select) {
        try {
            const chapterData = await this.#chapterRepository.find({ where: { course_id: where }, select });
            if (chapterData) {
                for (const [_, chapter] of Object.entries(chapterData)) {
                    chapter.lectures = [];
                }
            }
            return chapterData;
        } catch {
            return null;
        }
    }
    
    /**
     * @param chapterData Chapters 조회 및 강의 빈 배열 추가 결과 
     * @param where 코스 번호
     * @returns 성공 시 Categories 실패 시 null
     */
    async findLecturesByCourseId(chapterData, where) {
        try {
            const lectureData = await this.#chapterRepository.query(`SELECT lecture.chapter_id, lecture.id, lecture.title, lecture.order, completionrecord.lecture_id FROM lecture \
                LEFT JOIN completionrecord ON lecture.id = completionrecord.lecture_id \
                WHERE lecture.course_id = ${where}`);
            
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
                return chapterData;
            }
        } catch {
            return null;
        }    
    }
}