const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Staff = require("./model/staff");

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "pswrd",
      passReqToCallback: true,
    },
    (req, email, pswrd, done) => {
      console.log(email);
      Staff.findOne({ email: email })
        .then(
          (user) => {
            console.log(user);
            if (!user) {
              const err = new Error("User didn't exist");
              done(err, err);
            }
            return done(null, user);
          },
          (err) => {
            console.log(err);
          }
        )
        .catch((err) => {
          console.log(err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  return done(null, id);
  Staff.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      console.log(err);
    });
});
exports.comfirmUser = (req, res, next) => {
  console.log(req.user);
  req.user ? next() : res.end("<h1>You are not authenticated</h1>");
};
exports.verifyUser = passport.authenticate("local-login");

// module.exports = passport;
