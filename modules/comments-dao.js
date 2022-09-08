const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function addCommentsToTable(comments) {
    const db = await dbPromise;
    const result = await db.run(
        SQL`insert into comments (guestUser, registeredUser, comments, articleId, lastUpdated, replyToComment)
            values (${comments.guestUser}, ${comments.registeredUser}, ${comments.comments}, ${comments.articleId},
                    datetime('now'), ${comments.replyToComment})`
    );
}

async function getCommentsForArticle(id) {
    const db = await dbPromise
    return await db.all(SQL`select id,
                                   guestUser,
                                   registeredUser,
                                   comments,
                                   commentorName,
                                   articleId,
                                   lastUpdated,
                                   replyToComment,
                                   avatarId
                            from comments_users_view
                            where articleId = ${id}
                              and replyToComment is null
                            order by lastUpdated desc`);
}

async function getCommentReplies(id) {
    const db = await dbPromise
    return await db.all(SQL`select id,
                                   guestUser,
                                   registeredUser,
                                   comments,
                                   commentorName,
                                   articleId,
                                   lastUpdated,
                                   replyToComment,
                                   avatarId
                            from comments_users_view
                            where replyToComment = ${id}
                            order by lastUpdated desc`);
}

async function updateComment(id, comments) {
    const db = await dbPromise;
    await db.run(SQL`update comments
                     set comments = ${comments}
                     where id = ${id}`);
}

async function deleteACommentById(id) {
    const db = await dbPromise;
    await db.run(SQL`delete
                     from comments
                     where id = ${id}`);
}

async function deleteAllCommentsById(id) {
    const db = await dbPromise;
    await db.run(SQL`delete
                     from comments
                     where replyToComment = ${id}`);
    await db.run(SQL`delete
                     from comments
                     where id = ${id}`);
}

async function deleteAllChildCommentsByRegisteredUserId(id) {
    const db = await dbPromise;
    // Check all comments made by user
    // If there are comments that have replies to it, delete those first
    await db.run(SQL`delete
                     from comments
                     where replyToComment in (select id from comments where registeredUser = ${id})`);
}

async function deleteAllParentCommentsByRegisteredUserId(id) {
    const db = await dbPromise;
    await db.run(SQL`delete
                     from comments
                     where registeredUser = ${id}`);
}


async function getCommentsCountByArticleId(id) {
    const db = await dbPromise;
    return await db.get(SQL`select count(*) count
                            from comments
                            where articleId = ${id}
                               or replyToComment = ${id}`);
}

module.exports = {
    addCommentsToTable,
    getCommentsForArticle,
    getCommentReplies,
    updateComment,
    deleteACommentById,
    deleteAllCommentsById,
    deleteAllChildCommentsByRegisteredUserId,
    deleteAllParentCommentsByRegisteredUserId,
    getCommentsCountByArticleId
};