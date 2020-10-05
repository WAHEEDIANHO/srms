const express = require('express'),
    controller = require('../controller'),
    admin = require('../controller/admin/admin'),
    student = require('../controller/student');


const app = express()
const port = 3030

app.use(require('body-parser')());
app.use('/public', express.static(`${__dirname}/../public`))
app.set('view engine', 'ejs')

// function auth(req, res, next) {
//     console.log(req.headers)

//     const authHeader = req.headers.authorization
//     if (!authHeader) {
//         const err = new Error('you are not authenticated')
//         res.setHeader('WWW-Authenticate', 'Basic')
//         err.status = 401
//         next(err)
//     } else {
//         const auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':')

//         const username = auth[0],
//             password = auth[1];

//         if (username === "admin" && password === "admin") {
//             next()
//         } else {
//             const err = new Error('username and password do not match')
//             res.setHeader('WWW-Authenticate', 'Basic')
//             err.status = 401
//             return next(err)
//         }
//     }
// }

// app.use(auth)

//Home page
app.get('/', controller.home)

// Student Login
app.get('/student/login', student.login)

//admin
app.post('/admin/dashboard', admin.doLogin)

//subject
app.get('/admin/subject', admin.subject)
app.post('/admin/subject', admin.createSubject)
app.get('/admin/manage-subject', admin.manageSubjects)

//class
app.get('/admin/create-class', admin.classCreate)
app.post('/admin/create-class', admin.doClassCreate)
app.get('/admin/manage-classes', admin.manageClasses)


//student
app.get('/admin/add-student', admin.studentAdmission)
app.post('/admin/add-student', admin.dostudentAdmission)
app.get('/admin/manage-student', admin.manageStudent)

//Result
app.get('/admin/add-result', admin.result)
    // app.post('/admin/add-result', admin.doResult)
    // app.get('/admin/manage-result', admin.manageResult)



app.listen(port, () => console.log(`Example app listening on ${port} port!`))