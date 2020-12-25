const Model = require("../../model/schema");
const subjects = Model.subjects;

const mongoose = require("mongoose");
// const url = "mongodb://localhost:27017/SRMS"
// const conn = mongoose.connect(url)

subject = (req, res) => {
  res.render("admin/subject");
};

createSubject = (req, res) => {
  console.log(req.body);
  subjects
    .create(req.body)
    .then((resp) => {
      console.log(resp);
      res.json(resp);
    })
    .catch((err) => {
      console.log(err);
    });
};

manageSubjects = (req, res) => {
  subjects.find({}).then((docs) => {
    res.render("admin/manage-subject", {
      docs: docs,
    });
  });
};

module.exports = {
  subject: subject,
  createSubject: createSubject,
  manageSubjects: manageSubjects,
};
