const client = require("./client")

async function createInactiveUser({
    userId
}) {
    try{
        const { rows: [inactive_user] } = await client.query(`
            INSERT INTO inactive_users("userId")
            VALUES ($1)
            RETURNING *;
        `, [userId])

        return inactive_user;
    } catch (error) {
        console.error(error)
    }
}

async function getAllInactiveUsers() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM inactive_users
        `);

        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function deleteInactiveUser(id) {
    try{
        const { rows: [ inactive_user ] } =   await client.query(`
            DELETE FROM inactive_users
            WHERE id=$1
            RETURNING *;
    `, [id])

        return inactive_user;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createInactiveUser,
    getAllInactiveUsers,
    deleteInactiveUser
};