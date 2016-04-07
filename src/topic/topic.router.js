import express from 'express';
import getEventsById from './topic.getEventsById';
import deleteEventsById from './topic.deleteEventsById';
import deleteById from './topic.deleteById';
import create from './topic.create';

let topicRouter = express.Router();

topicRouter.route('/:id/events')
.get(getEventsById)
.delete(deleteEventsById);

topicRouter.route('/:id')
.delete(deleteById);

topicRouter.route('/')
.post(create);

export default topicRouter;
