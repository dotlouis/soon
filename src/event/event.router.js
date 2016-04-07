import express from 'express';
import getById from './event.getById';
import deleteById from './event.deleteById';
import getAll from './event.getAll';
import create from './event.create';

let eventRouter = express.Router();

eventRouter.route('/:id')
.get(getById)
.delete(deleteById);

EventRouter.route('/between')
.get(between)
// some systems does not accept body parameters for GET
.post(between);

eventRouter.route('/')
.get(getAll)
.post(create);

export default eventRouter;
