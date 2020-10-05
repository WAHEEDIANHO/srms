const Model = require('../../model/schema')
const students = Model.students

const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/SRMS"
const conn = mongoose.connect(url)

studentAdmission = (req, res) => {
    res.render('admin/add-student')
}

dostudentAdmission = (req, res) => {
    conn.then((db) => students.create(req.body))
        .then((resp) => {
            console.log(resp)
        })
        .catch((err) => {
            console.log(err)
        })
        // console.log(req.body)
    res.json(req.body)
}

manageStudent = (req, res) => {
    conn.then((db) => students.find({}))
        .then((docs) => {
            res.render('admin/manage-student', {
                docs: docs
            })
        })
}

module.exports = {
    studentAdmission: studentAdmission,
    dostudentAdmission: dostudentAdmission,
    manageStudent: manageStudent
}