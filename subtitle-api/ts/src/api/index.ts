import {Router} from "express";

import {router as emojis} from "./emojis";
import {router as youtubeCloseCaptions} from "./subtitle";

export const router = Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});

router.use('/emojis', emojis);
router.use('/ytcc', youtubeCloseCaptions);