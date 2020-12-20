const express = require("express"),
  controller = require("../controller"),
  admin = require("../controller/admin/admin"),
  path = require("path"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  authenticate = require("../authentication"),
  session = require("express-session"),
  student = require("../controller/student");

const app = express();
const port = 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-pdf"));
app.use("/public", express.static(`${__dirname}/../public`));
app.set("view engine", "ejs");
app.use(
  session({
    name: "session-id",
    secret: "1234-7875-6783-9876-5468",
    saveUninitialized: false,
    resave: false,
  })
);
//-------------DataBase------------------------------------------
const url = "mongodb://localhost:27017/SRMS";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("connected", () => {
  console.log("conected successfully to database");
})
  .on("error", (err) => {
    console.log(err);
  })
  .once("disconnected", () => {
    console.log("database disconnected");
  });
//-------------------------------Route----------------------------
//Home page
app.get("/", controller.home);

app.use(passport.initialize());
app.use(passport.session());

// Student Login
app.get("/student/login", student.login);
app.post("/student/result", student.getResult);

//admin
app.get("/admin/dashboard", admin.doLogin);
app.post("/admin/dashboard", authenticate.verifyUser, admin.verifyUser);
app.post("/crateadmin", admin.createAdmin);

//subject
app.get("/admin/subject", admin.subject);
app.post("/admin/subject", admin.createSubject);
app.get("/admin/manage-subject", admin.manageSubjects);

//class
app.get("/admin/create-class", admin.classCreate);
app.post("/admin/create-class", admin.doClassCreate);
app.get("/admin/manage-classes", admin.manageClasses);

//student
app.get("/admin/add-student", admin.studentAdmission);
app.post("/admin/add-student", admin.dostudentAdmission);
app.get("/admin/manage-student", admin.manageStudent);

//Result
app.get("/admin/add-result", admin.result);
app.post("/admin/add-result", admin.addResult);
// app.get('/admin/manage-result', admin.manageResult)

app.listen(port, () => console.log(`Example app listening on ${port} port!`));
