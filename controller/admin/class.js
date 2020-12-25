const Model = require("../../model/schema");
const classes = Model.classModel;

const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/SRMS";
const conn = mongoose.connection.readyState;

classCreate = (req, res) => {
  res.render("admin/create-class");
  console.log(mongoose.connection.readyState);
};

doClassCreate = (req, res, next) => {
  console.log(req.body);
  classes
    .create(req.body)
    .then((resp) => {
      res.json(resp);
    })
    .catch((err) => {
      next(err);
    });
};

manageClasses = (req, res, next) => {
  classes
    .find({})
    .then((docs) => {
      res.render("admin/manage-class", {
        docs: docs,
      });
    })
    .catch((err) => {
      next(err);
    });
};

getClass = (req, res) => {
  classes.find({}).then((docs) => {
    res.json(docs);
  });
};

module.exports = {
  classCreate: classCreate,
  manageClasses: manageClasses,
  doClassCreate: doClassCreate,
  getClass: getClass,
};
