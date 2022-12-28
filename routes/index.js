var express = require('express');
const TaskManagerController = require('../controllers/TaskManagerController');
const adminAuthenticate = require('../middleware/adminAuthenticate');
const authenticate = require('../middleware/Authenticate');
var router = express.Router();

/* GET home page. */
router.get("/", TaskManagerController.huzaifaTask);
router.post('/user-login', TaskManagerController.userLogin);
router.get("/profile", authenticate, TaskManagerController.profile);
router.post('/users', TaskManagerController.createUser);
router.put("/update-account", authenticate, TaskManagerController.updateUser);
router.get('/users', adminAuthenticate, TaskManagerController.getUsers);
router.delete("/remove-account", authenticate, TaskManagerController.deleteUser);
router.delete("/users/:userId", TaskManagerController.deleteUserByAdmin);
router.post("/admin-login", TaskManagerController.adminLogin);
router.post('/tasks',adminAuthenticate, TaskManagerController.addTask);
router.delete("/tasks/:taskId", TaskManagerController.deleteTask);
router.get("/tasks",adminAuthenticate, TaskManagerController.getAllTasks);
router.get("/assigned-user-tasks",authenticate, TaskManagerController.userAssignedTasks);
router.put("/update-task-status/:tId",authenticate, TaskManagerController.updateTaskStatus);
router.get("/see-task-status",authenticate, TaskManagerController.seeTaskStatus);


module.exports = router;
