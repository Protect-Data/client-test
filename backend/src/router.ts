import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUser,
  me,
  updateUser
} from "./controllers/UserController";
import {
  ActiveTwoFactor,
  DisableTwoFactor,
  ForgotPass,
  Login,
  RedefinePass,
  ValidateTwoFactor
} from "./controllers/AuthController";
import {
  createTask,
  deleteTask,
  getAllTask,
  getTask,
  getTeam,
  updateKanbanTasks,
  updateTask,
  updateTaskStatus
} from "./controllers/TaskController";
import { verifyToken } from "./middleware/verifyToken.middleware";
import { createComment, deleteComment } from "./controllers/CommentController";
import {
  commentChecklist,
  createItem,
  deleteChecklist,
  deleteCommentChecklist,
  finalizeChecklist
} from "./controllers/ChecklistController";
import { getReports } from "./controllers/ReportsController";
import { AllTasks, deleteFile, uploadFile } from "./controllers/FileController";
import { searchDb } from "./controllers/SerchController";
import {
  addDiagnostic,
  allDiagnostics,
  answerDiagnostic,
  deleteDiagnostic,
  editDiagnostic,
  generateTaskDiagnostic,
  getDiagnostic,
  rateDiagnostic
} from "./controllers/DiagnosticController";
import {
  createPolicie,
  deletePolicie,
  publishPolicie,
  updatePolicie,
  viewPolicie,
  viewPolicieById,
  viewPolicies
} from "./controllers/PoliciesController";
import {
  createTerm,
  deleteTerm,
  publishTerm,
  updateTerm,
  viewTerm,
  viewTermById,
  viewTerms
} from "./controllers/TermsController";
import { clientCfg } from "./controllers/ClientController";

export const router = Router();

// search
router.post("/search", verifyToken, searchDb);
router.get("/client", clientCfg);

// auth
router.post("/auth/login", Login);
router.post("/auth/forgot-password", ForgotPass);
router.post("/auth/redefine-password", RedefinePass);
router.get("/auth/two-factor", verifyToken, ActiveTwoFactor);
router.post("/auth/two-factor", verifyToken, ValidateTwoFactor);
router.delete("/auth/two-factor/:userId", verifyToken, DisableTwoFactor);

// users
router.get("/users/me", verifyToken, me);
router.get("/users", verifyToken, getAllUser);
router.post("/users", verifyToken, createUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

// tasks
router.get("/tasks", verifyToken, getAllTask);
router.get("/task/:id", verifyToken, getTask);
router.get("/tasks/team", verifyToken, getTeam);
router.put("/task/status/:id", verifyToken, updateTaskStatus);
router.put("/task/update", verifyToken, updateKanbanTasks);
router.post("/tasks", verifyToken, createTask);
router.put("/tasks/:id", verifyToken, updateTask);
router.delete("/tasks/:id", verifyToken, deleteTask);

// checklist
router.post("/checklist/:taskId", verifyToken, createItem);
router.post("/checklist/comment/:id", verifyToken, commentChecklist);
router.delete("/checklist/comment/:id", verifyToken, deleteCommentChecklist);
router.put("/checklist/finalize/:id", verifyToken, finalizeChecklist);
router.delete("/checklist/:id", verifyToken, deleteChecklist);

// comments
router.post("/comments/:taskId", verifyToken, createComment);
router.delete("/comments/:commentId", verifyToken, deleteComment);

// reports
router.get("/reports", getReports);

// files
router.get("/files", verifyToken, AllTasks);
router.post("/files/:taskId", verifyToken, uploadFile);
router.delete("/files/:fileId", verifyToken, deleteFile);

// diagnostics
router.get("/diagnostics", verifyToken, allDiagnostics);
router.get("/diagnostics/:id", verifyToken, getDiagnostic);
router.post("/diagnostics", verifyToken, addDiagnostic);
router.post("/diagnostics/:id", verifyToken, answerDiagnostic);
router.post("/diagnostics/rate/:id", verifyToken, rateDiagnostic);
router.post(
  "/diagnostics/generate-task/:id",
  verifyToken,
  generateTaskDiagnostic
);
router.put("/diagnostics/:id", verifyToken, editDiagnostic);
router.delete("/diagnostics/:id", verifyToken, deleteDiagnostic);

// privacy policies
router.get("/policie/:id", viewPolicie); // public view
router.get("/policies", verifyToken, viewPolicies);
router.get("/policies/:id", verifyToken, viewPolicieById);
router.get("/policies/publish/:id", verifyToken, publishPolicie);
router.post("/policies", verifyToken, createPolicie);
router.put("/policies/:id", verifyToken, updatePolicie);
router.delete("/policies/:id", verifyToken, deletePolicie);

// use terms
router.get("/term/:id", viewTerm); // public view
router.get("/terms", verifyToken, viewTerms);
router.get("/terms/:id", verifyToken, viewTermById);
router.get("/terms/publish/:id", verifyToken, publishTerm);
router.post("/terms", verifyToken, createTerm);
router.put("/terms/:id", verifyToken, updateTerm);
router.delete("/terms/:id", verifyToken, deleteTerm);
