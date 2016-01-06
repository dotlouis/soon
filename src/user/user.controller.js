import express from 'express';
import User from './user.model';

let router = express.Router();

router.route('/')
.get((req, res)=>{
	res.send('yoooow');
});

export default router;
