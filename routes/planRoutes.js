import express from "express";
import { getPlans, getPlanById, seedPlans } from "../controllers/planController.js";

const router = express.Router();

router.get("/", getPlans);

router.post("/seed", seedPlans);

router.get("/:planId", getPlanById);

export default router;