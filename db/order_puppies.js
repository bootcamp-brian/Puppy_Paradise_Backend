const client = require("./client");

async function addPuppyToOrder({
    orderId,
    puppyId
}) {
    try{
        const { rows: [order_puppy] } = await client.query(`
            INSERT INTO order_puppies("orderId", "puppyId")
            VALUES ($1, $2)
            ON CONFLICT ("orderId", "puppyId") DO NOTHING
            RETURNING *;
        `, [orderId, puppyId])

        return order_puppy;
    } catch (error) {
        console.error(error)
    }
}

// async function getOrderPuppyById(puppyId) {
//     try{
//         const { rows: [ order_puppy ] } = await client.query(`
//             SELECT order_puppies.*, puppies.name, puppies.price
//             FROM order_puppies
//             JOIN puppies ON order_puppies."puppyId" = puppies.id 
//             WHERE order_puppies.puppyId=$1;
//         `, [puppyId])

//         return order_puppy;
//     } catch (error) {
//         console.error(error)
//     }
// }
  
// async function getOrderPuppiesByOrder({ orderId }) {
//     try{
//         const { rows } = await client.query(`
//             SELECT order_puppies.*, puppies.name, puppies.price
//             FROM order_puppies
//             JOIN puppies ON order_puppies."puppyId" = puppies.id 
//             WHERE order_puppies.orderId=$1;
//         `, [orderId])

//         return rows;
//     } catch (error) {
//         console.error(error)
//     }
// }
  
// async function deleteOrderPuppy(id) {
//     try{
//         const { rows: [ order_puppy ] } =   await client.query(`
//             DELETE FROM order_puppies
//             WHERE id=$1
//             RETURNING *;
//     `, [id])

//         return order_puppy;
//     } catch (error) {
//         console.error(error)
//     }
// }

module.exports = {
    addPuppyToOrder,
    // getOrderPuppyById,
    // getOrderPuppiesByOrder,
    // updateOrderPuppy,
    // deleteOrderPuppy,
  };