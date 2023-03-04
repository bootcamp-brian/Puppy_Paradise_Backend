const client = require("./client")

async function createCategory({
    name
}) {
    try{
        const { rows: [category] } = await client.query(`
            INSERT INTO categories(name)
            VALUES ($1)
            RETURNING *;
        `, [name])

    return order;
    } catch (error) {
        console.error(error)
    }
}

async function getAllCategories() {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM categories
        `);
    
        return rows;
    } catch (error) {
        console.error(error)
    }
}

async function getCategoryByName(name) {
    try{
        const { rows: [category] } = await client.query(`
            SELECT *
            FROM categories
            WHERE name=$1;
        `, [name]);

        return category;
    } catch (error) {
        console.error(error)
    }
}

async function getCategoryById(categoryId) {
    try{
        const { rows: [ category ] } = await client.query(`
            SELECT * 
            FROM categories
            WHERE id=${ categoryId };
        `);

        if (!category) {
            return null;
        } 

        return category;
    } catch (error) {
        console.error(error)
    }
}

async function deleteCategory(id) {
    try{
        const { rows: [ category ] } = await client.query(`
            DELETE FROM categories
            WHERE id=$1
            RETURNING *;
        `, [id])

        return category;
    } catch (error) {
        console.error(error)
    }
  }

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryByName,
    getCategoryById,
    deleteCategory
};