const client = require("./client");

async function addShippingAddress({
    userId,
    street,
    city,
    state,
    zip
}) {
    try{
        const { rows: [shippingAddress] } = await client.query(`
            INSERT INTO shippingAddresses("userId", street, city, state, zip)
            VALUES ($1, $2, $3, $4, $5)        
            RETURNING *;
        `, [userId, street, city, state, zip])

        return shippingAddress;
    } catch (error) {
        console.error(error)
    }
}

async function addBillingAddress({
    userId,
    street,
    city,
    state,
    zip
}) {
    try{
        const { rows: [billingAddress] } = await client.query(`
            INSERT INTO billingAddresses("userId", street, city, state, zip)
            VALUES ($1, $2, $3, $4, $5)        
            RETURNING *;
        `, [userId, street, city, state, zip])

        return billingAddress;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    addShippingAddress,
    addBillingAddress
};