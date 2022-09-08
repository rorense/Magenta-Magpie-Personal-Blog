const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function getAllArticles() {
    const db = await dbPromise;
    return await db.all(SQL`select id,
                                   category,
                                   categoryName,
                                   title,
                                   content,
                                   truncatedContent,
                                   createdBy,
                                   authorName,
                                   lastUpdated,
                                   coverPhoto
                            from articles_authors_view
                            order by lastUpdated desc`);
}

async function getOtherArticles(excludeId) {
    const db = await dbPromise;
    return await db.all(SQL`select id,
                                   category,
                                   categoryName,
                                   title,
                                   content,
                                   truncatedContent,
                                   createdBy,
                                   authorName,
                                   lastUpdated,
                                   coverPhoto
                            from articles_authors_view
                            where id <> ${excludeId}
                            order by lastUpdated desc limit 6`);
}

async function createOrUpdateArticle(article) {

    const db = await dbPromise;

    if (article.id === "NEW") {
        const result = await db.run(SQL`insert into articles(category, title, content, createdBy, lastUpdated, coverPhoto)
                                        values (${article.category}, ${article.title}, ${article.content},
                                                ${article.createdBy},
                                                datetime('now'), ${article.coverPhoto})`);
        result.lastID;
    } else {
        await db.run(SQL`update articles
                         set category    = ${article.category},
                             title       = ${article.title},
                             content     = ${article.content},
                             lastUpdated = datetime('now')
                         where id = ${article.id}`);

        if (article.coverPhoto !== undefined) {
            await db.run(SQL`update articles
                             set coverPhoto = ${article.coverPhoto}
                             where id = ${article.id}`);
        }
    }
}

async function getAllArticlesByCreatedBy(createdBy) {
    const db = await dbPromise;
    return await db.all(SQL`select id,
                                   category,
                                   categoryName,
                                   title,
                                   content,
                                   truncatedContent,
                                   createdBy,
                                   authorName,
                                   lastUpdated,
                                   coverPhoto
                            from articles_authors_view
                            where createdBy = ${createdBy}
                            order by lastUpdated desc`);
}

async function getArticleById(id) {
    const db = await dbPromise;
    return await db.get(SQL`select id,
                                   category,
                                   categoryName,
                                   title,
                                   content,
                                   truncatedContent,
                                   createdBy,
                                   authorName,
                                   lastUpdated,
                                   coverPhoto
                            from articles_authors_view
                            where id = ${id}`);
}

async function getArticlesByCategory(id) {
    const db = await dbPromise;
    return await db.all(SQL`select id,
                                   category,
                                   categoryName,
                                   title,
                                   content,
                                   truncatedContent,
                                   createdBy,
                                   authorName,
                                   lastUpdated,
                                   coverPhoto
                            from articles_authors_view
                            where category = ${id}
                            order by lastUpdated desc`);

}

async function getArticleBySearch(string) {
    const db = await dbPromise;
    return await db.all(SQL`select id,
                                   category,
                                   categoryName,
                                   title,
                                   content,
                                   truncatedContent,
                                   createdBy,
                                   authorName,
                                   lastUpdated,
                                   coverPhoto
                            from articles_authors_view
                            where upper(content) like upper('%' || ${string} || '%')
                               or upper(title) like upper('%' || ${string} || '%')
                               or upper(authorName) like upper('%' || ${string} || '%')
                            order by lastUpdated desc`);
}

async function deleteArticleById(id) {
    const db = await dbPromise;
    return await db.run(`
        delete
        from articles
        where id = ${id}`);
}

async function deleteArticleByCreatedById(id) {
    const db = await dbPromise;
    await db.run(SQL`
        delete
        from articles
        where createdBy = ${id}`);
}

// Export functions.
module.exports = {
    getAllArticles,
    getOtherArticles,
    createOrUpdateArticle,
    getAllArticlesByCreatedBy,
    getArticleById,
    getArticlesByCategory,
    getArticleBySearch,
    deleteArticleById,
    deleteArticleByCreatedById
};