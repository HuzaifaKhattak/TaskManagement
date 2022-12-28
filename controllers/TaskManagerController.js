const { where, json } = require("sequelize");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const userSecret = "userAuthenticator";
const adminSecret = "adminAuthenticator";
const User = db.User;
const Task = db.Task;
const Admin = db.Admin;




class TaskManagerController {
  constructor() {}
  //index
  static async huzaifaTask(req, res, next) {
    return res.render("index");
  }
  static async userLogin(req, res, next) {
    const {loginEmail,loginPassword} = req.body;
    let user = await User.findOne({
      where: {
        userEmail: loginEmail,
      },
    });

    const match = await bcrypt.compare(loginPassword, user.userPassword);
    if (match && user?.dataValues) {
      const token = jwt.sign(user.dataValues, userSecret, { expiresIn: "1800s" });
      return res.json({ token ,user});
    } 
  else {
      return res.status(403).json({ error: "Not Allowed" });
    }
  }

  static async profile(req, res, next) {
    let user = await User.findOne({
      where: { id: req?.user?.id },
    });
    return res.json(user);
  }

  static async createUser(req, res, next) {
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.userPassword, salt);
    let user = {
      userFullName: req.body.userFullName,
      userEmail: req.body.userEmail,
      userPassword: secPassword,
    };

    await User.create(user);
    return res.json(user);
  }

  static async updateUser(req, res, next) {
    const user = req.user;
    let data = {
      userFullName: req.body.editName,
      userEmail: req.body.editEmail,
    };

    const result = await User.update(data, {
      where: {
        id: user.id,
      },
    });
    return res.json(result);
  }


  static async getUsers(req, res, next) {
    const users = await User.findAll();
    return res.json(users);
  }

  static async deleteUser(req, res, next) {
    const user = req.user;
    const result = await User.destroy({
      where: {
        id: user.id,
      },
    });

    return res.json(result);
  }




  //admin backend
    static async adminLogin(req, res, next) {
    let admin = await Admin.findOne({
      where: {
        adminEmail: req.body.adminEmail,
        adminPassword: req.body.adminPassword,
      },
    });
    if (admin?.dataValues) {
      const token = jwt.sign(admin.dataValues, adminSecret, { expiresIn: "1800s" });
      return res.json({ token ,admin});
    } else {
      return res.status(403).json({ error: "Not Allowed" });
    }
  }
  static async addTask(req, res, next) {
    let task = {
      taskTitle: req.body.taskTitle,
      taskDescription : req.body.taskDescription,
      taskStatus:"toDo",
      userId: req.body.userId,
    };
    await Task.create(task);
    return res.json(task);
  }

  static async deleteTask(req, res, next) {
    const result = await Task.destroy({
      where: {
        id: req.params.taskId,
      },
    });

    return res.json(result);
  }
  static async deleteUserByAdmin(req, res, next) {
    const result = await User.destroy({
      where: {
        id: req.params.userId,
      },
    });

    return res.json(result);
  }

  static async getAllTasks(req, res, next) {
    const tasks = await Task.findAll({include: [User]});
    return res.json(tasks);
  }
 
  static async userAssignedTasks(req, res, next){
    let user = req.user;
    let assignedTasks = await Task.findAll({include:[User], where:{userId: user.id}});
    return res.json(assignedTasks);
  }
  static async updateTaskStatus(req, res, next){
    if(req.user){
      let tStatus = {
        taskStatus:req.body.taskStatus,
      };
      const result = await Task.update(tStatus,{where:{id:req.params.tId}});
      return res.json(result);
    }
  }

  static async seeTaskStatus(req, res, next){
    if(req.user){
      let user=req.user;
      let uId = user.id;
      const task = await Task.findAll({
        where:{
          userId:uId,
        }
      });
      return res.json(task)
    }
  }
}

module.exports = TaskManagerController;
