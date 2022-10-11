const express = require("express");
const router = require('./routes');
const app = express();

app.use(express.json());
app.use("/", express.urlencoded({ extended: false }), router);

app.get("/", (req, res) => {
    res.send('블로그 만들기 힘드네')
})

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});