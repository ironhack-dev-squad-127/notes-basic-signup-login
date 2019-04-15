// routes/auth.js

const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const saltRounds = 12;
const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// This route takes the username and the password typed and create a user and redirect to "/login" in case of success
router.post("/signup", (req, res, next) => {
  // Shortcut for: const username = req.body.username
  const {username,password} = req.body

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "You need to enter a username and a password"
    })
    return // Stop the function
  }

  const salt  = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(password, salt)

  User.findOne({ username })
    .then(userFromDb => {
      if (userFromDb) {
        res.render('auth/signup', {
          errorMessage: `The username "${username}" is already taken`
        })
      }
      else {
        // Syntax 2 to create a user
        User.create({ username, password: hashedPassword})
          .then(() => {
            res.redirect("/login")
          })
      }
    })
});


  // // Syntax 1 to create a user
  // const myUser = new User({ 
  //   username, 
  //   password: hashedPassword
  // })
  // myUser.save()
  //   .then(() => {
  //     res.redirect("/login")
  //   })

module.exports = router;