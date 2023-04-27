const { Recipe, Diet } = require ('../db');
const axios = require('axios')
const {API_KEY} = process.env

const cleanArrayBdd=(arrayBdd)=>
        arrayBdd.map(recipe=>{
        return {
            id:recipe.id,
            title: recipe.title,
            image: recipe.image,
            summary: recipe.summary,
            healthScore: recipe.healthScore,
            pricePerServing: recipe.pricePerServing,
            servings: recipe.servings,
            readyInMinutes: recipe.readyInMinutes,
            created: recipe.created,
            steps:recipe?.steps?.map((e,index) => {
                return {
                    number: index + 1,
                    step: e,
                    // ingredients: e.ingredients,
                };
                }),
            diets: recipe.Diets.map((diet)=> diet.name)
        }
    })


const cleanArray = (array) =>{
            array.forEach(element => {
                if(element.vegetarian === true){
                    element.diets = [...element.diets,"vegetarian"]
                }
            })
            const newArray = array.map(elem=>{
            return {
                id:elem.id,
                title:elem.title,
                summary:elem.summary,
                healthScore:elem.healthScore,
                diets: elem.diets,
                image:elem.image,
                created:false,
                steps:elem.analyzedInstructions[0]?.steps.map((e) => {
                    return {
                        number: e.number,
                        step: e.step,
                        ingredients: e.ingredients,
                    };
                    }),
            }
        });
        return newArray;
}


const createRecipe = async(title,image,summary,healthScore,steps,readyInMinutes,servings,pricePerServing, dietTypes)=>{
    if(!title || !summary || !healthScore || !steps ||!dietTypes || !image ) throw new Error ('Missing Data')
    const newRecipe = await Recipe.create({title,image,summary,healthScore,steps,readyInMinutes,servings,pricePerServing})
    let getDiet = await Diet.findAll({
        where:{
            name: dietTypes,
        },
        attibutes:['name'],
    });

    return newRecipe.addDiet(getDiet);
    

}

const getRecipeById = async(id, source) =>{
    const recipe = 
    source === "api" 
        ? (await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&addRecipeInformation=true`))
            .data
        : await Recipe.findByPk(id,{include:{
            model: Diet,
            attibutes:["name"],
            through:{
                attibutes:[],
        },},
        })
    if(!recipe)throw new Error('No se econtro el id')
        if(!recipe.created ){       
            const cleanRecipe = {
            title: recipe.title,
            image: recipe.image,
            diets:recipe.diets,
            summary: recipe.summary,
            steps: recipe.steps,
            healthScore: recipe.healthScore,
            pricePerServing: recipe.pricePerServing,
            servings: recipe.servings,
            readyInMinutes: recipe.readyInMinutes,
            create: recipe.create,
            steps:recipe.analyzedInstructions[0]?.steps.map((e) => {
                return {
                    number: e.number,
                    step: e.step,
                    ingredients: e.ingredients,
                };
                })
            
            
        }
        return cleanRecipe
        }
        else{
            const cleanRecipe = {
                title: recipe.title,
                image: recipe.image,
                summary: recipe.summary,
                diets:recipe?.Diets?.map(diet=> diet.name),
                healthScore: recipe.healthScore,
                pricePerServing: recipe.pricePerServing,
                servings: recipe.servings,
                readyInMinutes: recipe.readyInMinutes,
                created: recipe.created,
                steps:recipe?.steps?.map((e,index) => {
                    return {
                        number: index + 1,
                        step: e,
                        // ingredients: e.ingredients,
                    };
                    })
                
                
            }
            return cleanRecipe
        }

}
const getAllRecipes = async() =>{
    const databaseRecipes = await Recipe.findAll({
        include: {
            model: Diet,
            attibutes: ['name'],
            through:{
                attibutes:[],
            }
        }
    })
    // const apiRecipesRaw = (
    //     await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true`)
    //     ).data
    const apiRecipesRaw = (
        await axios.get(`https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5`)
        ).data

    const apiRecipes = cleanArray(apiRecipesRaw.results);
    const newDatabaseRecipes = cleanArrayBdd(databaseRecipes)
    return [...newDatabaseRecipes, ...apiRecipes]
}

const searchRecipeByName = async(name) =>{
    const allRecipes = await getAllRecipes()

    const recipeByName = allRecipes.filter((recipe) => recipe.title.toLowerCase().includes(name.toLowerCase()));    
    if(recipeByName.length >0)return recipeByName;
    throw new Error('Recipe not found')
}



module.exports = {createRecipe, getRecipeById, getAllRecipes, searchRecipeByName};