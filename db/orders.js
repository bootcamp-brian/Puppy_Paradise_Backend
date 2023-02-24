const client = require("./client");


async function addToUserOrders({
    userId,
    puppyId,
    date,
    status,
}) {
    try{
        const { rows: [userOrder] } = await client.query(`
            INSERT INTO userOrders("userId", "puppyId", date, status)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT ("userId", "puppyId") DO NOTHING
            RETURNING *;
        `, [userId, puppyId, date, status])

    return userOrder;
    } catch (error) {
        console.error(error)
    }
}

async function getUserOrderById(id) {
try{
        const { rows: [ order ] } = await client.query(`
            SELECT *
            FROM userOrders
            WHERE id=$1;
        `, [id])

        return order;
    } catch (error) {
        console.error(error)
    }
}

async function getOrderByUser({ id }) {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM userOrders
            WHERE "userId"=$1;
        `, [id])

        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function updateUserOrder({ id, ...fields }) {
try{
        const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');

        if (setString.length === 0) {
            return;
        }

        const { rows: [ userOrder ] } = await client.query(`
            UPDATE userOrders
            SET ${ setString }
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));

        return userOrder;
    } catch (error) {
        console.error(error)
    }
}

async function deleteUserOrder(id) {
    try{
        const { rows: [ userOrder ] } =   await client.query(`
            DELETE FROM userOrders
            WHERE id=$1
            RETURNING *;
    `, [id])

        return userOrder;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    addToUserOrders,
    getUserOrderById,
    getOrderByUser,
    updateUserOrder,
    deleteUserOrder,
  };