import express from "express";
import { SpotCreation, SpotDestroy, SpotListing } from "../../controllers/spot";

const router = express.Router();

router.get("/", SpotListing);

router.post("/", SpotCreation);

router.put("/", SpotCreation);

router.delete("/", SpotDestroy);

export default router;
