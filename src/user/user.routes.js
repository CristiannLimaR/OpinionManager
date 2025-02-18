import { Router } from "express";
import { check } from "express-validator";
import { getUsers, updateUser, getUserById} from "./user.controller.js";
import { validateFields } from "../middlewares/validate-fields.js";
import { existsUserById } from "../helpers/db-validator.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { updateUserValidator } from "../middlewares/validator.js";

const router = Router();

router.get("/", getUsers);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existsUserById),
    validateFields,
  ],
  getUserById
);


router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existsUserById),
    updateUserValidator,
    validateFields
  ],
  updateUser
);


export default router;