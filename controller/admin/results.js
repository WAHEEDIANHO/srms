const Model = require('../../model/schema')
const subjects = Model.subjects,
    classModel = Model.classModel,
    students = Model.students

const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/SRMS"
const conn = mongoose.connect(url)

result = (req, res) => {
    conn.then(() => {
        classModel.find({}, "cname cnameNUm")
            .then((classDocs) => {
                subjects.find({}, "sname scode")
                    .then((subjectDocs) => {
                        students.find({})
                            .then((studentDocs) => {
                                console.log(classDocs)
                                console.log(subjectDocs)
                                console.log(studentDocs)
                                res.render('admin/add-result', {
                                    classes: classDocs,
                                    subjects: subjectDocs,
                                    students: studentDocs
                                })
                            })
                    })
            })
    }).catch((err) => {
        console.log(err)
    })
}

module.exports = {
    result: result
}