const Model = require('../model/schema')
const subjects = Model.subjects,
    classModel = Model.classModel,
    students = Model.students

const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/SRMS"
    // const conn = mongoose.connect(url)

const path = require('path')


login = (req, res) => {
    res.render('student')
}

getResult = (req, res, next) => {
    console.log(req.body)

    if (!req.body) {
        console.log('u send an empty body request')
    } else {
        const { rollId, sclass } = req.body
        students.findOne({ rollId: rollId })
            .then((student) => {
                if (student.sclass.indexOf(sclass) != 0) {
                    console.log(student)
                    res.render('result', {
                        student: student
                    })
                } else {
                    const err = new Error('Student doesn"t match rollID: ' + rollId)
                    next(err)
                }
            }).catch((err) => {
                console.log(err)
                next(err)
            })
    }

}

// res.pdfFromHTML({
//     filename: 'generated.pdf',
//     html: path.resolve(__dirname, '../views/result.ejs'),
// });

module.exports = {
    login: login,
    getResult: getResult
}