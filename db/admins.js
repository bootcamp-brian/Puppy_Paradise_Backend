const client = require("./client")

async function createAdmin({
    userId
}) {
    try{
        const { rows: [admin] } = await client.query(`
            INSERT INTO admins("userId")
            VALUES ($1)
            RETURNING *;
        `, [userId])

        return admin;
    } catch (error) {
        console.error(error)
    }
}

async function getAdminById(userId) {
    try{
        const { rows: [admin] } = await client.query(`
            SELECT *
            FROM admins
            WHERE "userId"=${userId}
        `)

        return admin;
    } catch (error) {
        console.error(error)
    }
}
// async function getAllAdmins() {
//     try{
//         const { rows } = await client.query(`
//             SELECT *
//             FROM admins
//         `);

//         return rows;
//     } catch (error) {
//         console.error(error)
//     }
// }

// async function deleteAdmin(id) {
//     try{
//         const { rows: [ admin ] } =   await client.query(`
//             DELETE FROM admins
//             WHERE id=$1
//             RETURNING *;
//     `, [id])

//         return admin;
//     } catch (error) {
//         console.error(error)
//     }
// }

module.exports = {
    createAdmin,
    getAdminById
    // getAllAdmins,
    // deleteAdmin
};