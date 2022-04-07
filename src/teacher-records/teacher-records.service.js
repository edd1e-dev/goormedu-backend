import TeacherRecord from "./teacher-records.entity";
import AppDataSource from "../db";

export default class TeacherRecordsService {
    #teacherRecordRepository;

    constructor() {
        this.#teacherRecordRepository = AppDataSource.getRepository(TeacherRecord);
    }

    async createTeacherRecord(student_id, career) {
        try {
            const teacherRecordData = await this.#teacherRecordRepository.findOneBy({ student_id });
	        if (!teacherRecordData) {
                const newTeacherRecord = this.#teacherRecordRepository.create({
                    student_id,
                    accepted: false,
                    career
                });
                const teacherRecordResult = await this.#teacherRecordRepository.save(newTeacherRecord); 
                return teacherRecordResult;
		    } else {
                return -1;
            }
        } catch {
            return null;
        }
    }

    async findTeacherRecord(student_id) {
        try {
            const teacherRecord = await this.#teacherRecordRepository.findOneBy({ student_id });
            if (teacherRecord) {
                return teacherRecord;
            }
            return null;
        } catch {
            return null;
        }
    }
}