const client = require("./client")

async function createResetUser(userId) {
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

// async function getAllResetUsers() {
//     try{
//         const { rows } = await client.query(`
//             SELECT *
//             FROM reset_users
//         `);

//         return rows;
//     } catch (error) {
//         console.error(error)
//     }
// }

async function getResetUserById(userId) {
    try{
        const { rows: [ user ] } = await client.query(`
            SELECT * 
            FROM reset_users
            WHERE "userId"=${ userId };
        `);
  
        if (user.id) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
      console.error(error)
    }
}

async function deleteResetUser(userId, password) {
    try{
        const { rows: [ reset_user ] } =   await client.query(`
            DELETE FROM reset_users
            WHERE id=$1
            RETURNING *;
        `, [userId])

        const { rows: [ user ]} = await client.query(`
            UPDATE users
            SET "password"=${password}
            WHERE id=${userId}
            RETURNING *;
        `)

        delete user.password;

        return user;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createResetUser,
    // getAllResetUsers,
    deleteResetUser
};