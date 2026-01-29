import express from "express";
import { fetchItems } from "../controllers/itemController.js";

const router = express.Router();

router.get("/items", fetchItems);

export default router;
