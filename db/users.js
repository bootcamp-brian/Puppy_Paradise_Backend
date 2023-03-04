const client = require("./client");
const bcrypt = require('bcrypt');
const { addShippingAddress, addBillingAddress } = require("./user_addresses");
const SALT_COUNT = 10;

async function createUser({
  firstName,
  lastName,
  password,
  phone,
  email,
  shippingAddress,
  billingAddress
}) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const { rows: [ user ] } = await client.query(`
      INSERT INTO users("firstName", "lastName", email, password, phone)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `, [firstName, lastName, email, hashedPassword, phone]);

    delete user.password;

    console.log(user)
    addShippingAddress({ userId: user.id, ...shippingAddress});
    addBillingAddress({ userId: user.id, ...billingAddress});
    const userWithData = await attachUserData(user);
    return userWithData;
  } catch (error) {
    console.error(error)
  }
}

async function getAllUsers() {
  try{
      const { rows } = await client.query(`
          SELECT *
          FROM users
      `);
      const users = await attachUsersData(rows);

      return users;
  } catch (error) {
      console.error(error)
  }
}

async function getUser({ 
  email,
  password
}) {
  try{
    const user = await getUserByEmail(email);
    const hashedPassword = user.password;
    
    let passwordsMatch = await bcrypt.compare(password, hashedPassword) 
      if (passwordsMatch) {
        delete user.password;
        const userWithData = await attachUserData(user);
        return userWithData;
      } else {
        return false;
    }
  } catch (error) {
    console.error(error)
  }
}

async function getUserById(userId) {
  try{
    const { rows: [ user ] } = await client.query(`
      SELECT id, "firstName", "lastName", phone, email 
      FROM users
      WHERE id=${ userId };
    `);

    if (!user) {
      return null;
    } 

    const userWithData = await attachUserData(user);
    return userWithData;
  } catch (error) {
    console.error(error)
  }
}

async function getUserByEmail(email) {
  try{
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE email=$1;
    `, [email]);

    const userWithData = await attachUserData(user);
    return userWithData;
  } catch (error) {
    console.error(error)
  }
}

async function attachUserData(user) {
  try{
    const userData = { ...user };
    const { rows: [ shippingAddress ] } = await client.query(`
        SELECT *
        FROM shipping_addresses
        WHERE "userId"=${userData.id};
    `);
    const { rows: [ billingAddress ] } = await client.query(`
        SELECT *
        FROM billing_addresses
        WHERE "userId"=${userData.id};
    `);
    const { rows: cartItems } = await client.query(`
        SELECT *
        FROM cart_items
        WHERE "userId"=${userData.id};
    `);
    let total = 0;
    for (let item of cartItems) {
        total += item.price;
    }
    const cart = {
        cartItems,
        total
    }
    const { rows: [ inactiveUser ] } = await client.query(`
        SELECT *
        FROM inactive_users
        WHERE "userId"=${userData.id};
    `);
    const userStatus = inactiveUser ? 'inactive' : 'active';

    userData.shippingAddress = shippingAddress;
    userData.billingAddress = billingAddress;
    userData.cart = cart;
    userData.status = userStatus;

    return userData;
  } catch (error) {
    console.error(error);
  }
}

async function attachUsersData(users) {
  try{
    const { rows: shippingAddresses } = await client.query(`
        SELECT *
        FROM shipping_addresses
    `);
    const { rows: billingAddresses } = await client.query(`
        SELECT *
        FROM billing_addresses
    `);
    const { rows: allCartItems } = await client.query(`
        SELECT *
        FROM cart_items
    `);
    const { rows: inactiveUsers } = await client.query(`
        SELECT *
        FROM inactive_users
    `);

    const usersData = users.map(user => {
      const userData = { ...user };
      const shippingAddress = shippingAddresses.filter(address => address.userId === user.id);
      const billingAddress = billingAddresses.filter(address => address.userId === user.id);
      const cartItems = allCartItems.filter(address => address.userId === user.id);
      let total = 0;
      for (let item of cartItems) {
          total += item.price;
      }
      const cart = {
          cartItems,
          total
      }
      const inactiveUser = inactiveUsers.filter(inactiveUser => inactiveUser.userId === user.id)
      const userStatus = inactiveUser[0] ? 'inactive' : 'active';

      userData.shippingAddress = shippingAddress[0];
      userData.billingAddress = billingAddress[0];
      userData.cart = cart;
      userData.status = userStatus;
      return userData;
    })

    return usersData;
  } catch (error) {
    console.error(error);
  }
}

async function updateUser({ id, ...fields }) {
  try{
      const setString = Object.keys(fields).map(
          (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
  
      if (setString.length === 0) {
          return;
      }
  
      const { rows: [ user ] } = await client.query(`
          UPDATE users
          SET ${ setString }
          WHERE id=${ id }
          RETURNING *;
      `, Object.values(fields));
  
      const userWithData = await attachUserData(user);
      return userWithData;
    } catch (error) {
      console.error(error)
  }
}

// async function deleteUser(id) {
//   try{
//     const { rows: [ user ] } =   await client.query(`
//         DELETE FROM users
//         WHERE id=$1
//         RETURNING *;
//   `, [id])

//     return user;
//   } catch (error) {
//       console.error(error)
//   }
// }

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  getUserById,
  getUserByEmail,
  attachUserData,
  updateUser,
  // deleteUser
}