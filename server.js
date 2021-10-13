const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const lectures = require("./models/lectures");
const multer = require("multer");
const { diskStorage } = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const port = 8080;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/lectures", (req, res) => {
  models.Lecture.findAll({
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "price", "createdAt", "motivator", "imageUrl"],
  })
    .then((result) => {
      console.log("LECTURES : ", result);
      res.send({
        lectures: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러 발생");
    });
});

app.post("/lectures", (req, res) => {
  const body = req.body;
  const { name, price, motivator, description, imageUrl } = body;
  if (!name || !price || !motivator || !description || !imageUrl) {
    res.status(400).send("모든 정보를 입력해주세요");
  }
  models.Lecture.create({
    name,
    price,
    motivator,
    description,
    imageUrl,
  })
    .then((result) => {
      console.log("강의 업로드 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("강의 업로드에 문제 발생!");
    });
});

app.get("/lectures/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Lecture.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("LECTURE : ", result);
      res.send({
        lecture: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("에러가 났습니다.");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.listen(port, () => {
  console.log("베이아레나 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 실패");
      process.exit();
    });
});
