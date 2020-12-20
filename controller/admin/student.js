const multer = require("multer");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const Model = require("../../model/schema");
const students = Model.students;

//---------------Storage----------------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/student");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage }).single("file");

// const url = "mongodb+srv://OGIDI:WAHEEDianho@cluster0.v6rr3.mongodb.net/SRM?retryWrites=true&w=majority"

studentAdmission = (req, res) => {
  res.render("admin/add-student");
};

dostudentAdmission = (req, res) => {
  if (req.body.hasOwnProperty("fname")) {
    console.log(req.body);
    students
      .create(req.body)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(req.body)
    res.json(req.body);
  } else {
    upload(req, res, (err) => {
      console.log(req.file);
      res.json(req.file);
      //------------Todo after successful upload----------------//

      const wb = xlsx.readFile(
        `${__dirname}/../../uploads/student/${req.file.filename}`,
        { cellDates: true }
      );
      console.log("This is: " + wb.SheetNames);

      const ws = wb.Sheets["Student"];
      // console.log(ws)

      const data = xlsx.utils.sheet_to_json(ws);

      // console.log(data)
      data.forEach((student) => {
        const { Fullname, DoB, Gender, Class, Roll_Id } = student;
        students
          .findOne({ rollId: `SRM/2020/0${Roll_Id}` })
          .then((user) => {
            if (!user) {
              console.log(Roll_Id);
              students
                .create({
                  fname: Fullname,
                  rollId: `SRM/2020/0${Roll_Id}`,
                  gender: Gender,
                  sclass: Class,
                  dob: DoB,
                })
                .then((newStu) => {
                  console.log(newStu);
                });
            } else {
              const err = new Error("You already exit");
              console.log(err);
              next(err);
            }
          })
          .catch((err) => next(err));
      });
      fs.unlinkSync(`${__dirname}/../../uploads/student/${req.file.filename}`);

      // console.log(data)
      // const sname = data.map((record) => {
      // const { Firstname, Surname, DoB, Gender, Class, Roll_Id } = record
      // record.Fullname = `${record.Surname} ${record.Firstname}`
      //    delete Firstname
      //    delete Surname
      //    delete DoB
      // delete { Firstname, Surname, DoB, Gender, Class, Roll_Id }
      // return record
      // });
      // console.log(sname)
      // const newWB = xlsx.utils.book_new()
      // const newWS = xlsx.utils.json_to_sheet(sname)
      // xlsx.utils.book_append_sheet(newWB, newWS, "Subjectname")
      // fs.mkdirSync(`${__dirname}/../../uploads/results`, { recursive: true })
      // fs.writeFileSync(newWB, "utf8", `${__dirname}/../../uploads/results/result.xlsx`)
      // xlsx.writeFile(newWB, `${__dirname}/../../uploads/results/result.xlsx`, { recursive: true })

      // students.deleteMany((err) => {
      //     console.log('delete ')
      // })
      //==========================================================
    });
  }
};

manageStudent = (req, res) => {
  students.find({}).then((docs) => {
    res.render("admin/manage-student", {
      docs: docs,
    });
  });
};

module.exports = {
  studentAdmission: studentAdmission,
  dostudentAdmission: dostudentAdmission,
  manageStudent: manageStudent,
};
