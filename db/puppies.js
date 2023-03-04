const client = require("./client");

async function createPuppy({
    name,
    image1, 
    image2,
    description,
    age,
    breed,
    weight,
    size,
    pedigree,
    isVaccinated,
    isAltered,
    gender,
    isAvailable,
    price
}) {
    try{
        const { rows: [ puppy ] } = await client.query(`
            INSERT INTO puppies(name, image1, image2, description, age, breed, weight, size, pedigree, "isVaccinated", "isAltered", gender, "isAvailable", price)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `, [name, image1, image2, description, age, breed, weight, size, pedigree, isVaccinated, isAltered, gender, isAvailable, price])
    
        return puppy;
    } catch (error) {
        console.error(error)
    }
}

async function getAllPuppies() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM puppies
        `);
    
        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function getAvailablePuppies() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM puppies
            WHERE "isAvailable"=true;
        `, [id])
  
        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function getPuppyById(id) {
    try{
        const { rows: [ puppy ] } = await client.query(`
            SELECT *
            FROM puppies
            WHERE id=$1;
        `, [id])
  
        return puppy;
    } catch (error) {
        console.error(error)
    }
}

async function updatePuppy({ id, ...fields }) {
    try{
        const setString = Object.keys(fields).map(
            (key, index) => `"${ key }"=$${ index + 1 }`
        ).join(', ');
    
        if (setString.length === 0) {
            return;
        }
    
        const { rows: [ puppy ] } = await client.query(`
            UPDATE puppies
            SET ${ setString }
            WHERE id=${ id }
            RETURNING *;
        `, Object.values(fields));
    
        return puppy;
    } catch (error) {
        console.error(error)
    }
}

async function deletePuppy(id) {
    try{
        await client.query(`
            UPDATE puppies
            SET "isAvailable"=${false}
            WHERE "id"=$1;
        `, [id])

    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    createPuppy,
    getAllPuppies,
    getAvailablePuppies,
    getPuppyById,
    updatePuppy,
    deletePuppy
};