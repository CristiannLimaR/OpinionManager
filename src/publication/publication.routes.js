import { Router } from "express";
import { deletePublication, getPublications, getPublicationsById, savePublication, updatePublication } from "./publication.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { check } from "express-validator";


const router = Router();

router.get("/", getPublications);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    validateFields
  ],
  getPublicationsById
);

router.post("/", [validateJWT], savePublication);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    validateFields,
  ],
  updatePublication
);

router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    validateFields,
  ],
  deletePublication
);

export default router;