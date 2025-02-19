import { Router } from "express";
import { check } from "express-validator";
import { deleteCategorie, getCategorieById, getCategories, saveCategorie, updateCategorie} from "./categorie.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { existsCategorieById } from "../helpers/db-validator.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existsCategorieById),
    validateFields
  ],
  getCategorieById
);

router.post("/", [validateJWT], saveCategorie);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existsCategorieById),
    validateFields,
  ],
  updateCategorie
);

router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existsCategorieById),
    validateFields,
  ],
  deleteCategorie
);

export default router;