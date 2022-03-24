import jwt from "jsonwebtoken";
import User from "../entity/user.entity";
import AppDataSource from "../db";

export const login = async (req, res) => {
  try {
    const { sub, email } = req.user;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
      sub,
      email,
    });
    if (user) {
      const token = jwt.sign(req.user, process.env.JWT_PRIVATEKEY);
      res.cookie("jwt", token, { httpOnly: true });
    } else {
      const newuser = userRepository.create({ sub, email });
      await userRepository.save(newuser);
    }
    return res.redirect("/");
  } catch {
    return res.send({ error: "404,Unauthorized" });
  }
};
