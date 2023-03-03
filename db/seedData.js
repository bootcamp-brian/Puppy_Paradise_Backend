//create an admin account
const { 
    createUser,
    createPuppy,
    getAllPuppies,
    addShippingAddress,
    addBillingAddress,
    createOrder,
    getAllOrders,
    addToOrderPuppies,
    addItemToCart,
    createCategory,
    addPuppyToCategory
    //may need more or less as I go through the seed data
  } = require('./');

const client = require("./client")

async function dropTables() {
    try {
        console.log("Dropping All Tables...")
        await client.query(`
            DROP TABLE IF EXISTS puppy_categories;
            DROP TABLE IF EXISTS categories;
            DROP TABLE IF EXISTS cart_items;
            DROP TABLE IF EXISTS order_puppies;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS puppies;
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
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                date TIMESTAMP,
                status VARCHAR(255) NOT NULL,
            );
        `);
        await client.query(`
            CREATE TABLE inactive_users (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id)
            );
        `);
        await client.query(`
            CREATE TABLE admins (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id)
            );
        `);
        await client.query(`
            CREATE TABLE reset_users (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id)
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
                "isAltered" BOOLEAN DEFAULT false,
                gender VARCHAR(255) NOT NULL,
                "isAvailable" BOOLEAN DEFAULT true,
                price INTEGER
            );
        `);
        await client.query(`
            CREATE TABLE order_puppies (
                id SERIAL PRIMARY KEY,
                "userId" INTEGER REFERENCES users(id),
                "puppyId" INTEGER REFERENCES puppies(id),
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
        await client.query(`
            CREATE TABLE categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
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
                "phone": "7145555555" 
            },{ 
                "firstName": "brian", 
                "lastName": "mui", 
                "email": "bmui@live.com", 
                "password": "dontpissmeoff", 
                "phone": "5625555555" 
            },{ 
                "firstName": "andreea",
                "lastName": "merloiu", 
                "email": "amerloiu@live.com", 
                "password": "dontpissmeoff", 
                "phone": "3235555555" 
            },{
                "firstName": "Shurwood",
                "lastName": "Livingstone",
                "email": "slivingstone0@mozilla.org",
                "password": "V1Ho5BQEDR",
                "phone": "3837374157"
            }, {
                "firstName": "Jerrold",
                "lastName": "Bicksteth",
                "email": "jbicksteth1@auda.org.au",
                "password": "1N4iItFBYat",
                "phone": "8063089890"
            }, {
                "firstName": "Jordain",
                "lastName": "Finlow",
                "email": "jfinlow2@ftc.gov",
                "password": "Sh0CHWiTpzrs",
                "phone": "1174083606"
            }, {
                "firstName": "Riannon",
                "lastName": "Bernakiewicz",
                "email": "rbernakiewicz3@independent.co.uk",
                "password": "kR2He2i",
                "phone": "3085608979"
            }, {
                "firstName": "Issiah",
                "lastName": "Morot",
                "email": "imorot4@gmpg.org",
                "password": "lKgVWCUF1",
                "phone": "1714317227"
            }, {
                "firstName": "Thorny",
                "lastName": "Sipson",
                "email": "tsipson5@yellowpages.com",
                "password": "KxEH4fqW",
                "phone": "7725687056"
            }, {
                "firstName": "Demetri",
                "lastName": "Ralls",
                "email": "dralls6@statcounter.com",
                "password": "ZaKtKedQ7",
                "phone": "6492803440"
            }, {
                "firstName": "Rufe",
                "lastName": "Ensor",
                "email": "rensor7@bizjournals.com",
                "password": "0ORKHCminwKB",
                "phone": "3247769222"
            }, {
                "firstName": "Dodie",
                "lastName": "Templeton",
                "email": "dtempleton8@drupal.org",
                "password": "YGbiwSWXWeh",
                "phone": "8033231269"
            }, {
                "firstName": "Rene",
                "lastName": "Robard",
                "email": "rrobard9@addthis.com",
                "password": "4jcvFvcJHR",
                "phone": "6013357719"
            }, {
                "firstName": "Korie",
                "lastName": "Peltzer",
                "email": "kpeltzera@prnewswire.com",
                "password": "2a31MNy",
                "phone": "9836842056"
            }, {
                "firstName": "Reinaldo",
                "lastName": "Brandt",
                "email": "rbrandtb@merriam-webster.com",
                "password": "Zptw4S4H",
                "phone": "4558425151"
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

async function createInitialPuppies() {
    console.log("Starting to create puppies...")
    try {    
        const puppiesToCreate = [
            {
                "name": "Jack",
                "image1": "http://dummyimage.com/186x100.png/5fa2dd/ffffff",
                "image2": "http://dummyimage.com/129x100.png/ff4444/ffffff",
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
                "price": 2000
            },{
                "name": "Bella",
                "image1": "http://dummyimage.com/186x100.png/5fa2dd/ffffff",
                "image2": "http://dummyimage.com/129x100.png/ff4444/ffffff",
                "description": "Quintissential anti-social butterfly! Dreams of laying in the sun all day and loves hiding under blankets.",
                "age": 16,
                "breed": "Jack Russell-Chihuahua mix",
                "weight": 12,
                "size": "S",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": 2000
            },{
                "name": "Ivy",
                "image1": "https://adopets-prod.s3.amazonaws.com/organization/pet/picture/20221030_222412_1669847052729.JPEG?width=600",
                // "image2": "http://dummyimage.com/129x100.png/ff4444/ffffff",
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
                "price": "$445"
            }, {
                "name": "Benedict",
                "image1": "http://dummyimage.com/147x100.png/https://adopets-prod.s3.amazonaws.com/organization/pet/picture/2023018_222555_1674080755408.JPEG?width=600/ffffff",
                // "image2": "http://dummyimage.com/106x100.png/cc0000/ffffff",
                "description": "This adora-bull young lad is 5 year old Benedict Cumbermutt. He's a bull terrier mix, already neutered & 75 pounds. Benedict is deaf & will need an experienced owner or someone willing to research how best to communicate with him & keep him safe. He's active, playful & loves affection. ",
                "age": 5,
                "breed": "Bull Terrier",
                "weight": 75,
                "size": "L",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": "$295"
            }, {
                "name": "Fluffy",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59944536/5/?bust=1676348193&width=560",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/59944536/4/?bust=1676348192&width=560",
                "description": "Fluffy is a loyal, affectionate lady who is a little over a year old and weighs 12.79 pounds. She loves being held and cuddled, and she gives the best kisses! She gets along well with other small, calm dogs.",
                "age": 1,
                "breed": "Chihuahua Mix",
                "weight": 13,
                "size": "S",
                "pedigree": false,
                "isVaccinated": true,
                "gender": "Female",
                "isAvailable": true,
                "price": "$480"
            }, {
                "name": "Kylo",
                "image1": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60151109/1/?bust=1677387886&width=560",
                "image2": "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/60151109/2/?bust=1677387887&width=560",
                "description": "Kylo is active and playful, and he loves to go on walks. He is a cuddler inside the home and hugs everyone he meets. He constantly wags his tail! Kylo is friendly toward other dogs and enjoys running around with them in the yard. He does not have a single mean bone in his body",
                "age": 1,
                "breed": "Labrador",
                "weight": 91,
                "size": "L",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": "$375"
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
                "price": "$990"
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
                "price": "$250"
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
                "price": "$325"
            }, {
                "name": "King",
                "image1": "http://dummyimage.com/108x100.png/cc0000/ffffff",
                "image2": "http://dummyimage.com/219x100.png/dddddd/000000",
                "description": "Sed ante.",
                "age": 9,
                "breed": "proin interdum",
                "weight": 106,
                "size": "XL",
                "pedigree": true,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": "$187.15"
            }, {
                "name": "Charline",
                "image1": "http://dummyimage.com/195x100.png/5fa2dd/ffffff",
                "image2": "http://dummyimage.com/178x100.png/ff4444/ffffff",
                "description": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.",
                "age": 12,
                "breed": "rutrum",
                "weight": 110,
                "size": "XL",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": false,
                "price": "$359.14"
            }, {
                "name": "Ilyssa",
                "image1": "http://dummyimage.com/235x100.png/cc0000/ffffff",
                "image2": "http://dummyimage.com/147x100.png/cc0000/ffffff",
                "description": "Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue.",
                "age": 15,
                "breed": "ridiculus mus",
                "weight": 90,
                "size": "M",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": false,
                "price": "$638.64"
            }, {
                "name": "Ardra",
                "image1": "http://dummyimage.com/221x100.png/ff4444/ffffff",
                "image2": "http://dummyimage.com/122x100.png/dddddd/000000",
                "description": "Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem.",
                "age": 4,
                "breed": "diam id",
                "weight": 105,
                "size": "L",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": "$468.09"
            }, {
                "name": "Cosme",
                "image1": "http://dummyimage.com/138x100.png/5fa2dd/ffffff",
                "image2": "http://dummyimage.com/116x100.png/cc0000/ffffff",
                "description": "Pellentesque at nulla. Suspendisse potenti.",
                "age": 13,
                "breed": "ante vestibulum",
                "weight": 107,
                "size": "XS",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": "$781.16"
            }, {
                "name": "Winfield",
                "image1": "http://dummyimage.com/196x100.png/5fa2dd/ffffff",
                "image2": "http://dummyimage.com/240x100.png/ff4444/ffffff",
                "description": "Sed ante. Vivamus tortor.",
                "age": 11,
                "breed": "suscipit ligula",
                "weight": 80,
                "size": "XL",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": "$478.87"
            }, {
                "name": "Rab",
                "image1": "http://dummyimage.com/238x100.png/cc0000/ffffff",
                "image2": "http://dummyimage.com/248x100.png/cc0000/ffffff",
                "description": "Sed vel enim sit amet nunc viverra dapibus.",
                "age": 15,
                "breed": "felis",
                "weight": 40,
                "size": "2XL",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": "$910.59"
            }, {
                "name": "Flory",
                "image1": "http://dummyimage.com/166x100.png/dddddd/000000",
                "image2": "http://dummyimage.com/189x100.png/cc0000/ffffff",
                "description": "Vivamus tortor. Duis mattis egestas metus.",
                "age": 2,
                "breed": "feugiat et",
                "weight": 59,
                "size": "2XL",
                "pedigree": true,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": "$958.40"
            }, {
                "name": "Luelle",
                "image1": "http://dummyimage.com/234x100.png/dddddd/000000",
                "image2": "http://dummyimage.com/174x100.png/cc0000/ffffff",
                "description": "Mauris lacinia sapien quis libero.",
                "age": 16,
                "breed": "lacinia erat",
                "weight": 17,
                "size": "3XL",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": "$894.45"
            }, {
                "name": "Jamill",
                "image1": "http://dummyimage.com/226x100.png/cc0000/ffffff",
                "image2": "http://dummyimage.com/166x100.png/5fa2dd/ffffff",
                "description": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.",
                "age": 12,
                "breed": "fusce",
                "weight": 107,
                "size": "XS",
                "pedigree": false,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": "$326.78"
            }, {
                "name": "Walther",
                "image1": "http://dummyimage.com/218x100.png/cc0000/ffffff",
                "image2": "http://dummyimage.com/239x100.png/dddddd/000000",
                "description": "Nunc nisl.",
                "age": 14,
                "breed": "et ultrices",
                "weight": 11,
                "size": "S",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": "$297.60"
            }, {
                "name": "Wilmar",
                "image1": "http://dummyimage.com/132x100.png/ff4444/ffffff",
                "image2": "http://dummyimage.com/110x100.png/cc0000/ffffff",
                "description": "Ut tellus. Nulla ut erat id mauris vulputate elementum.",
                "age": 1,
                "breed": "neque aenean",
                "weight": 2,
                "size": "XL",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": "$854.96"
            }, {
                "name": "Raychel",
                "image1": "http://dummyimage.com/222x100.png/dddddd/000000",
                "image2": "http://dummyimage.com/173x100.png/5fa2dd/ffffff",
                "description": "Vestibulum rutrum rutrum neque.",
                "age": 12,
                "breed": "ultrices",
                "weight": 108,
                "size": "3XL",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": false,
                "price": "$797.94"
            }, {
                "name": "Jammie",
                "image1": "http://dummyimage.com/185x100.png/ff4444/ffffff",
                "image2": "http://dummyimage.com/194x100.png/ff4444/ffffff",
                "description": "Morbi non lectus.",
                "age": 3,
                "breed": "duis consequat",
                "weight": 37,
                "size": "2XL",
                "pedigree": true,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": false,
                "price": "$569.70"
            }, {
                "name": "Christiano",
                "image1": "http://dummyimage.com/205x100.png/dddddd/000000",
                "image2": "http://dummyimage.com/145x100.png/ff4444/ffffff",
                "description": "Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum.",
                "age": 3,
                "breed": "amet nunc",
                "weight": 92,
                "size": "2XL",
                "pedigree": true,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": true,
                "price": "$887.87"
            }, {
                "name": "Vlad",
                "image1": "http://dummyimage.com/144x100.png/ff4444/ffffff",
                "image2": "http://dummyimage.com/210x100.png/dddddd/000000",
                "description": "Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.",
                "age": 7,
                "breed": "justo morbi",
                "weight": 92,
                "size": "2XL",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": "$150.94"
            }, {
                "name": "Celeste",
                "image1": "http://dummyimage.com/114x100.png/ff4444/ffffff",
                "image2": "http://dummyimage.com/248x100.png/dddddd/000000",
                "description": "Integer ac leo.",
                "age": 14,
                "breed": "ut nulla",
                "weight": 39,
                "size": "3XL",
                "pedigree": true,
                "isVaccinated": true,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": true,
                "price": "$781.99"
            }, {
                "name": "Lisha",
                "image1": "http://dummyimage.com/247x100.png/dddddd/000000",
                "image2": "http://dummyimage.com/150x100.png/5fa2dd/ffffff",
                "description": "Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.",
                "age": 14,
                "breed": "mauris non",
                "weight": 59,
                "size": "S",
                "pedigree": true,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Female",
                "isAvailable": false,
                "price": "$928.71"
            }, {
                "name": "Kennie",
                "image1": "http://dummyimage.com/234x100.png/dddddd/000000",
                "image2": "http://dummyimage.com/191x100.png/ff4444/ffffff",
                "description": "Integer a nibh.",
                "age": 11,
                "breed": "aenean",
                "weight": 92,
                "size": "3XL",
                "pedigree": false,
                "isVaccinated": false,
                "isAltered": true,
                "gender": "Male",
                "isAvailable": false,
                "price": "$200.37"
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