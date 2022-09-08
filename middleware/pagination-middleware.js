const articleDao = require("../modules/articles-dao.js");

function paginate() {

    return async function (req, res, next) {

        const filterByCategoryId = req.params.categoryId;
        const filterByAuthorId = req.params.authorId;
        const filterBySearch = req.query.keyword;
        let allArticles = [];
        if (filterByCategoryId !== undefined) {
            allArticles = await articleDao.getArticlesByCategory(filterByCategoryId);
        } else if (filterByAuthorId !== undefined) {
            allArticles = await articleDao.getAllArticlesByCreatedBy(filterByAuthorId);
        } else if(filterBySearch !== undefined){
            allArticles = await articleDao.getArticleBySearch(filterBySearch)       
        }
        else {
            allArticles = await articleDao.getAllArticles();
        }

        let currentPage = parseInt(req.query.page);
        // let limit = parseInt(req.query.limit);
        let limit = Number.NaN;

        if (Number.isNaN(currentPage) || currentPage < 1) {
            currentPage = 1;
        }
        if (Number.isNaN(limit) || limit < 1) {
            limit = 10;
        }

        const totalArticlesCount = allArticles.length;
        const totalPageNumbers = Math.ceil(totalArticlesCount / limit); // total number of pages with {limit} number of articles per page

        const startIndex = (currentPage - 1) * limit;
        const endIndex = currentPage * limit;
        const articles = allArticles.slice(startIndex, endIndex);

        // display only 3 page buttons at a time
        // user to use previous and next buttons
        let previousPage = currentPage - 1;
        let nextPage = currentPage + 1;

        if (previousPage < 1) {
            previousPage = 0;
        }
        if (nextPage > totalPageNumbers) {
            nextPage = 0;
        }

        res.locals.paginatedResults = {
            currentPage: currentPage,
            limit: limit,
            previousPage: previousPage,
            nextPage: nextPage,
            totalPageNumbers: totalPageNumbers,
            targetUrl: null, // populated from router level
            articles: articles
        };

        next();

    }
        ;
}

module.exports = paginate;