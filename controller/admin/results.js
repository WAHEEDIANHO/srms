//-------Dependencies---------------------------
const multer = require("multer");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
//==================================================

//---------------Storage----------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/results");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage }).single("file");
//=============================================================

//-------------Database Model----------------------------------
const Model = require("../../model/schema");

const subjects = Model.subjects,
  classModel = Model.classModel,
  students = Model.students;
//===========================================================

//This is the only change
result = (req, res) => {
  classModel
    .find({}, "cname cnameNum")
    .then((classDocs) => {
      subjects.find({}, "sname scode").then((subjectDocs) => {
        res.render("admin/add-result", {
          classes: classDocs,
          subjects: subjectDocs,
        });
      });
    })
    .catch((err) => {
      next(err);
    });
};

addResult = (req, res, next) => {
  if (req.body.hasOwnProperty("sname")) {
    const { sname, sclass, subject } = req.body;
    const score = Number(req.body.score);

    if (score < 39) req.body.grade = "F";
    else if (score > 39 && score <= 49) req.body.grade = "D";
    else if (score > 49 && score <= 59) req.body.grade = "C";
    else if (score > 59 && score <= 69) req.body.grade = "B2";
    else if (score > 69 && score <= 79) req.body.grade = "B1";
    else if (score > 79 && score <= 89) req.body.grade = "A";
    else if (score > 89 && score <= 100) req.body.grade = "A+";
    else req.body.grade = "-";

    students
      .findOne({ fname: sname })
      .then((student) => {
        const resConfirm = student.result.find(
          (element) => element.subject === subject
        );
        if (!resConfirm) {
          student.result.push(req.body);
          student.save();
          res.json(student.result);
        } else {
          const err = new Error();
          err.message = `<strong>${subject}<strong/> result already upload for <strong>${sname}<strong/>`;
          err.status = 404;
          res.json(err);
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    upload(req, res, (err) => {
      if (!err) {
        const wb = xlsx.readFile(
          `${__dirname}/../../uploads/results/${req.file.filename}`
        );

        const ws = wb.Sheets["Science"];

        if (!ws) {
          const err = new Error();
          err.status = 404;
          err.message = "Invalid Document";
          res.json(err);
          fs.unlinkSync(
            `${__dirname}/../../uploads/results/${req.file.filename}`
          );
          return err;
        } else {
          const data = xlsx.utils.sheet_to_json(ws);

          //pushing data into DB
          (async function () {
            try {
              const totalSubjectErr = [];
              for (record in data) {
                let pos = record;
                const student = await students.findOne({
                  fname: data[pos].Fullname.toUpperCase(),
                });
                delete data[pos].Fullname;

                const subscore = Object.entries(data[pos]);

                const errSubject = [];
                subscore.map(async (element) => {
                  const [subject, score] = element;
                  Number(score);
                  //---------------------adjustment-----------------------------//
                  const resConfirm = await student.result.find(
                    (test) => test.subject === subject.toUpperCase()
                  );
                  if (!resConfirm) {
                    let grade = "-";
                    if (score < 39) grade = "F";
                    else if (score > 39 && score <= 49) grade = "D";
                    else if (score > 49 && score <= 59) grade = "C";
                    else if (score > 59 && score <= 69) grade = "B2";
                    else if (score > 69 && score <= 79) grade = "B1";
                    else if (score > 79 && score <= 89) grade = "A";
                    else if (score > 89 && score <= 100) grade = "A+";
                    else grade;
                    student.result.push({
                      subject: subject.toUpperCase(),
                      score: score,
                      grade: grade,
                    });
                  } else {
                    errSubject.push(resConfirm.subject);
                  }
                });
                await errSubject;
                errSubject.length === 0
                  ? student.save()
                  : totalSubjectErr.push({
                      name: student.fname,
                      errSubject: errSubject,
                    });
              }
              if (totalSubjectErr.length === 0) {
                res.json({ done: "success" });
                fs.unlinkSync(
                  `${__dirname}/../../uploads/results/${req.file.filename}`
                );
              } else {
                const err = new Error();
                err.status = 404;
                err.message = totalSubjectErr;
                res.json(err);
                fs.unlinkSync(
                  `${__dirname}/../../uploads/results/${req.file.filename}`
                );
              }
            } catch (error) {
              next(error);
            }
          })();
        }
      } else {
        next(err);
      }
    });
  }
};

module.exports = {
  result: result,
  addResult: addResult,
};
