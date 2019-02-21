const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  postsByUser,
  postById,
  isPoster,
  updateProject,
  deleteProject
} = require("../controllers/projects");
const { testValidator } = require("../validations/projects");
const { requireSignin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/get", getProjects);
router.post("/new/:userId", requireSignin, createProject, testValidator);
router.get("/by/:userId", requireSignin, postsByUser);
router.put("/:postId", requireSignin, isPoster, updateProject);
router.delete("/:postById", requireSignin, isPoster, deleteProject);

// any route containing :userId, our app will first execute userById()
router.param("userId", userById);
// any route containing :postId, our app will first execute postById
router.param("postId", postById);

module.exports = router;
