const { 
    createUser,
    createPuppy,
    addShippingAddress,
    addBillingAddress,
    getAllPuppies,
    createAdmin,
    createOrder,
    addItemToCart,
} = require('./');
const client = require("./client");
const { getAllUsers, getUserByEmail } = require('./users');

async function dropTables() {
    try {
        console.log("Dropping All Tables...")
        await client.query(`
            DROP TABLE IF EXISTS puppy_categories;
            DROP TABLE IF EXISTS categories;
            DROP TABLE IF EXISTS cart_items;
            DROP TABLE IF EXISTS order_puppies;
            DROP TABLE IF EXISTS puppies;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS reset_users;
            DROP TABLE IF EXISTS admins;
            DROP TABLE IF EXISTS inactive_users;
            DROP TABLE IF EXISTS shipping_addresses;
            DROP TABLE IF EXISTS billing_addresses;
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
                phone VARCHAR(255) NOT NULL
            );
        `);
        await client.query(`
            CREATE TABLE billing_addresses (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id) NOT NULL,
                address VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                zip INTEGER,
                UNIQUE ("userId")
            );
        `);
        await client.query(`
            CREATE TABLE shipping_addresses (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id) NOT NULL,
                address VARCHAR(255) NOT NULL,
                city VARCHAR(255) NOT NULL,
                state VARCHAR(255) NOT NULL,
                zip INTEGER,
                UNIQUE ("userId")
            );
        `);
        await client.query(`
            CREATE TABLE inactive_users (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                UNIQUE ("userId")
            );
        `);
        await client.query(`
            CREATE TABLE admins (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                UNIQUE ("userId")
            );
        `);
        await client.query(`
            CREATE TABLE reset_users (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                UNIQUE ("userId")
            );
        `);
        await client.query(`
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                date TIMESTAMP,
                status VARCHAR(255) NOT NULL,
                total NUMERIC(7,2)
            );
        `);
        await client.query(`
            CREATE TABLE puppies (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image1 VARCHAR,
                image2 VARCHAR,
                description TEXT NOT NULL,
                age INTEGER,
                breed VARCHAR(255) NOT NULL,
                weight INTEGER,
                size VARCHAR(255) NOT NULL,
                pedigree BOOLEAN DEFAULT false,
                "isVaccinated" BOOLEAN DEFAULT false,
                "isAltered" BOOLEAN DEFAULT false,
                gender VARCHAR(255) NOT NULL,
                "isAvailable" BOOLEAN DEFAULT true,
                price NUMERIC(7,2)
            );
        `);
        await client.query(`
            CREATE TABLE order_puppies (
                id SERIAL PRIMARY KEY,
                "orderId" INTEGER REFERENCES orders(id),
                "puppyId" INTEGER REFERENCES puppies(id),
                UNIQUE ("orderId", "puppyId")
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
        await client.query(`
            CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL
            );
        `);
        await client.query(`
            CREATE TABLE puppy_categories (
                id SERIAL PRIMARY KEY,
                "categoryId" INTEGER REFERENCES categories(id),
                "puppyId" INTEGER REFERENCES puppies(id),
                UNIQUE ("categoryId", "puppyId")
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
            { 
                "firstName": "demi",
                "lastName": "zayas",
                "email": "dzayas@live.com",
                "password": "dontpissmeoff",
                "phone": "7145555555",
                "shippingAddress": {
                    "address": "1287 Logan Drive",
                    "city": "Chattanooga",
                    "state": "TN",
                    "zip": 61556
                },
                "billingAddress": {
                    "address": "1287 Logan Drive",
                    "city": "Chattanooga",
                    "state": "TN",
                    "zip": 61556
                }
            },{ 
                "firstName": "brian", 
                "lastName": "mui", 
                "email": "bmui@live.com", 
                "password": "dontpissmeoff", 
                "phone": "5625555555",
                "shippingAddress": {
                    "address": "5 Vidon Drive",
                    "city": "Fayetteville",
                    "state": "NC",
                    "zip": 89195
                },
                "billingAddress": {
                    "address": "71537 Mesta Pass",
                    "city": "Canton",
                    "state": "OH",
                    "zip": 10527
                }
            },{ 
                "firstName": "andreea",
                "lastName": "merloiu", 
                "email": "amerloiu@live.com", 
                "password": "dontpissmeoff", 
                "phone": "3235555555",
                "shippingAddress": {
                    "address": "7242 Linden Trail",
                    "city": "Wilmington",
                    "state": "NC",
                    "zip": 28689
                },
                "billingAddress": {
                    "address": "7242 Linden Trail",
                    "city": "Wilmington",
                    "state": "NC",
                    "zip": 28689
                } 
            },{
                "firstName": "Shurwood",
                "lastName": "Livingstone",
                "email": "slivingstone0@mozilla.org",
                "password": "V1Ho5BQEDR",
                "phone": "3837374157",
                "shippingAddress": {
                    "address": "59719 Goodland Terrace",
                    "city": "Honolulu",
                    "state": "HI",
                    "zip": 41800
                },
                "billingAddress": {
                    "address": "59719 Goodland Terrace",
                    "city": "Honolulu",
                    "state": "HI",
                    "zip": 41800
                }
            }, {
                "firstName": "Jerrold",
                "lastName": "Bicksteth",
                "email": "jbicksteth1@auda.org.au",
                "password": "1N4iItFBYat",
                "phone": "8063089890",
                "shippingAddress": {
                    "address": "PO Box 536",
                    "city": "Los Angeles",
                    "state": "CA",
                    "zip": 30468
                },
                "billingAddress": {
                    "address": "536 4th Plaza",
                    "city": "Los Angeles",
                    "state": "CA",
                    "zip": 30468
                }
            }, {
                "firstName": "Jordain",
                "lastName": "Finlow",
                "email": "jfinlow2@ftc.gov",
                "password": "Sh0CHWiTpzrs",
                "phone": "1174083606",
                "shippingAddress": {
                    "address": "897 Florence Terrace",
                    "city": "Colorado Springs",
                    "state": "CO",
                    "zip": 42996
                },
                "billingAddress": {
                    "address": "897 Florence Terrace",
                    "city": "Colorado Springs",
                    "state": "CO",
                    "zip": 42996
                }
            }, {
                "firstName": "Riannon",
                "lastName": "Bernakiewicz",
                "email": "rbernakiewicz3@independent.co.uk",
                "password": "kR2He2i",
                "phone": "3085608979",
                "shippingAddress": {
                    "address": "1882 Maywood Plaza",
                    "city": "Pensacola",
                    "state": "FL",
                    "zip": 24844
                },
                "billingAddress": {
                    "address": "1882 Maywood Plaza",
                    "city": "Pensacola",
                    "state": "FL",
                    "zip": 24844
                }
            }, {
                "firstName": "Issiah",
                "lastName": "Morot",
                "email": "imorot4@gmpg.org",
                "password": "lKgVWCUF1",
                "phone": "1714317227",
                "shippingAddress": {
                    "address": "037 Jenna Center",
                    "city": "Oceanside",
                    "state": "CA",
                    "zip": 84015
                },
                "billingAddress": {
                    "address": "037 Jenna Center",
                    "city": "Oceanside",
                    "state": "CA",
                    "zip": 84015
                }
            }, {
                "firstName": "Thorny",
                "lastName": "Sipson",
                "email": "tsipson5@yellowpages.com",
                "password": "KxEH4fqW",
                "phone": "7725687056",
                "shippingAddress": {
                    "address": "32 Saint Paul Drive",
                    "city": "Pueblo",
                    "state": "CO",
                    "zip": 73665
                },
                "billingAddress": {
                    "address": "6 Jana Alley",
                    "city": "Falls Church",
                    "state": "VA",
                    "zip": 42223
                }
            }, {
                "firstName": "Demetri",
                "lastName": "Ralls",
                "email": "dralls6@statcounter.com",
                "password": "ZaKtKedQ7",
                "phone": "6492803440",
                "shippingAddress": {
                    "address": "1882 Maywood Plaza",
                    "city": "Pensacola",
                    "state": "FL",
                    "zip": 24844
                },
                "billingAddress": {
                    "address": "1882 Maywood Plaza",
                    "city": "Pensacola",
                    "state": "FL",
                    "zip": 24844
                }
            }, {
                "firstName": "Rufe",
                "lastName": "Ensor",
                "email": "rensor7@bizjournals.com",
                "password": "0ORKHCminwKB",
                "phone": "3247769222",
                "shippingAddress": {
                    "address": "2 Oak Parkway",
                    "city": "Pittsburgh",
                    "state": "PA",
                    "zip": 58910
                },
                "billingAddress": {
                    "address": "2 Oak Parkway",
                    "city": "Pittsburgh",
                    "state": "PA",
                    "zip": 58910
                }
            }, {
                "firstName": "Dodie",
                "lastName": "Templeton",
                "email": "dtempleton8@drupal.org",
                "password": "YGbiwSWXWeh",
                "phone": "8033231269",
                "shippingAddress": {
                    "address": "641 Lighthouse Bay Alley",
                    "city": "Springfield",
                    "state": "IL",
                    "zip": 84637
                },
                "billingAddress": {
                    "address": "641 Lighthouse Bay Alley",
                    "city": "Springfield",
                    "state": "IL",
                    "zip": 84637
                }
            }, {
                "firstName": "Rene",
                "lastName": "Robard",
                "email": "rrobard9@addthis.com",
                "password": "4jcvFvcJHR",
                "phone": "6013357719",
                "shippingAddress": {
                    "address": "53 Crescent Oaks Alley",
                    "city": "West Palm Beach",
                    "state": "FL",
                    "zip": 33194
                },
                "billingAddress": {
                    "address": "59 Arrowood Hill",
                    "city": "Norwalk",
                    "state": "CT",
                    "zip": 27428
                }
            }, {
                "firstName": "Korie",
                "lastName": "Peltzer",
                "email": "kpeltzera@prnewswire.com",
                "password": "2a31MNy",
                "phone": "9836842056",
                "shippingAddress": {
                    "address": "1 Dorton Avenue",
                    "city": "Fort Worth",
                    "state": "TX",
                    "zip": 42128
                },
                "billingAddress": {
                    "address": "1 Dorton Avenue",
                    "city": "Fort Worth",
                    "state": "TX",
                    "zip": 42128
                }
            }, {
                "firstName": "Reinaldo",
                "lastName": "Brandt",
                "email": "rbrandtb@merriam-webster.com",
                "password": "Zptw4S4H",
                "phone": "4558425151",
                "shippingAddress": {
                    "address": "PO Box 646",
                    "city": "Bronx",
                    "state": "NY",
                    "zip": 75684
                },
                "billingAddress": {
                    "address": "6 Meadow Vale Plaza",
                    "city": "Bronx",
                    "state": "NY",
                    "zip": 75684
                }
            }
        ]
        const users = await Promise.all(usersToCreate.map(createUser))
    
        console.log("Users created: ", users)
        console.log("Finished creating users!")
    } catch (error) {
        console.error("Error creating users!")
        throw error
    }
}

