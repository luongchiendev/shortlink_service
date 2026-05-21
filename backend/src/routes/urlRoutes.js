import { Router } from 'express';
import { shortenUrl, redirectUrl, listUrls, deleteUrl, getUrlInfo } from '../controllers/urlController.js';

const router = Router();

router.post('/shorten', shortenUrl);
router.get('/urls', listUrls);
router.get('/urls/info/:code', getUrlInfo);
router.delete('/urls/:id', deleteUrl);
// Route with parameter should be last to avoid catching fixed paths like /urls
router.get('/:code', redirectUrl);

export default router;
