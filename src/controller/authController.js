export const login = (req, res) => {
  console.log(req?.user);
  return res.redirect("/");
};
