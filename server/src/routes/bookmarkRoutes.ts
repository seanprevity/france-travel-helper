import express from 'express';
import {
   getBookmarks,
   createBookmark,
   deleteBookmark,
   checkBookmark
} from '../controllers/bookmarkController';

const router = express.Router();

router.get('/:cognitoId', getBookmarks);
router.post('/:cognitoId', createBookmark);
router.delete('/:cognitoId', deleteBookmark);
router.get('/:userId/:insee', checkBookmark);

export default router;