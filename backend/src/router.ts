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
import { verifyToken2FA } from "./middleware/2fa.middleware";
import { verifyToken } from "./middleware/verifyToken.middleware";
import { verifySession } from "./middleware/session.middleware";
import rateLimit from "express-rate-limit";

export const router = Router();

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // Permite apenas 5 tentativas de login a cada 5 minutos
  message: { message: "Too many login attempts. Try again later." }
});

// search
router.post("/search", verifyToken2FA, searchDb);
router.get("/client", clientCfg);

// auth
router.post("/auth/login", authLimiter, Login);
router.post("/auth/forgot-password", authLimiter, ForgotPass);
router.post("/auth/redefine-password", authLimiter, RedefinePass);
router.get("/auth/two-factor", verifyToken, ActiveTwoFactor);
router.post("/auth/two-factor", verifyToken, ValidateTwoFactor);
router.delete("/auth/two-factor/:userId", verifyToken2FA, DisableTwoFactor);

// users
router.get("/users/me", verifySession, me);
router.get("/users", verifyToken2FA, getAllUser);
router.post("/users", verifyToken2FA, createUser);
router.put("/users/:id", verifyToken2FA, updateUser);
router.delete("/users/:id", verifyToken2FA, deleteUser);

// tasks
router.get("/tasks", verifyToken2FA, getAllTask);
router.get("/task/:id", verifyToken2FA, getTask);
router.get("/tasks/team", verifyToken2FA, getTeam);
router.put("/task/status/:id", verifyToken2FA, updateTaskStatus);
router.put("/task/update", verifyToken2FA, updateKanbanTasks);
router.post("/tasks", verifyToken2FA, createTask);
router.put("/tasks/:id", verifyToken2FA, updateTask);
router.delete("/tasks/:id", verifyToken2FA, deleteTask);

// checklist
router.post("/checklist/:taskId", verifyToken2FA, createItem);
router.post("/checklist/comment/:id", verifyToken2FA, commentChecklist);
router.delete("/checklist/comment/:id", verifyToken2FA, deleteCommentChecklist);
router.put("/checklist/finalize/:id", verifyToken2FA, finalizeChecklist);
router.delete("/checklist/:id", verifyToken2FA, deleteChecklist);

// comments
router.post("/comments/:taskId", verifyToken2FA, createComment);
router.delete("/comments/:commentId", verifyToken2FA, deleteComment);

// reports
router.get("/reports", getReports);

// files
router.get("/files", verifyToken2FA, AllTasks);
router.post("/files/:taskId", verifyToken2FA, uploadFile);
router.delete("/files/:fileId", verifyToken2FA, deleteFile);

// diagnostics
router.get("/diagnostics", verifyToken2FA, allDiagnostics);
router.get("/diagnostics/:id", verifyToken2FA, getDiagnostic);
router.post("/diagnostics", verifyToken2FA, addDiagnostic);
router.post("/diagnostics/:id", verifyToken2FA, answerDiagnostic);
router.post("/diagnostics/rate/:id", verifyToken2FA, rateDiagnostic);
router.post(
  "/diagnostics/generate-task/:id",
  verifyToken2FA,
  generateTaskDiagnostic
);
router.put("/diagnostics/:id", verifyToken2FA, editDiagnostic);
router.delete("/diagnostics/:id", verifyToken2FA, deleteDiagnostic);

// privacy policies
router.get("/policie/:id", viewPolicie); // public view
router.get("/policies", verifyToken2FA, viewPolicies);
router.get("/policies/:id", verifyToken2FA, viewPolicieById);
router.get("/policies/publish/:id", verifyToken2FA, publishPolicie);
router.post("/policies", verifyToken2FA, createPolicie);
router.put("/policies/:id", verifyToken2FA, updatePolicie);
router.delete("/policies/:id", verifyToken2FA, deletePolicie);

// use terms
router.get("/term/:id", viewTerm); // public view
router.get("/terms", verifyToken2FA, viewTerms);
router.get("/terms/:id", verifyToken2FA, viewTermById);
router.get("/terms/publish/:id", verifyToken2FA, publishTerm);
router.post("/terms", verifyToken2FA, createTerm);
router.put("/terms/:id", verifyToken2FA, updateTerm);
router.delete("/terms/:id", verifyToken2FA, deleteTerm);
