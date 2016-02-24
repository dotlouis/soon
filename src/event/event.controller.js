import express from 'express';
import Event from './event.model';
import {wrap, delay} from '../utils/utils';

let router = express.Router();

router.route('/')
.post(wrap(async(req, res)=>{
	let e = new Event(req.body);
	await e.save();
	// await delay(1000, 'booo', true);
	res.send(e);
}));

export default router;
