import { Router } from "express";
import { check } from "express-validator";
import { deleteCategory, getCategoryById, getCategories, saveCategory, updateCategory} from "./category.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { existsCategoryById } from "../helpers/db-validator.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existsCategoryById),
    validateFields
  ],
  getCategoryById
);

router.post("/", [validateJWT], saveCategory);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existsCategoryById),
    validateFields,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existsCategoryById),
    validateFields,
  ],
  deleteCategory
);

export default router;