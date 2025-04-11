import express from "express";
import multer from "multer";
import {
  PaycheckCreation,
  PaycheckCSVImport,
  PaycheckDestroy,
  PaycheckListing,
  PaycheckPDFImport,
  PaycheckUpdate,
} from "../../controllers/paycheck";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", PaycheckListing);

router.post("/", PaycheckCreation);

router.post("/import", upload.single("file"), PaycheckCSVImport);

router.post("/pdf", upload.single("file"), PaycheckPDFImport);

router.put("/", PaycheckUpdate);

router.delete("/", PaycheckDestroy);

export default router;
