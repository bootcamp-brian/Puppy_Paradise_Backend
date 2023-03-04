const client = require("./client");

async function addShippingAddress({
    userId,
    address,
    city,
    state,
    zip
}) {
    try{
        const { rows: [shipping_address] } = await client.query(`
            INSERT INTO shipping_addresses("userId", address, city, state, zip)
            VALUES ($1, $2, $3, $4, $5)   
            ON CONFLICT ("userId") DO NOTHING     
            RETURNING *;
        `, [userId, address, city, state, zip])

        return shipping_address;
    } catch (error) {
        console.error(error)
    }
}

async function addBillingAddress({
    userId,
    address,
    city,
    state,
    zip
}) {
    try{
        const { rows: [billing_address] } = await client.query(`
            INSERT INTO billing_addresses("userId", address, city, state, zip)
            VALUES ($1, $2, $3, $4, $5)  
            ON CONFLICT ("userId") DO NOTHING      
            RETURNING *;
        `, [userId, address, city, state, zip])

        return billing_address;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    addShippingAddress,
    addBillingAddress
};