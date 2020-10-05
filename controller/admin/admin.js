const student = require("../student")

const classes = require('./class')

const subject = require('./subject')

const students = require('./student')

const results = require('./results')

doLogin = (req, res) => {
    res.render('admin/admin')
}




module.exports = {
    doLogin: doLogin,
    subject: subject.subject,
    createSubject: subject.createSubject,
    classCreate: classes.classCreate,
    doClassCreate: classes.doClassCreate,
    studentAdmission: students.studentAdmission,
    dostudentAdmission: students.dostudentAdmission,
    manageClasses: classes.manageClasses,
    manageSubjects: subject.manageSubjects,
    manageStudent: students.manageStudent,
    result: results.result
}