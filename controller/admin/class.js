const Model = require('../../model/schema')
const classes = Model.classModel

const mongoose = require('mongoose')
const url = "mongodb://localhost:27017/SRMS"
const conn = mongoose.connect(url)


classCreate = (req, res) => {
    res.render('admin/create-class')
}

doClassCreate = (req, res, next) => {
    console.log(req.body)
    conn.then(db => classes.create(req.body))
        .then((resp) => {
            console.log(resp)
            res.json(resp)
        })
        .catch((err) => {
            // err = new Error('file already exist')
            console.log(err)
            return err
        })
        // console.log(req.body)
        // res.json(req.body)
}

manageClasses = (req, res) => {
    conn.then((db) => classes.find({}))
        .then((docs) => {
            res.render('admin/manage-class', {
                docs: docs
            })
        })
        .catch((err) => {
            console.log(err)
        })

}

module.exports = {
    classCreate: classCreate,
    manageClasses: manageClasses,
    doClassCreate: doClassCreate
}