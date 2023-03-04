const client = require("./client");
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function createUser({
  firstName,
  lastName,
  password,
  phone,
  email
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

    return user;
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
      const users = rows.map( row => {
        const user = attachUserData(row);

        return user;
      })

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
        return attachUserData(user);
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

    return attachUserData(user);
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

    return attachUserData(user);
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
    const userStatus = inactiveUser.id ? 'inactive' : 'active';

    userData.shippingAddress = shippingAddress;
    userData.billingAddress = billingAddress;
    userData.cart = cart;
    userData.status = userStatus;

    return userData;
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
  
      return attachUserData(user);
    } catch (error) {
      console.error(error)
  }
}

async function deleteUser(id) {
  try{
    const { rows: [ user ] } =   await client.query(`
        DELETE FROM users
        WHERE id=$1
        RETURNING *;
  `, [id])

    return user;
  } catch (error) {
      console.error(error)
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUser,
  getUserById,
  getUserByEmail,
  attachUserData,
  updateUser,
  deleteUser
}