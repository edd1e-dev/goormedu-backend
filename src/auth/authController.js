import jwt from "jsonwebtoken";
import User from "../users/user.entity";
import AppDataSource from "../db";

export const login = async (req, res) => {
  const { sub, email, picture, displayName } = req.user;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    sub,
    email
  });

  if (!user) {
		let newUser = userRepository.create({ 
      email,
      username: displayName,
      sub,
      role: "Student",
      createdAt: new Date(),
      updatedAt: new Date()
    });
		await userRepository.save(newUser); // await
	}

  const token = jwt.sign(req.user, process.env.JWT_PRIVATEKEY);
	res.cookie('jwt', token, { httpOnly: true }); // 나중에 https로 전환 시 수정 필요할 듯
  return res.redirect("/");
};
