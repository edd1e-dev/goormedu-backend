import AppDataSource from "../db";
import Course from "./course.entity";
import UserClassroom from "../userClassroom/userClassroom.entity";

// 아래 코드는 나중에 전역객체로 생성되면 삭제
const UserRole = {
	Admin: "Admin",
	Student: "Student",
	Teacher: "Teacher",
};

export const findCourseById = async (req, res) => {
	try {
		const courseRepository = AppDataSource.getRepository(Course);
		const id = parseInt(req.params?.id ?? "0");
		const course = await courseRepository.findOneBy({
			id,
		});
		if (course) {
			const { createdAt, updatedAt, ...result } = course;
			res.send({ ok: true, result });
		} else {
			return res.send({ ok: false, error: "해당 코스를 조회하지 못했습니다." });
		}
	} catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
	}
};

export const createCourse = async (req, res) => {
	try {
		const user = req.user;
		user.id = 1;
		user.role = UserRole.Teacher;

		if (user.role !== UserRole.Teacher && user.role !== UserRole.Admin) {
			return res.send({ ok: false, error: "코스 생성 권한이 없습니다." });
		}

		const courseRepository = AppDataSource.getRepository(Course);

		if (Object.keys(req.body).length == 0) {
			return res.send({ ok: false, error: "정보가 입력되지 않았습니다." });
		} else {
			const { title, description, category_id, level, cover_image } = req.body;
			const teacher_id = user.id;
			const newCourse = courseRepository.create({
				title,
				description,
				category_id,
				level,
				cover_image,
				teacher_id,
			});
			const { createdAt, updatedAt, ...result } = await courseRepository.save(
				newCourse
			);
			return res.send({ ok: true, result });
		}
	} catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
	}
};

export const updateCourseById = async (req, res) => {
	try {
		const user = req.user;
		user.id = 1;
		user.role = UserRole.Teacher;

		if (user.role !== UserRole.Teacher && user.role !== UserRole.Admin) {
			return res.send({ ok: false, error: "코스 수정 권한이 없습니다." });
		}

		const id = parseInt(req.params?.id ?? "0");

		const courseRepository = AppDataSource.getRepository(Course);
		const course = await courseRepository.findOneBy({ id });

		if (!course) {
			return res.send({
				ok: false,
				error: "존재 하지 않는 코스입니다.",
			});
		}

		const teacher_id = course.teacher_id;
		if (user.role === UserRole.Teacher && teacher_id !== user.id) {
			return res.send({
				ok: false,
				error: "코스 수정 권한이 없습니다.",
			});
		}

		if (Object.keys(req.body).length == 0) {
			return res.send({
				ok: false,
				error: "코스 수정 정보가 입력되지 않았습니다.",
			});
		}

		const content = req.body;
		const { affected } = await courseRepository.update(
			{
				id,
				teacher_id,
			},
			content
		);

		if (affected === 1) {
			return res.send({
				ok: true,
				result: { id, teacher_id, executor_id: user.id },
			});
		} else {
			return res.send({
				ok: false,
				error: "정보가 정상적으로 수정되지 않았습니다.",
			});
		}
	} catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
	}
};

export const deleteCourseById = async (req, res) => {
	try {
		const user = req.user;
		user.id = 1;
		user.role = UserRole.Teacher;

		if (user.role !== UserRole.Teacher && user.role !== UserRole.Admin) {
			return res.send({ ok: false, error: "코스 삭제 권한이 없습니다." });
		}

		const id = parseInt(req.params?.id ?? "0");

		const courseRepository = AppDataSource.getRepository(Course);
		const course = await courseRepository.findOneBy({ id });

		if (!course) {
			return res.send({
				ok: false,
				error: "존재 하지 않는 코스입니다.",
			});
		}

		const teacher_id = course.teacher_id;

		if (user.role === UserRole.Teacher && teacher_id !== user.id) {
			return res.send({
				ok: false,
				error: "코스 삭제 권한이 없습니다.",
			});
		}

		const { affected } = await courseRepository.delete({ id, teacher_id });

		if (affected === 1) {
			return res.send({
				ok: true,
				result: { id, teacher_id, executor_id: user.id },
			});
		} else {
			return res.send({
				ok: false,
				error: "정보가 정상적으로 삭제되지 않았습니다.",
			});
		}
	} catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
	}
};

export const findUploadCourses = async (req, res) => {
	try {
		const user = req.user;
		user.id = 1;
		user.role = UserRole.Student;

		if (user.role !== UserRole.Teacher && user.role !== UserRole.Admin) {
			return res.send({
				ok: false,
				error: "코스 목록을 생성할 권한이 없습니다.",
			});
		}

		const teacher_id = user.id;

		const courseRepository = AppDataSource.getRepository(Course);
		const result = await courseRepository.find({ where: { teacher_id } });

		return res.send({ ok: true, result });
	} catch {
		return res.send({
			ok: false,
			error: "예기치 못한 에러가 발생하였습니다.",
		});
	}
};

export const joinCourse = async (req, res) => {
	try {
		const user = req.user;
		user.id = 1;
		user.role = UserRole.Student;

		const student_id = user.id;
		const classroom_id = parseInt(req.params?.id ?? "0");

		const courseRepository = AppDataSource.getRepository(Course);
		const id = classroom_id;

		const course = await courseRepository.findOneBy({
			id,
		});

		if (!course) {
			return res.send({
				ok: false,
				error: "존재 하지 않는 코스입니다.",
			});
		}

		const teacher_id = course.teacher_id;
		if (student_id === teacher_id) {
			return res.send({
				ok: false,
				error: "자신의 코스는 수강할 수 없습니다.",
			});
		}

		const userClassRoomRepository = AppDataSource.getRepository(UserClassroom);
		const userClassRoom = userClassRoomRepository.create({
			student_id,
			classroom_id,
		});

		const result = await userClassRoomRepository.save(userClassRoom);

		return res.send({ ok: true, result });
	} catch (e) {
		if (e.code === "ER_DUP_ENTRY") {
			return res.send({
				ok: false,
				error: "이미 수강중인 코스에 중복 신청 할수 없습니다.",
			});
		}

		return res.send({
			ok: false,
			error: "예기치 못한 에러가 발생하였습니다.",
		});
	}
};

export const findJoinCourses = async (req, res) => {
	try {
		const user = req.user;
		user.id = 1;
		user.role = UserRole.Student;

		const student_id = user.id;

		const userClassRoomRepository = AppDataSource.getRepository(UserClassroom);
		const result = await userClassRoomRepository.find({
			where: { student_id },
		});

		return res.send({ ok: true, result });
	} catch {
		return res.send({
			ok: false,
			error: "예기치 못한 에러가 발생하였습니다.",
		});
	}
};

export const cancelCourse = async (req, res) => {
	try {
		const user = req.user;
		user.id = 1;
		user.role = UserRole.Student;

		const student_id = user.id;

		const classroom_id = parseInt(req.params?.id ?? "0");

		const userClassRoomRepository = AppDataSource.getRepository(UserClassroom);
		const classroom = await userClassRoomRepository.findOneBy({
			classroom_id,
			student_id,
		});

		if (!classroom) {
			return res.send({
				ok: false,
				error: "수강 중인 코스가 아닙니다.",
			});
		}

		const id = classroom.id;
		const { affected } = await userClassRoomRepository.delete({ id });

		if (affected === 1) {
			return res.send({ ok: true, result: { id, classroom_id, student_id } });
		} else {
			return res.send({
				ok: false,
				error: "수강이 정상적으로 취소되지 않았습니다.",
			});
		}
	} catch {
		return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
	}
};
