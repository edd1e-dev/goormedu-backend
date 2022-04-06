import Category from "./category.entity";
import AppDataSource from "../db";

/**
 * 전체 카테고리를 조회
 * /category
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const getAllCategory = async (req, res) => {
  try {
    const result = await AppDataSource.getRepository(Category).find( { select: ['id', 'title'] });
    return res.send({ result });
  } catch {
    return res.send({ ok: false, error: "예기치 못한 에러가 발생하였습니다." });
  }
};

export default getAllCategory;