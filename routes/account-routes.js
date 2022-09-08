const express = require("express");
const router = express.Router();
const usersDao = require("../modules/users-dao.js");
const passwordFunctions = require("../modules/password.js");

router.get("/create", function (req, res) {
    res.locals.isNew = true;
    res.locals.user = req.cookies.userAccount;
    res.render("add-edit-account");
});

router.get("/resetPassword",function(req,res){
   res.render("reset-password");
});

router.get("/processResetPassword", async function(req,res){
    const currentPassword = req.query.currentPassword
    const currentUserId = req.cookies.currentuser
    const user = await usersDao.retrieveUserById(currentUserId)
    const userPassword = user.password
    if(passwordFunctions.comparePasswords(currentPassword,userPassword)){
        if(req.query.newPassword==req.query.newPassword2){
            const newUserPassword = await passwordFunctions.encryptPassword(req.query.newPassword)
            usersDao.updateUserPassword(currentUserId,newUserPassword)
            res.setToastMessage({message: "Reset Password Successful", type: "success"});
            res.redirect(`/accounts/${currentUserId}/edit`);
        }else{
            res.setToastMessage({message: "New Password does not match try again", type: "error"});  
            res.redirect("/accounts/resetPassword");
        }
        
    }else{
        res.setToastMessage({message: "Incorrect Old Password Try Again", type: "error"});
        res.redirect("/accounts/resetPassword");
    }
   
    
    
});

router.post("/create", async function (req, res) {

    const user = {
        id: req.body.id,
        username: req.body.username,
        password: req.body.password,
        password2: req.body.password2,
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        aboutMe: req.body.aboutMe,
        avatarId: req.body.avatarId
    }

    // save initial form values to a cookie in case user encounters an error
    res.cookie("userAccount", user);

    if (user.password !== user.password2) {
        res.setToastMessage({message: "Passwords don't match!", type: "error"});
        res.redirect("/accounts/create");
    } else {
        try {
            await usersDao.createUser(user);
            res.clearCookie("userAccount");
            res.setToastMessage({message: "Account creation successful. Please login using your new credentials.", type: "success"});
            res.redirect("/login");
        } catch (err) {
            console.log(err);
            res.setToastMessage({message: "That username was already taken!", type: "error"});
            res.redirect("/accounts/create");
        }
    }

});

router.post("/edit", async function (req, res) {

    const user = {
        id: req.body.id,
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        aboutMe: req.body.aboutMe,
        avatarId: req.body.avatarId
    };

    await usersDao.updateUserPersonalInfo(user);
    res.setToastMessage({message:"User profile has been updated!", type: "success"});
    res.redirect("/admin");

});

router.get("/:userId/edit", function (req, res) {
    res.locals.isNew = false;
    res.locals.inEditAccount = true; // Use to display the proper message in the confirmation message modal
    res.render("add-edit-account");
});

// Feature 2 router to retrieve all existing usernames.
router.get("/checkUsernameExists", async function (req, res) {
    const existingUsername = await usersDao.retrieveAllUsername();
    res.json(existingUsername);
});


module.exports = router;