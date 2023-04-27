const axios = require ('axios')
const { Diet } = require ('../db')
const {API_KEY} = process.env;

module.exports = {
    diet: async () =>{
        const data = await Diet.findByPk(1);
        if(!data){
            const dietApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100&addRecipeInformation=true`)
        
        // console.log(dietApi.data.results);
        dietApi.data.results.forEach((recipe)=>{
            if(recipe.vegetarian === true ){
                recipe.diets = [...recipe.diets,"vegetarian"]
            }
        })
        const diet = dietApi.data.results.flatMap((el) => el.diets);
        const arr = new Set(diet);

        arr.forEach((el)=>{
            Diet.findOrCreate({
                where: {name:el},
            });
        })
        console.log('me ha ejecutado' + 1);
        } else{
            // console.log(data);
            console.log('los datos de dietas ya estan cargados')
        }
        
    }

}