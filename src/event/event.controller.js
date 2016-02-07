import express from 'express';
import Event from './event.model';
import {debug} from '../logger/logger';

let router = express.Router();

router.route('/')
.post((req, res)=>{
	debug(req.body);
	res.json(new Event());
});

export default router;
