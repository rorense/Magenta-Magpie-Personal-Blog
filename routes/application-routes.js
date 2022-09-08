const express = require("express");
const router = express.Router();

const {verifyAuthenticated} = require("../middleware/auth-middleware.js");
const paginate = require("../middleware/pagination-middleware");

const articleDao = require("../modules/articles-dao.js");
const usersDao = require("../modules/users-dao.js");

const newsApi = require("../modules/news-api.js");

router.get("/", paginate(), async function (req, res) {
    res.locals.onHomepage = true;
    res.locals.latestNews = await newsApi.getTopHeadlines("4");
    res.locals.paginatedResults.targetUrl = {path: "/", anchor: "top"};
    res.render("home");
});

// Whenever we navigate to /, verify that we're authenticated. If we are, render the home view.
router.get("/admin", verifyAuthenticated, async function (req, res) {
    res.locals.title = "Blog Admin Page";
    res.locals.articles = await articleDao.getAllArticlesByCreatedBy(res.locals.user.id);
    res.locals.onAdminPage = true;
    res.render("admin");
});

router.get("/search", paginate(), async function (req, res) {
    const keywords = req.query.keyword
    res.locals.keywords = keywords
    const articles = await articleDao.getArticleBySearch(keywords)
    res.locals.paginatedResults.targetUrl = {path: `/search?keyword=${keywords}`, anchor: "top"};
    if (articles.length == 0) {
        const articleIsEmpty = true;
        res.locals.articleIsEmpty = articleIsEmpty
    }
    res.render("articles-by-search")
});

router.get("/about", function (req, res) {

    const about = [
        {
            name: "Christofer Raymond Salim",
            imageUrl: "/images/about/Christofer Salim-Photo.jpg",
            role: "Full-Stack Developer",
            about: "Christofer is a Chemistry & Environmental Science graduate who likes to play games, watch anime, and code during his spare time, and is also an avid football player!"
        },
        {
            name: "John Michael Pineda",
            imageUrl: "/images/about/John Pineda - Photo.jpg",
            role: "Full-Stack Developer / Technical Lead",
            about: "John is currently working for The University of Auckland as a PeopleSoft Developer. On his free time, he loves binge-watching series and movies. His hobbies are building Gunpla model kits and travelling with his wife."
        },
        {
            name: "Ryan Orense",
            imageUrl: "/images/about/Ryan Orense - Photo.jpg",
            role: "Full-Stack Developer",
            about: "Ryan is a recent mechanical engineering graduate from University of Auckland with a reignited passion for coding. He spends his spare time running, taking photographs and cooking!"
        }
    ]

    res.locals.about = about;

    res.render("about");
});

router.get("/contactUs", function (req, res) {
    res.render("contact-us");
});

module.exports = router;