
import AppDataSource from "../db";
import Educator from "./educator.entity";

export const applyEducator = async (req, res) => {
	try {
		const educatorRepository = AppDataSource.getRepository(Educator);
		const student_id = parseInt(req.user.id ?? "0");
		const educator = await educatorRepository.findOneBy({ student_id });

		if (!educator) {
            const newEducator = educatorRepository.create({
                student_id,
                isAccepted: false,
                career: req.body?.career ?? "",
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await educatorRepository.save(newEducator); 
            return res.send({ ok: true, result: newEducator});
		} else {
			return res.send({ ok: false, error: "이미 신청한 상태이거나 교육자입니다." });
		}

	} catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
	}
};

export const getEducatorAppliedRecord = async (req, res) => {
	try {
		const educatorRepository = AppDataSource.getRepository(Educator);
		const student_id = parseInt(req.user.id ?? "0");
		const educator = await educatorRepository.findOneBy({ student_id });

		if (educator) {
            return res.send({ ok: true, result: newEducator});
		} else {
			return res.send({ ok: false, error: "신청한 기록이 없습니다." });
		}

	} catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
	}
};