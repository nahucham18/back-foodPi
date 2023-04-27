const { Router } = require("express");

const {getDiets} = require('../handlers/dietsHandlers')

const dietsRouter = Router();


dietsRouter.get('/',getDiets);

module.exports = dietsRouter;