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
// result = (req, res) => {
//     classModel.find({}, "cname cnameNUm")
//         .then((classDocs) => {
//             subjects.find({}, "sname scode")
//                 .then((subjectDocs) => {
//                     students.find({})
//                         .then((studentDocs) => {
//                             console.log(classDocs)
//                             console.log(subjectDocs)
//                             console.log(studentDocs)
//                             res.render('admin/add-result', {
//                                 classes: classDocs,
//                                 subjects: subjectDocs,
//                                 students: studentDocs,
//                             })
//                         })
//                 })
//         })
//         .catch((err) => {
//             console.log(err)
//         })
// }

result = (req, res) => {
  res.render("admin/add-result");
};

addResult = (req, res, next) => {
  console.log(req.body);
  console.log(req.body.hasOwnProperty("sname"));

  if (req.body.hasOwnProperty("sname")) {
    console.log(req.body);
    const { sname, sclass, subject, score } = req.body;
    students
      .findOne({ fname: sname })
      .then((student) => {
        if (student.sclass === sclass) {
          const resConfirm = student.result.find(
            (element) => element.subject === subject
          );
          if (!resConfirm) {
            student.result.push(req.body);
            student.save();
          } else {
            const err = new Error("Subject result already declared");
            // next(err)
            // res.json(err)
          }
        } else {
          const err = new Error(
            `Hi you select the wrong class to student ${sname}`
          );
          next(err);
        }
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else {
    // console.log(req.file)
    upload(req, res, (err) => {
      if (!err) {
        const wb = xlsx.readFile(
          `${__dirname}/../../uploads/results/${req.file.filename}`
        );
        console.log(wb.SheetNames);

        const ws = wb.Sheets["Science"];
        // console.log(ws)
        const data = xlsx.utils.sheet_to_json(ws);
        console.log(data);

        //pushing data into DB
        data.forEach((record) => {
          students.findOne({ fname: record.Fullname }).then((student) => {
            delete record.Fullname;

            //    const subject = Object.keys(record)
            const subscore = Object.entries(record);
            // const subscoreObj = new Object()
            const arr = [];

            subscore.forEach((element) => {
              // console.log(element[0])

              //---------------------adustment-----------------------------//
              const resConfirm = student.result.find(
                (test) => test.subject === element[0]
              );
              if (!resConfirm) {
                student.result.push({ subject: element[0], score: element[1] });
                // student.save()
              } else {
                const err = new Error("Subject result already declared");
                // console.log(err)
                // next(err)
                // res.json(err)
                return false;
              }
              //---------------------end----------------------------------//
              // arr.push(subscoreObj)
            });
            // console.log(subscore)
            console.log(student.result);
            student.save();
            // student.result.push({ subject: "", score: "" })
            // console.log(record)
          });
        });
        res.json(req.file);

        fs.unlinkSync(
          `${__dirname}/../../uploads/results/${req.file.filename}`
        );
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
