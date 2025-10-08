import express from 'express';
import {
   getUser,
   updateUser,
   createUser,
} from '../controllers/userController';

const router = express.Router();

router.get('/:cognitoId', getUser);
router.put('/:cognitoId', updateUser);
router.post('/', createUser);

export default router;