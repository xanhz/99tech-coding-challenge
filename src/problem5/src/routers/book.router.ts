import { Router } from 'express';
import * as BookController from '../controllers/book.controller';
import { RequestHandler } from '../core';

const router = Router();
router.post('/books', RequestHandler(BookController.create));
router.get('/books', RequestHandler(BookController.search));
router.get('/books/:id', RequestHandler(BookController.find));
router.put('/books/:id', RequestHandler(BookController.modify));
router.delete('/books/:id', RequestHandler(BookController.remove));

export default router;
