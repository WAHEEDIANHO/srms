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
      Staff.findOne({ email: email })
        .then(
          (user) => {
            if (!user) {
              const err = new Error("User didn't exist");
              done(err, err);
            }
            return done(null, user);
          },
          (err) => done(err, err)
        )
        .catch((err) => {
          done(err, err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Staff.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, err));
});

exports.comfirmUser = (req, res, next) =>
  req.user ? next() : res.redirect("/");
exports.verifyUser = passport.authenticate("local-login");

// module.exports = passport;
