const jwt = require("jsonwebtoken");
const User  = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");
  
  if (authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }
  
  try {
    const { userId } = jwt.verify(authToken, "customized-secret-key");
    User.findById(userId).then((user) => {
      res.locals.user = user; // DB에서 사용자 정보를 가져오지 않아도 사용자 정보를 알 수 있음
                              // res.locals.user 라는 객체에 저장 해놔서
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return
  }
};
