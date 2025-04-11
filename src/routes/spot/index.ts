import express from "express";
import {
  SpotCreation,
  SpotDestroy,
  SpotListing,
  SpotUpdate,
} from "../../controllers/spot";

const router = express.Router();

router.get("/", SpotListing);

router.post("/", SpotCreation);

router.put("/", SpotUpdate);

router.delete("/", SpotDestroy);

export default router;
