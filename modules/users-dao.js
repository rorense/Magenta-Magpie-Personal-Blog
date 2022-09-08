const SQL = require("sql-template-strings");
const dbPromise = require("../modules/database.js");
const hasher = require("../modules/password.js");

/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 *
 * @param user the user to insert
 */
async function createUser(user) {

    // encrypt password before saving to database
    const encryptedPassword = await hasher.encryptPassword(user.password);

    const db = await dbPromise;

    const result = await db.run(SQL`
        insert into users (username, password, name, dateOfBirth, aboutMe, avatarId)
        values (${user.username}, ${encryptedPassword}, ${user.name}, ${user.dateOfBirth}, ${user.aboutMe},
                ${user.avatarId})`);

    // Get the auto-generated ID value, and assign it back to the user object.
    user.id = result.lastID;
}

// Update user's editable personal information only
async function updateUserPersonalInfo(user) {

    const db = await dbPromise;

    await db.run(SQL`
        update users
        set name    = ${user.name},
            dateOfBirth     = ${user.dateOfBirth},
            aboutMe = ${user.aboutMe},
            avatarId  = ${user.avatarId}
        where id = ${user.id}`);
}


/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 *
 * @param {number} id the id of the user to get.
 */
async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select id, username, password, name, dateOfBirth, aboutMe, avatarId, authToken
        from users
        where id = ${id}`);

    return user;
}

/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 *
 * @param {string} username the user's username
 * @param {string} password the user's password
 */
async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const maybeUser = await db.get(SQL`select id, username, password, name, dateOfBirth, aboutMe, avatarId, authToken
                                       from users
                                       where username = ${username}`);

    if (maybeUser !== undefined) {
        const passwordMatches = await hasher.comparePasswords(password, maybeUser.password);
        if (passwordMatches) {
            return maybeUser;
        }
    }

    return undefined;
}

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 *
 * @param {string} authToken the user's authentication token
 */
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select id, username, password, name, dateOfBirth, aboutMe, avatarId, authToken
        from users
        where authToken = ${authToken}`);

    return user;
}

/**
 * Gets the user with the given username from the database.
 * If there is no such user, undefined will be returned.
 *
 * @param {string} username the user's username
 */
async function retrieveUserByUsername(username) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select id, username, password, name, dateOfBirth, aboutMe, avatarId, authToken
        from users
        where username = ${username}`);

    return user;
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`select id, username, password, name, dateOfBirth, aboutMe, avatarId, authToken
                                   from users`);

    return users;
}

/**
 * Updates the given user in the database, not including auth token
 *
 * @param user the user to update
 */
async function updateUser(user) {
    const db = await dbPromise;

    await db.run(SQL`
        update users
        set username  = ${user.username},
            password  = ${user.password},
            name      = ${user.name},
            authToken = ${user.authToken}
        where id = ${user.id}`);
}
async function updateUserPassword(userId,newPassword) {
    const db = await dbPromise;

    await db.run(SQL`
        update users
        set password  = ${newPassword}
        where id = ${userId}`);
}

/**
 * Deletes the user with the given id from the database.
 *
 * @param {number} id the user's id
 */
async function deleteUser(id) {
    const db = await dbPromise;

    await db.run(SQL`
        delete
        from users
        where id = ${id}`);
}


/**
 * Gets an array of all username from the database.
 */
 async function retrieveAllUsername() {
    const db = await dbPromise;

    const users = await db.all(SQL`select username
                                   from users
                                   `);

    return users;
}

// Export functions.
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveUserByUsername,
    retrieveAllUsers,
    updateUser,
    updateUserPassword,
    deleteUser,
    updateUserPersonalInfo,
    retrieveAllUsername
};