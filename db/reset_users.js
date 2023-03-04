const client = require("./client")

async function createResetUser({
    userId
}) {
    try{
        const { rows: [reset_user] } = await client.query(`
            INSERT INTO reset_users("userId")
            VALUES ($1)
            RETURNING *;
        `, [userId])

        return reset_user;
    } catch (error) {
        console.error(error)
    }
}

async function getAllResetUsers() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM reset_users
        `);

        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function deleteResetUser(id) {
    try{
        const { rows: [ reset_user ] } =   await client.query(`
            DELETE FROM reset_users
            WHERE id=$1
            RETURNING *;
    `, [id])

        return reset_user;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createResetUser,
    getAllResetUsers,
    deleteResetUser
};