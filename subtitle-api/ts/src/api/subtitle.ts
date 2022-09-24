import { Router } from "express";
import { getYouTubeSubtitle } from "@jellybeanci/subtitle-fetch";
import { BAD_REQUEST, OK } from "http-status";
export const router = Router();

export interface QueryString {
    url?: string;
    lang?: string;
}

router.get("/", async (req, res) => {
    const { url, lang }: QueryString = req.query;
    const startTime = Date.now();
    if (!!url) {
        try {
            const subtitle = await getYouTubeSubtitle(
                `https://www.youtube.com/watch?v=${url}`,
                lang ?? "en"
            );
            res.status(OK).json({
                subtitle,
                lang: lang ?? "en",
                processTime:  Date.now() - startTime,
            });
            return;
        } catch (err) {}
    }
    res.status(BAD_REQUEST).json({
        sillyHands: ["👋","🖐️","🖖","👌","🤞","🤟","👊","👎","👍","☝️","🤙","🤘"],
        url,
        lang,
    });
});