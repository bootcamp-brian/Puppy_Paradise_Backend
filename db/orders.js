const client = require("./client");


async function addToOrderItems({
    userId,
    puppyId,
    date,
    status,
}) {
    try{
        const { rows: [order_item] } = await client.query(`
            INSERT INTO order_items("userId", "puppyId", date, status)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT ("userId", "puppyId") DO NOTHING
            RETURNING *;
        `, [userId, puppyId, date, status])

    return order_item;
    } catch (error) {
        console.error(error)
    }
}

async function getOrderItemById(id) {
try{
        const { rows: [ order_item ] } = await client.query(`
            SELECT *
            FROM order_items
            WHERE id=$1;
        `, [id])

        return order_item;
    } catch (error) {
        console.error(error)
    }
}

async function getOrderItemByUser({ id }) {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM order_items
            WHERE "userId"=$1;
        `, [id])

        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function updateOrderItem({ id, ...fields }) {
try{
        const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');

        if (setString.length === 0) {
            return;
        }

        const { rows: [ order_item ] } = await client.query(`
            UPDATE order_items
            SET ${ setString }
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));

        return order_item;
    } catch (error) {
        console.error(error)
    }
}

async function deleteOrderItem(id) {
    try{
        const { rows: [ order_item ] } =   await client.query(`
            DELETE FROM order_items
            WHERE id=$1
            RETURNING *;
    `, [id])

        return order_item;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    addToOrderItems,
    getOrderItemById,
    getOrderItemByUser,
    updateOrderItem,
    deleteOrderItem
  };