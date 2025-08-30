import express from "express";
import { getPlans, getPlanById, seedPlans } from "../controllers/planController.js";

const router = express.Router();

router.get("/", getPlans);

router.get("/:planId", getPlanById);

router.get("/seed", seedPlans);

export default router;