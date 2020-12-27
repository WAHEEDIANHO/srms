const Model = require("../model/schema");
const subjects = Model.subjects,
  classModel = Model.classModel,
  students = Model.students;

const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/SRMS";
// const conn = mongoose.connect(url)

const path = require("path");

login = (req, res) => {
  res.render("student");
};

getResult = (req, res, next) => {
  if (!req.body) {
    res.json({ err: "u didn't input anything" });
  } else {
    const { rollId, sclass } = req.body;
    students
      .findOne({ rollId: rollId })
      .then((student) => {
        if (student.sclass === sclass) {
          res.render("result", {
            student: student,
          });
        } else {
          const err = new Error();
          err.status = 404;
          err.message = 'Student class doesn"t match rollID: ' + rollId;
          res.json(err);
        }
      })
      .catch((err) => next(err));
  }
};

// res.pdfFromHTML({
//     filename: 'generated.pdf',
//     html: path.resolve(__dirname, '../views/result.ejs'),
// });

module.exports = {
  login: login,
  getResult: getResult,
};
