const client = require("./client")

async function addPuppyToCategory({
    categoryId,
    puppyId
}) {
    try{
        const { rows: [puppy_category] } = await client.query(`
            INSERT INTO puppy_categories("categoryId", "puppyId")
            VALUES ($1, $2)
            ON CONFLICT ("categoryId", "puppyId") DO NOTHING
            RETURNING *;
        `, [categoryId, puppyId])

        return puppy_category;
    } catch (error) {
        console.error(error)
    }
}

async function getPuppiesByCategory({ categoryId }) {
    try{
        const { rows } = await client.query(`
            SELECT *
            FROM puppy_categories
            JOIN puppies ON puppy_categories."puppyId" = puppies.id 
            WHERE puppy_categories."categoryId"=$1;
        `, [categoryId])

        return rows;
    } catch (error) {
        console.error(error)
    }
}
  
async function deletePuppyFromCategory(puppyId, categoryId) {
    try{
        const { rows: [ puppy_category ] } =   await client.query(`
            DELETE FROM puppy_categories
            WHERE "categoryId"=${categoryId} AND "puppyId"=${puppyId}
            RETURNING *;
    `)

        return puppy_category;
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    addPuppyToCategory,
    getPuppiesByCategory,
    deletePuppyFromCategory,
};