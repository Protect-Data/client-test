import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  updateUser
} from "./controllers/UserController";
import { ForgotPass, Login, RedefinePass } from "./controllers/AuthController";
import {
  createTask,
  deleteTask,
  getAllTask,
  getTask,
  getTeam,
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
import { searchDb } from "./controllers/SerchController";

export const router = Router();

// search
router.post("/search", verifyToken, searchDb);

// auth
router.post("/auth/login", Login);
router.post("/auth/forgot-password", ForgotPass);
router.post("/auth/redefine-password", RedefinePass);

// users
router.get("/users", verifyToken, getAllUser);
router.post("/users", verifyToken, createUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

// tasks
router.get("/tasks", verifyToken, getAllTask);
router.get("/task/:id", verifyToken, getTask);
router.get("/tasks/team", verifyToken, getTeam);
router.put("/task/status/:id", verifyToken, updateTaskStatus);
router.post("/tasks", verifyToken, createTask);
router.put("/tasks/:id", verifyToken, updateTask);
router.delete("/tasks/:id", verifyToken, deleteTask);

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