// async function createInitialBillingAddresses() {
//     console.log("Starting to create billing addresses...")
//     try {
//         const users = await getAllUsers()
//         const billingAddressesToCreate = [
//                 {
//                 "address": "1287 Logan Drive",
//                 "city": "Chattanooga",
//                 "state": "TN",
//                 "zip": 61556
//               }, {
//                 "userId": users[1].id,
//                 "address": "468 Randall Lane",
//                 "city": "Bellevue",
//                 "state": "WA",
//                 "zip": 57479
//               }, {
//                 "userId": users[2].id,
//                 "address": "2828 Calypso Road",
//                 "city": "Schenectady",
//                 "state": "NY",
//                 "zip": 47596
//               }
//         ]
//         const billingAddresses = await Promise.all(billingAddressesToCreate.map(addBillingAddress))
    
//         console.log("Billing addresses created: ", billingAddresses)
//         console.log("Finished creating billing addresses!")
//     } catch (error) {
//         console.error("Error creating billing addresses!")
//         throw error
//     }
// }

// async function createInitialShippingAddresses() {
//     console.log("Starting to create shipping addresses...")
//     try {
//         const [demi, brian, andreea] = await getAllUsers()
//         const shippingAddressesToCreate = [
//             {
//                 "userId": users[0].id,
//                 "address": "PO Box 1287",
//                 "city": "Long Beach",
//                 "state": "CA",
//                 "zip": 90803
//               }, {
//                 "userId": users[1].id,
//                 "address": "5761 Elka Avenue",
//                 "city": "Bellevue",
//                 "state": "WA",
//                 "zip": 57479
//               }, {
//                 "userId": users[2].id,
//                 "address": "2828 Calypso Road",
//                 "city": "Schenectady",
//                 "state": "NY",
//                 "zip": 47596
//               }
//         ]
//         const shippingAddresses = await Promise.all(shippingAddressesToCreate.map(addShippingAddress))
    
