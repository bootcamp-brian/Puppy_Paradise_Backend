const client = require("./client")

async function createOrder({
    userId,
    date,
    status,
}) {
    try{
        const { rows: [order] } = await client.query(`
            INSERT INTO orders("userId", date, status)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [userId, date, status])

    return order;
    } catch (error) {
        console.error(error)
    }
}

async function getAllOrders() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM orders
        `);

        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function getOrderById(id) {
try{
        const { rows: [ order ] } = await client.query(`
            SELECT *
            FROM orders
            WHERE id=$1;
        `, [id])

        return order;
    } catch (error) {
        console.error(error)
    }
}

async function getOrdersByUser({ id }) {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM orders
            WHERE "userId"=$1;
        `, [id])

        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function updateStatus({ id, status }) {
try{
        const { rows: [ order ] } = await client.query(`
            UPDATE orders
            SET status=${status}
            WHERE id=${id}
            RETURNING *;
        `, [id, status]);

        return order;
    } catch (error) {
        console.error(error)
    }
}

async function deleteOrder(id) {
    try{
        const { rows: [ order ] } =   await client.query(`
            DELETE FROM orders
            WHERE id=$1
            RETURNING *;
    `, [id])

        return order;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    updateStatus,
    deleteOrder
};