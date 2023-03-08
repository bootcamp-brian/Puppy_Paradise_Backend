const client = require("./client");


async function addItemToCart({
    userId,
    puppyId,
}) {
    try{
        const { rows: [cart_item] } = await client.query(`
            INSERT INTO cart_items("userId", "puppyId")
            VALUES ($1, $2)
            ON CONFLICT ("userId", "puppyId") DO NOTHING
            RETURNING *;
        `, [userId, puppyId])

    return cart_item;
    } catch (error) {
        console.error(error)
    }
}

async function getCartItemById(id) {
try{
        const { rows: [ cart_item ] } = await client.query(`
            SELECT *
            FROM cart_items
            WHERE id=$1;
        `, [id])

        return cart_item;
    } catch (error) {
        console.error(error)
    }
}

async function getCartByUser(userId) {
    try{
        const { rows } = await client.query(`
            SELECT cart_items.*, puppies.name, puppies.price, puppies.image1, puppies."isAvailable"
            FROM cart_items
            JOIN puppies ON cart_items."puppyId"=puppies.id
            WHERE "userId"=$1;
        `, [userId])

        return rows;
    } catch (error) {
        console.error(error)
    }
}

// async function updateCartItems({ id, ...fields }) {
// try{
//         const setString = Object.keys(fields).map(
//         (key, index) => `"${ key }"=$${ index + 1 }`
//         ).join(', ');

//         if (setString.length === 0) {
//             return;
//         }

//         const { rows: [ cart_item ] } = await client.query(`
//             UPDATE cart_items
//             SET ${ setString }
//             WHERE id=${id}
//             RETURNING *;
//         `, Object.values(fields));

//         return cart_item;
//     } catch (error) {
//         console.error(error)
//     }
// }

async function deleteCartItem(id) {
    try{
        const { rows: [ cart_item ] } =   await client.query(`
            DELETE FROM cart_items
            WHERE id=$1
            RETURNING *;
    `, [id])

        return cart_item;
    } catch (error) {
        console.error(error)
    }
}

async function deleteCartItemsByPuppy(puppyId) {
    try{
        const { rows: [ cart_item ] } =   await client.query(`
            DELETE FROM cart_items
            WHERE "puppyId"=$1
            RETURNING *;
    `, [puppyId])

        return cart_item;
    } catch (error) {
        console.error(error)
    }
}

async function deleteCart(userId) {
    try{
        const { rows } =   await client.query(`
            DELETE FROM cart_items
            WHERE "userId"=$1
            RETURNING *;
    `, [userId])

        return rows;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    addItemToCart,
    getCartItemById,
    getCartByUser,
    // updateCartItems,
    deleteCartItem,
    deleteCart,
    deleteCartItemsByPuppy
  };