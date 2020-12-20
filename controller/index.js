const passport = require('passport')

module.exports.home = (req, res) => {
    res.render('index')
}