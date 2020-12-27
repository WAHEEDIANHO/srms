const student = require("../student");

const classes = require("./class");

const subject = require("./subject");

const students = require("./student");

const results = require("./results");

const Staff = require("../../model/staff");

verifyUser = (req, res) => {
  res.redirect("/admin/dashboard");
};

doLogin = (req, res) => {
  res.render("admin/admin");
};

logout = (req, res) => {
  req.user ? req.session.destroy() && res.redirect("/") : res.redirect("/");
};

createAdmin = (req, res) => {
  console.log(req.body);
  req.body.pswrd = Staff.hashPswrd(req.body.pswrd);
  console.log(req.body.pswrd);
  Staff.create(req.body).then((user) => {
    console.log(user);
  });
};

module.exports = {
  doLogin: doLogin,
  logout: logout,
  verifyUser: verifyUser,
  createAdmin: createAdmin,
  subject: subject.subject,
  createSubject: subject.createSubject,
  classCreate: classes.classCreate,
  doClassCreate: classes.doClassCreate,
  studentAdmission: students.studentAdmission,
  dostudentAdmission: students.dostudentAdmission,
  manageClasses: classes.manageClasses,
  manageSubjects: subject.manageSubjects,
  manageStudent: students.manageStudent,
  result: results.result,
  addResult: results.addResult,
  getClass: classes.getClass,
  getStudent: students.getStudents,
};
