import express from 'express';
import getById from './event.getById';
import deleteById from './event.deleteById';
import create from './event.create';
import getAll from './event.getAll';
import between from './event.between';
import getRelated from './event.getRelated';

let EventRouter = express.Router();

EventRouter.route('/:id/related')
.get(getRelated);

EventRouter.route('/:id')
.get(getById)
.delete(deleteById);

EventRouter.route('/between')
.get(between)
// some systems does not accept body parameters for GET
.post(between);

EventRouter.route('/')
.get(getAll)
.post(create);

/* TODO
¨* - HEAD (check if a record exists)
 * - PUT/PATCH (update a record)
 */

export default EventRouter;
