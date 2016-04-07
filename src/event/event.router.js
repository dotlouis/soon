import express from 'express';
import getById from './event.getById';
import deleteById from './event.deleteById';
import search from '../search/search.between';
import getAll from './event.getAll';
import create from './event.create';

let eventRouter = express.Router();

eventRouter.route('/:id')
.get(getById)
.delete(deleteById);

eventRouter.route('/search')
.get(search)
// some systems does not accept body parameters for GET
.post(search);

eventRouter.route('/')
.get(getAll)
.post(create);

export default eventRouter;