//         console.log("Shipping addresses created: ", shippingAddresses)
//         console.log("Finished creating shipping addresses!")
//     } catch (error) {
//         console.error("Error creating shipping addresses!")
//         throw error
//     }
// }

async function createInitialAdmins() {
    console.log("Starting to create admins...")
    try {
        const demi = await getUserByEmail("dzayas@live.com")
        const brian = await getUserByEmail("bmui@live.com")
        const adminsToCreate = [
            {
                "userId": demi.id,
            }, {
                "userId": brian.id,
              }
        ]
        const admins = await Promise.all(adminsToCreate.map(createAdmin))
    
        console.log("admins created: ", admins)
        console.log("Finished creating admins!")
    } catch (error) {
        console.error("Error creating admins!")
        throw error
    }
}

async function createInitialOrders() {
    console.log("Starting to create orders...")
    try {
        const users = await getAllUsers()
        const brian = await getUserByEmail("bmui@live.com")
        const ordersToCreate = [
            {
                "userId": brian.id,
                "date": "2023-01-22 13:34:24",
                "status": "Processing",
                "total": 1111.11
              }, {
                "userId": users[1].id,
                "date": "2022-12-04 11:03:27",
                "status": "Completed"
              }, {
                "userId": users[2].id,
                "date": "2022-07-19 22:17:57",
                "status": "Cancelled"
              }, {
                "userId": users[3].id,
                "date": "2023-03-03 18:17:28",
                "status": "Created"
              }
        ]
        const orders = await Promise.all(ordersToCreate.map(createOrder))
    
        console.log("Orders created: ", orders)
        console.log("Finished creating orders!")
    } catch (error) {
        console.error("Error creating orders!")
        throw error
    }
}

