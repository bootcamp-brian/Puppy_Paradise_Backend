const client = require("./client")

async function createOrder({
    userId,
    date,
    status,
    total
}) {
    try{
        const { rows: [order] } = await client.query(`
            INSERT INTO orders("userId", date, status, total)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `, [userId, date, status, total])

    return order;
    } catch (error) {
        console.error(error)
    }
}

async function attachItemsToOrder(order) {
    try{
        const { rows } = await client.query(`
            SELECT order_puppies.*, puppies.name, puppies.price
            FROM order_puppies
            JOIN puppies ON order_puppies."puppyId" = puppies.id 
            WHERE order_puppies."orderId"=${order.id};
        `);

        order.items = rows;
        return order;
    } catch (error) {
        console.error(error)
    }    
}

async function getAllOrders() {
    try{
        const { rows: orders } = await client.query(`
            SELECT *
            FROM orders
        `);

        const ordersWithItems = orders.map(order => {
            return attachItemsToOrder(order);
        })
        return ordersWithItems;
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

        const orderWithItems = await attachItemsToOrder(order);
        return orderWithItems;
    } catch (error) {
        console.error(error)
    }
}

async function getOrdersByUser({ id }) {
    try{
        const { rows: orders } = await client.query(`
            SELECT *
            FROM orders
            WHERE "userId"=$1;
        `, [id])

        const ordersWithItems = orders.map(order => {
            return attachItemsToOrder(order);
        })
        return ordersWithItems;
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

// async function deleteOrder(id) {
//     try{
//         const { rows: [ order ] } =   await client.query(`
//             DELETE FROM orders
//             WHERE id=$1
//             RETURNING *;
//     `, [id])

//         return order;
//     } catch (error) {
//         console.error(error)
//     }
// }

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    updateStatus,
    // deleteOrder
};