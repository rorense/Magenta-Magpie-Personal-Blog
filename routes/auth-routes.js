const {v4: uuid} = require("uuid");
const express = require("express");
const router = express.Router();
const userDao = require("../modules/users-dao.js");
const articleDao = require("../modules/articles-dao");
const commentsDao = require("../modules/comments-dao");

router.get("/login", function (req, res) {

    if (res.locals.user) {
        res.setToastMessage({message: `Welcome back ${res.locals.user.name}`, type: "success"});
        res.redirect("/admin");
    } else {
        res.render("login");
    }
});

// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {

    // Get the username and password submitted in the form
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await userDao.retrieveUserWithCredentials(username, password);

    // if there is a matching user...
    if (user) {
        // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.cookie("currentuser", user.id);
        res.locals.user = user;
        res.setToastMessage({message: `Welcome back ${res.locals.user.name}`, type: "success"});
        res.redirect("/admin");
    }

    // Otherwise, if there's no matching user...
    else {
        // Auth fail
        res.locals.user = null;
        res.setToastMessage({message: "Authentication failed!", type: "error"});
        res.redirect("./login");
    }
});

// Whenever we navigate to /logout, delete the authToken cookie.
// redirect to "/login", supplying a "logged out successfully" message.
router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.clearCookie("currentUser")
    res.locals.user = null;
    res.setToastMessage({message: "Successfully logged out!", type: "success"});
    res.redirect("/");
});

// Delete all traces of data for the user and log them/him/her out of the site
router.get("/logoutAndDelete", function (req, res) {
    const currentUserId = req.cookies.currentuser;
    // Deleting the user will cascade the deletion to the other tables
    userDao.deleteUser(currentUserId);
    res.clearCookie("authToken");
    res.clearCookie("currentuser");
    res.locals.user = null;
    res.setToastMessage({message: "User Is Deleted!", type: "success"});
    res.redirect("/");
})

module.exports = router;