async function createInitialPuppies() {
    console.log("Starting to create puppies...")
    try {    
        const puppiesToCreate = [
            {
                "name": "Jack",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59405844/1/?bust=1673387710&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59405844/2/?bust=1673387711&width=1080",
                "description": "Quintissential social butterfly! Always happy to see you and gets along well with humans and animals alike.",
                "breed": "Labrador",
                "age": 2,
                "weight": 82,
                "size": "L",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 800.99
            },{
                "name": "Bella",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59938051/2/?bust=1677693053&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59938051/1/?bust=1677693052&width=1080",
                "description": "Quintissential anti-social butterfly! Dreams of laying in the sun all day and loves hiding under blankets.",
                "age": 16,
                "breed": "Chihuahua mix",
                "weight": 12,
                "size": "S",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 800.99
            },{
                "name": "Ivy",
                "image1": "https://adopets-prod.s3.amazonaws.com/organization/pet/picture/20221030_222412_1669847052729.JPEG?width=600",
                "image2": null,
                "description": "We'd like to introduce you to sweet Ivy! She's low to mid energy, affectionate, loves to be pet and is treat motivated. She's ready for some relaxation and lots of TLC. If you're looking for the perfect companion for short walks, movie night on the couch & the best Ivy ever without needing a green thumb, we've got the gal for you!",
                "age": 8,
                "breed": "Pit Bull Terrier",
                "weight": 75,
                "size": "L",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 445.99
            }, {
                "name": "Benedict",
                "image1": "http://dummyimage.com/147x100.png/https://adopets-prod.s3.amazonaws.com/organization/pet/picture/2023018_222555_1674080755408.JPEG?width=600/ffffff",
                "image2": null,
                "description": "This adora-bull young lad is 5 year old Benedict Cumbermutt. He's a bull terrier mix, already neutered & 75 pounds. Benedict is deaf & will need an experienced owner or someone willing to research how best to communicate with him & keep him safe. He's active, playful & loves affection. ",
                "age": 5,
                "breed": " Pit Bull Terrier",
                "weight": 75,
                "size": "L",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 295.99
            }, {
                "name": "Fluffy",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59944536/5/?bust=1676348193&width=560",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59944536/4/?bust=1676348192&width=560",
                "description": "Fluffy is a loyal, affectionate lady who is a little over a year old and weighs 12 pounds. She loves being held and cuddled, and she gives the best kisses! She gets along well with other small, calm dogs.",
                "age": 1,
                "breed": "Chihuahua Mix",
                "weight": 12,
                "size": "S",
                "pedigree": false,
                "isVaccinated": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 480.99
            }, {
                "name": "Kylo",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60151109/1/?bust=1677387886&width=560",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60151109/2/?bust=1677387887&width=560",
                "description": "Kylo is active and playful, and he loves to go on walks. He is a cuddler inside the home and hugs everyone he meets. He constantly wags his tail! Kylo is friendly toward other dogs and enjoys running around with them in the yard. He does not have a single mean bone in his body",
                "age": 1,
                "breed": "Labrador",
                "weight": 91,
                "size": "XL",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 375.99
            }, {
                "name": "Nova",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58674444/1/?bust=1666857003&width=560",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58674444/2/?bust=1666857004&width=560",
                "description": "Nova is a 2-year-old, beautiful brindle Shepherd-mix girl with a sweet, loving temperament. She loves every dog she meets and will roll on her side and back for belly rubs. She is playful and smart, and she gives everyone kisses!",
                "age": 2,
                "breed": "Shepherd",
                "weight": 49,
                "size": "M",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 990.99
            }, {
                "name": "Jinny",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/53485343/1/?bust=1636195509&width=560",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/53485343/4/?bust=1636195513&width=560",
                "description": "Jinny is a sweet and sassy senior Chihuahua. She is approximately 10 years old and weighs nine pounds.",
                "age": 10,
                "breed": "Chihuahua Mix",
                "weight": 9,
                "size": "S",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": false,
                "price": 250.99
            }, {
                "name": "Remi",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59524983/4/?bust=1674357559&width=560",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59524983/3/?bust=1674357558&width=560",
                "description": "Remi is a 17 pound, 3 year old, grumpy old man 75% of the time. He has come such a long way from the kill list at the shelter with no hair, to the happy dog friendly boy he is now. He loves dogs, walks, and humans (on his own time).",
                "age": 3,
                "breed": "Chihuahua",
                "weight": 17,
                "size": "S",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 325.99
            }, {
                "name": "Ozzie",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59312072/1/?bust=1672522867&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59312072/2/?bust=1672522868&width=1080",
                "description": "Meet Ozzie. Ozzie is a handsome two-year-old Doberman/Lab mix who is in need of a new home. He has dazzling amber eyes, and a beautiful chestnut coat. He’s a tall and sturdy boy standing at about 28” at the shoulder. He weighs approximately 80 pounds. Ozzie is a big sweet baby with people he knows, and he gets along with other well-matched dogs. Ozzie is a goofy, funny, playful dog, who would do anything for his people. ",
                "age": 2,
                "breed": "Labrador Mix",
                "weight": 80,
                "size": "L",
                "pedigree": true,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 388.99
            }, {
                "name": "Loretta",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58883608/6/?bust=1677293290&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58883608/1/?bust=1668668553&width=1080",
                "description": "Meet Loretta. She is the type of well-balanced dog that spoils pet owners. Loretta is energetic without being rambunctious, an extrovert who also loves her “me time,” and is food motivated in a way that does not lead to her hunting around for other treats.",
                "age": 7,
                "breed": "Pit Bull Terrier",
                "weight": 74,
                "size": "L",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": false,
                "price": 360.99
            }, {
                "name": "Carlisle",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60006416/1/?bust=1677723327&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60006416/2/?bust=1677723327&width=1080",
                "description": "Carlisle is a darling boy. He is gently and sweet with not a mean bone in his body. He is good with people, dogs and cats.",
                "age": 5,
                "breed": "Chihuahua",
                "weight": 15,
                "size": "S",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": 280.99
            }, {
                "name": "Floofy",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60323924/1/?bust=1677782996&width=1080",
                "image2": null,
                "description": "Floofy is happy, sweet, and loyal.  He is fully vetted, superfriendly, and loves other dogs",
                "age": 10,
                "breed": "Border Collie Mix",
                "weight": 45,
                "size": "M",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 415.99
            }, {
                "name": "Rainbow",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/53674463/1/?bust=1637872138&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/53674463/3/?bust=1637872140&width=1080",
                "description": "Meet Rainbow! Rainbow is the sweetest little short stack! He's approximately 15-years old and 30-lbs, and being low to the ground makes it easy for him to flop over for belly rubs. He loves going on walks, car rides, and just spending his day with you. He's the ultimate little buddy!",
                "age": 15,
                "breed": "Border Collie Mix",
                "weight": 30,
                "size": "M",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": 210.99
            }, {
                "name": "Abby",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58579859/2/?bust=1666119640&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58579859/1/?bust=1666119637&width=1080",
                "description": "Meet Abby a young border collie mix about 1 year old. She's a friendly outgoing and active dog, loves her k9 buddies and her new walking friends. She is a busy, active and smart dog.",
                "age": 1,
                "breed": "Border Collie Mix",
                "weight": 55,
                "size": "M",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 475.99
            }, {
                "name": "Raven",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/52121837/1/?bust=1670283487&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/52121837/5/?bust=1670283490&width=1080",
                "description": "She is a friendly girl, good with people and medium to large size dogs. She has no training and probably has not been in a house much, but she's a smart dog and can learn anything she needs to know. She is very attached to her siblings and would enjoy a home with another young dog or two.",
                "age": 1,
                "breed": "Labrador",
                "weight": 50,
                "size": "M",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 460.99
            }, {
                "name": "Mookie Petts",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/56555085/1/?bust=1677360430&width=1080",
                "image2": null,
                "description": "Mookie Petts is the whole package: tall, incredibly handsome, confident, funny, athletic, smart. This 4 year old has stunning blue eyes, an awesome bushy tail, knows some basic obediance, loves to play and would be your perfect walking/ running/ hiking/ adventure buddy.",
                "age": 4,
                "breed": "Husky",
                "weight": 65,
                "size": "L",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": 580.99
            }, {
                "name": "Amaya",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/55191980/3/?bust=1648939358&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/55191980/4/?bust=1648939358&width=1080",
                "description": "Amaya is incredibly shy when she first meets people, but once she knows you, she LOVES to give kisses, sit for treats and catch food flying through the air.",
                "age": 4,
                "breed": "Border Collie Mix",
                "weight": 48,
                "size": "M",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 372.99
            }, {
                "name": "Rayne",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60074426/1/?bust=1677348309&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60074426/3/?bust=1677365654&width=1080",
                "description": "Rayne is an awesome companion and will work best in a home with other dogs.  He is super loyal and very talkative.",
                "age": 2,
                "breed": "Husky",
                "weight": 50,
                "size": "M",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 320.99
            }, {
                "name": "Jasper",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58651111/1/?bust=1677348141&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58651111/3/?bust=1677791424&width=1080",
                "description": "This stunning, blue eyed pup is Jasper. Jasper is very high energy and loves to play with water. This pup would be best suited in an active home where he'd be your one and only companion.",
                "age": 3,
                "breed": "Husky",
                "weight": 72,
                "size": "L",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": 395.99
            }, {
                "name": "Rhonda",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58608575/2/?bust=1677802221&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/58608575/4/?bust=1677802233&width=1080",
                "description": "Meet radiant Rhonda! With her bright blue eyes she's sure to steal your heart. She is described by staff as a cuddle bug and loves to socialize with all her human companions. She is eager to train, and would love to continue with you at home!",
                "age": 1,
                "breed": "Husky",
                "weight": 45,
                "size": "M",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 415.99
            }, {
                "name": "Glenn",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/57474417/1/?bust=1677348427&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/57474417/4/?bust=1677694244&width=1080",
                "description": "This blue-eyed boy is Glenn and he's ready to become a part of your family! Glenn is a 4 year-old Husky who would love nothing more than to play with his toys and be in the company of his human companions. He enjoys taking in all the smells while basking in the sun.",
                "age": 4,
                "breed": "Husky",
                "weight": 68,
                "size": "L",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 430.99
            }, {
                "name": "Kit Kat",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59717197/6/?bust=1674705636&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59717197/4/?bust=1677529569&width=1080",
                "description": "Kit Kat is a GREAT dog! She loves to be around people and is eager to please. She loves to play ball, although she is still trying to understand the fetch game! She is spayed and current on vaccinations",
                "age": 3,
                "breed": "Pit Bull Terrier",
                "weight": 47,
                "size": "M",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 560.99
            }, {
                "name": "Hachi",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59891377/2/?bust=1675918305&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59891377/3/?bust=1675918307&width=1080",
                "description": "Meet Hachi, he's a 4 year old Yellow Lab.He can be excitable, but loves to lay by your feet and relax. He is house trained and good with people and other dogs.",
                "age": 4,
                "breed": "Labrador",
                "weight": 75,
                "size": "L",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": 520.99
            }, {
                "name": "Elvie",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59910010/1/?bust=1677562505&width=1080",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59910010/4/?bust=1676094177&width=1080",
                "description": "Elvie is a female chihuahua mix. She is a tiny little girl at just under 8 lbs. Elvie is very sweet and loves to snuggle. She likes other dogs and playing with toys.",
                "age": 1,
                "breed": "Chihuahua Mix",
                "weight": 8,
                "size": "S",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": false,
                "price": 260.99
            }
        ]
        const puppies = await Promise.all(puppiesToCreate.map(createPuppy))
    
        console.log("puppies created: ", puppies)
        console.log("Finished creating puppies!")
    } catch (error) {
        console.error("Error creating puppies!")
        throw error
    }
}

async function createInitialCarts() {
    console.log("Starting to create carts...")
    try {
        const users = await getAllUsers();
        const puppies = await getAllPuppies();
        const brian = await getUserByEmail("bmui@live.com")
        const cartsToCreate = [
            {
                "userId": brian.id,
                "puppyId": puppies[0].id
              }, {
                "userId": users[1].id,
                "puppyId": puppies[1].id
              }, {
                "userId": users[2].id,
                "puppyId": puppies[2].id
              }, {
                "userId": users[3].id,
                "puppyId": puppies[3].id
              }
        ]
        const carts = await Promise.all(cartsToCreate.map(addItemToCart))
    
        console.log("Carts created: ", carts)
        console.log("Finished creating carts!")
    } catch (error) {
        console.error("Error creating carts!")
        throw error
    }
}

async function rebuildDB() {
    try {
        await dropTables()
        await createTables()
        await createInitialUsers()
        // await createInitialBillingAddresses()
        // await createInitialShippingAddresses()
        await createInitialAdmins()
        await createInitialOrders()
        await createInitialPuppies()
        await createInitialCarts()
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