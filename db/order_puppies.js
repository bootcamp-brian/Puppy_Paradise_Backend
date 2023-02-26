const client = require("./client");

async function addToOrderPuppies({
    userId,
    puppyId
}) {
    try{
        const { rows: [order_puppy] } = await client.query(`
            INSERT INTO order_puppies("userId", "puppyId")
            VALUES ($1, $2)
            ON CONFLICT ("userId", "puppyId") DO NOTHING
            RETURNING *;
        `, [userId, puppyId])

        return order_puppy;
    } catch (error) {
        console.error(error)
    }
}

async function getOrderPuppyById(id) {
    try{
        const { rows: [ order_puppy ] } = await client.query(`
            SELECT *
            FROM order_puppies
            WHERE id=$1;
        `, [id])

        return order_puppy;
    } catch (error) {
        console.error(error)
    }
}
  
async function getOrderPuppiesByOrder({ id }) {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM order_puppies
            WHERE "orderId"=$1;
        `, [id])

        return rows;
    } catch (error) {
        console.error(error)
    }
}
  
async function updateOrderPuppy({ id, ...fields }) {
    try{
        const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');

        if (setString.length === 0) {
            return;
        }

        const { rows: [ order_puppy ] } = await client.query(`
            UPDATE order_puppies
            SET ${ setString }
            WHERE id=${id}
            RETURNING *;
        `, Object.values(fields));

        return order_puppy;
    } catch (error) {
        console.error(error)
    }
}
  
async function deleteOrderPuppy(id) {
    try{
        const { rows: [ order_puppy ] } =   await client.query(`
            DELETE FROM order_puppies
            WHERE id=$1
            RETURNING *;
    `, [id])

        return order_puppy;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    addToOrderPuppies,
    getOrderPuppyById,
    getOrderPuppiesByOrder,
    updateOrderPuppy,
    deleteOrderPuppy,
  };