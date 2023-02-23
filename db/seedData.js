const client = require("./client");
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

async function createUser({
  firstName,
  lastName,
  password,
  phone,
  email,
  isActive,
  isAdmin
}) {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(firstName, lastName, password, phone, email, isActive, isAdmin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
      RETURNING *;
    `, [firstName, lastName, hashedPassword, phone, email, isActive, isAdmin]);

    delete user.password;

    return user;
  } catch (error) {
    console.error(error)
  }
} 

async function getUser({ 
    firstName,
    lastName,
    password,
    phone,
    email,
    isActive,
    isAdmin 
  }) {
    try{
      const user = await getUserByEmail(email);
      const hashedPassword = user.password;
      
      let passwordsMatch = await bcrypt.compare(password, hashedPassword) 
        if (passwordsMatch) {
          delete user.password;
          return user;
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
        SELECT id, firstName, lastName, phone, email, isActive, isAdmin 
        FROM users
        WHERE id=${ userId };
      `);
  
      if (!user) {
        return null;
      } 
  
      return user;
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
  
      return user;
    } catch (error) {
      console.error(error)
    }
  }
  
  module.exports = {
    createUser,
    getUser,
    getUserById,
    getUserByEmail,
  }