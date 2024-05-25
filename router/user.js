const express = require('express');
const router = express.Router();
let User = require('../models/user');

router.get('/login', function (req, res) {
    res.render('login')
});

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/user/login')
    });
});

router.post('/login', async function (req, res) {
    let query = { username: req.body.username, password: req.body.password };
    try {
        const user = await User.findOne(query);
        if (user) {
            req.session.username = user.username;
            res.redirect('/');
        } else {
            req.flash("danger", "Invalid login")
            res.render('login');
        }
    } catch (err) {
        console.error(err);
        res.render('login');
    }
});

router.get('/signup', function (req, res) {
    res.render('signup')
});

router.post('/signup', function (req, res) {
        const { username, password, confirm_password } = req.body;
        if(!username||!password||!confirm_password){
            req.flash("danger", "Enter Details");
            res.redirect("/user/signup");
            return;
        }
        if (password !== confirm_password) {
            req.flash("danger", "Passwords do not match");
            res.redirect("/user/signup");
            return;
        }
        User.findOne({ username })
            .then(existingUser => {
                if (existingUser) {
                    req.flash("danger", "Username already exists");
                    res.redirect("/user/signup");
                } else {
                    const newUser = new User({ username, password });
                    return newUser.save();
                }
            })
            .then(newUser => {
                req.session.username = newUser.username;
                res.redirect('/');
            })
            .catch(err => {
                console.error(err);
                res.render('signup', { error: 'An error occurred' });
            });
    });

module.exports = router;