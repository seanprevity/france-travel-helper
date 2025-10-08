import express from 'express';
import {
   getCities,
   getCity,
   getNearestCity,
   getSearchedCities,
   getRandomCity,
} from '../controllers/cityController';

const router = express.Router();

// fetches random city
router.get('/random', getRandomCity);
// this will handle filters that go to /cities?... 
router.get('/', getCities);
router.get('/search/:input', getSearchedCities);
// this will be when you click on a city marker? Not too sure why I made this one ngl - city marker should carry all info so unneccessary?
router.get('/:codeInsee', getCity);
// map clicks will go to this route
router.get('/:lat/:lng', getNearestCity);


export default router;