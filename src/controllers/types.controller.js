const { Diet } = require('../db')

const typesDiets = async() =>{
    const allDiets = await Diet.findAll()
    return allDiets
}

module.exports = typesDiets;