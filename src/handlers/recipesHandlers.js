const {createRecipe ,getRecipeById , getAllRecipes, searchRecipeByName} = require('../controllers/recipes.controller')

//Handler por si recibe una query o no .
const getRecipesHandler = async(req,res) =>{
    const { name } = req.query;
    try {
        const results = name ? await searchRecipeByName(name) : await getAllRecipes();

        res.status(200).json(results);
    } catch (error) {
        res.status(403).json({error:error.message})
    }
}


//Handler de la ruta que recibe un params .
const getRecipesByIdHandler = async(req,res)=>{
    const {id} = req.params;
    const source = isNaN(id) ? "bdd" : "api";
    try {
        const recipe = await getRecipeById(id,source)
        res.status(200).json(recipe);
        
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}



//Handler de la ruta Post ,para crear la nueva receta.
const postRecipesHandler= async(req,res)=>{
    const {title,image,summary,healthScore,steps,readyInMinutes,servings,pricePerServing, dietTypes} = req.body;
    try {
        const newRecipe = await createRecipe(title,image,summary,healthScore,steps,readyInMinutes,servings,pricePerServing,dietTypes);
        res.status(200).json(newRecipe)
    } catch (error) {
        res.status(401).json(error.message);
    }
}

module.exports = {
    getRecipesHandler,
    getRecipesByIdHandler,
    postRecipesHandler
}