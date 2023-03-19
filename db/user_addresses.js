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

async function updateShippingAddress (userId, shippingAddress) {
    try{
        const setString = Object.keys(shippingAddress).map(
            (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
    
        if (setString.length === 0) {
            return;
        }
        
        const { rows: [ updatedShippingAddress ] } = await client.query(`
            UPDATE shipping_addresses
            SET ${ setString }
            WHERE "userId"=${ userId }
            RETURNING *;
        `, Object.values(shippingAddress));
        return updatedShippingAddress;
      } catch (error) {
        console.error(error)
    }

}

async function updateBillingAddress (userId, billingAddress) {
    try{
        const setString = Object.keys(billingAddress).map(
            (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
    
        if (setString.length === 0) {
            return;
        }
    
        const { rows: [ updatedBillingAddress ] } = await client.query(`
            UPDATE billing_addresses
            SET ${ setString }
            WHERE "userId"=${ userId }
            RETURNING *;
        `, Object.values(billingAddress));
    
        return updatedBillingAddress;
      } catch (error) {
        console.error(error)
    }

}
module.exports = {
    addShippingAddress,
    addBillingAddress,
    updateBillingAddress,
    updateShippingAddress
};