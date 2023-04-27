const typeDiets = require('../controllers/types.controller')

const getDiets = async(req,res) =>{
    try {
        const diets = await typeDiets() ;
        res.status(200).json(diets);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {getDiets};