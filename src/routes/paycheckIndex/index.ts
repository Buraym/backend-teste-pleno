import express from "express";
import { SpotCreation, SpotDestroy, SpotListing } from "../../controllers/spot";
import {
  PaycheckIndexCreation,
  PaycheckIndexDestroy,
  PaycheckIndexListing,
  PaycheckIndexUpdate,
} from "../../controllers/paycheckIndex";

const router = express.Router();

router.get("/", PaycheckIndexListing);

router.post("/", PaycheckIndexCreation);

router.put("/", PaycheckIndexUpdate);

router.delete("/", PaycheckIndexDestroy);

export default router;
