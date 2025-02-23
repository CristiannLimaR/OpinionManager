import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validate-fields.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { deleteComment, getCommentsByPost, getCommentsByUser, saveComment, updateComment } from "./comment.controller.js";


const router = Router();

router.get("/", validateJWT, getCommentsByUser);

router.get(
  "/publication/:postId",
  [
    check("postId", "No es un ID valido").isMongoId(),
    validateFields
  ],
  getCommentsByPost
);

router.post("/publication/:postId", validateJWT, saveComment);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    validateFields,
  ],
  updateComment
);

router.delete(
  "/:id",
  [
    validateJWT,
    check("id", "No es un ID valido").isMongoId(),
    validateFields,
  ],
  deleteComment
);

export default router;