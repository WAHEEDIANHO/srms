const Model = require("../../model/schema");
const subjects = Model.subjects;

const mongoose = require("mongoose");

subject = (req, res) => {
  res.render("admin/subject");
};

createSubject = (req, res, next) => {
  subjects
    .create(req.body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      next(err);
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
