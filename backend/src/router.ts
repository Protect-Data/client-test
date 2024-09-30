import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  updateUser
} from "./controllers/UserController";
import { ForgotPass, Login } from "./controllers/AuthController";
import {
  createTask,
  deleteTask,
  getAllTask,
  getTask,
  updateTask,
  updateTaskStatus
} from "./controllers/TaskController";
import verifyToken from "./middleware/verifyToken.middleware";
import { createComment, deleteComment } from "./controllers/CommentController";
import {
  createItem,
  deleteChecklist,
  finalizeChecklist
} from "./controllers/ChecklistController";
import { getReports } from "./controllers/ReportsController";
import { deleteFile, uploadFile } from "./controllers/FileController";

export const router = Router();

// auth
router.post("/auth/login", Login);
router.post("/auth/forgot-password", ForgotPass);

// users
router.get("/users", getAllUser);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// tasks
router.get("/tasks", getAllTask);
router.get("/task/:id", getTask);
router.put("/task/status/:id", verifyToken, updateTaskStatus);
router.post("/tasks", verifyToken, createTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);

// checklist
router.post("/checklist/:taskId", verifyToken, createItem);
router.put("/checklist/finalize/:id", verifyToken, finalizeChecklist);
router.delete("/checklist/:id", verifyToken, deleteChecklist);

// comments
router.post("/comments/:taskId", verifyToken, createComment);
router.delete("/comments/:commentId", verifyToken, deleteComment);

// reports
router.get("/reports", getReports);

// files
router.post("/files/:taskId", verifyToken, uploadFile);
router.delete("/files/:fileId", verifyToken, deleteFile);

// diagnostics
