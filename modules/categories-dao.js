const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getAllCategories() {
    const db = await dbPromise;
    return await db.all(SQL`select a.id,
                                   a.name,
                                   a.description
                            from categories a
                            order by a.id`);
}

async function getCategoryById(id) {
    const db = await dbPromise;
    return await db.get(SQL`select a.id,
                                   a.name,
                                   a.description
                            from categories a
                            where a.id = ${id}`);
}

// Export functions
module.exports = {
    getAllCategories,
    getCategoryById
};