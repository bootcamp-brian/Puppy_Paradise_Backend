const client = require("./client")
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

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
  
        if (user) {
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
        const { rows: [ user ] } = await client.query(`
        SELECT *
        FROM users
        WHERE id=$1
        `, [userId])

        const hashedPassword = user.password;

        let passwordsMatch = await bcrypt.compare(password, hashedPassword) 
        if (!passwordsMatch) {
            
            const newHashedPassword = await bcrypt.hash(password, SALT_COUNT);
            const { rows: [ reset_user ] } = await client.query(`
                DELETE FROM reset_users
                WHERE "userId"=$1
                RETURNING *;
            `, [userId])
    
            const { rows: [ updatedUser ]} = await client.query(`
                UPDATE users
                SET "password"=$1
                WHERE id=$2
                RETURNING *;
            `, [ newHashedPassword, userId ])
    
            delete updatedUser.password;
    
            return updatedUser;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createResetUser,
    // getAllResetUsers,
    deleteResetUser,
    getResetUserById
};