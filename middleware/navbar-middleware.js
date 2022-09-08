const categoryDao = require("../modules/categories-dao.js");

async function navbar(req, res, next) {

    // Build Category dropdown list in main view
    const categories = await categoryDao.getAllCategories();
    res.locals.categories = categories;

    next();

}

module.exports = navbar;