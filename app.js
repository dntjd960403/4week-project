const express = require("express");
const mongoose = require("mongoose");
const router = require('./routes');
const app = express();

mongoose.connect("mongodb://localhost/4weeks-project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));


app.use(express.json());
app.use("/", express.urlencoded({ extended: false }), router);

app.get("/", (req, res) => {
    res.send('블로그 만들기 힘드네')
})

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});