import express from "express";
import multer from "multer";
import {
  PaycheckCSVImport,
  PaycheckListing,
  PaycheckPDFImport,
} from "../controllers/Paycheck";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/paycheck-import", upload.single("file"), PaycheckCSVImport);

router.post("/paycheck-pdf", upload.single("file"), PaycheckPDFImport);

router.get("/paycheck", PaycheckListing);

export default router;
