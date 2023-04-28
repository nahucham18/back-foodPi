const { Router } = require("express");

const {
    getRecipesHandler,
    getRecipesByIdHandler,
    postRecipesHandler,
    deleteRecipeHandler,
} = require('../handlers/recipesHandlers')

const recipesRouter = Router()


recipesRouter.get('/', getRecipesHandler);

recipesRouter.get('/:id', getRecipesByIdHandler);

recipesRouter.post('/', postRecipesHandler);

recipesRouter.delete('/:id', deleteRecipeHandler);

module.exports = recipesRouter;