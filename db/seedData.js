//create an admin account
const { 
    createUser,
    createPuppy,
    getAllPuppies,
    addShippingAddress,
    addBillingAddress,
    addToOrderItems,
    addToCartItems
    //may need more or less as I go through the seed data
  } = require('./');

const client = require("./client")

async function dropTables() {
    try {
        console.log("Dropping All Tables...")
        await client.query(`
            DROP TABLE IF EXISTS cart_items;
            DROP TABLE IF EXISTS order_items;
            DROP TABLE IF EXISTS shipping_addresses;
            DROP TABLE IF EXISTS billing_addresses;
            DROP TABLE IF EXISTS puppies;
            DROP TABLE IF EXISTS users;

        `);
        console.log("Finished dropping tables...")
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                "firstName" VARCHAR(255) NOT NULL,
                "lastName" VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone INTEGER,
                "isActive" BOOLEAN DEFAULT true,
                "isAdmin" BOOLEAN DEFAULT false
            );
        `);
        await client.query(`
            CREATE TABLE puppies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                age INTEGER,
                breed VARCHAR(255) NOT NULL,
                weight INTEGER,
                size VARCHAR(255) NOT NULL,
                pedigree BOOLEAN DEFAULT false,
                "isVaccinated" BOOLEAN DEFAULT false,
                "isNeutered" BOOLEAN DEFAULT false,
                gender VARCHAR(255) NOT NULL,
                "isAvailable" BOOLEAN DEFAULT true,
                price INTEGER
            );
        `);
        await client.query(`
            CREATE TABLE billing_addresses (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id) NOT NULL,
                street VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                zip INTEGER
            );
        `);
        await client.query(`
            CREATE TABLE shipping_addresses (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id) NOT NULL,
                street VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                zip INTEGER
            );
        `);
        await client.query(`
            CREATE TABLE order_items (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "puppyId" INTEGER REFERENCES puppies(id),
                date TIMESTAMP,
                status VARCHAR(255) NOT NULL,
                UNIQUE ("userId", "puppyId")
            );
        `);
        await client.query(`
            CREATE TABLE cart_items (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "puppyId" INTEGER REFERENCES puppies(id),
                UNIQUE ("userId", "puppyId")
            );
        `);
        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    } 
}

async function createInitialUsers() {
    console.log("Starting to create users...")
    try {
        const usersToCreate = [
            { firstName: "demi", lastName: "zayas", email: "dzayas@live.com", password: "dontpissmeoff", phone: 7145555555, isActive: true, isAdmin: false },
            { firstName: "brian", lastName: "mui", email: "bmui@live.com", password: "dontpissmeoff", phone: 5625555555, isActive: true, isAdmin: false },
            { firstName: "andreea", lastName: "merilou", email: "amerilou@live.com", password: "dontpissmeoff", phone: 3235555555, isActive: true, isAdmin: false },
        ]
        const users = await Promise.all(usersToCreate.map(createUser))
    
        console.log("Users created: ", users)
        console.log("Finished creating users!")
    } catch (error) {
        console.error("Error creating users!")
        throw error
    }
}

async function createInitialPuppies() {
    console.log("Starting to create puppies...")
    try {    
        const puppiesToCreate = [
            {
            name: "Jack",
            description: "Quintissential social butterfly! Always happy to see you and gets along well with humans and animals alike.",
            breed: "Labrador",
            age: 2,
            weight: 82,
            size: "Large",
            pedigree: true,
            isVaccinated: true,
            gender: "Male",
            isAvailable: true,
            price: 2000
            },
            {
            name: "Bella",
            description: "Quintissential anti-social butterfly! Dreams of laying in the sun all day and loves hiding under blankets.",
            age: 16,
            breed: "Jack Russell-Chihuahua mix",
            weight: 12,
            size: "Small",
            pedigree: false,
            isVaccinated: true,
            gender: "Female",
            isAvailable: true,
            price: 2000
            },
        ]
        const puppies = await Promise.all(puppiesToCreate.map(createPuppy))
    
        console.log("puppies created: ", puppies)
        console.log("Finished creating activities!")
    } catch (error) {
        console.error("Error creating activities!")
        throw error
    }
}

async function rebuildDB() {
    try {
        await dropTables()
        await createTables()
        await createInitialUsers()
        await createInitialPuppies()
    } catch (error) {
        console.log("Error during rebuildDB")
        throw error
    }
}

module.exports = {
    rebuildDB,
    dropTables,
    createTables,
}