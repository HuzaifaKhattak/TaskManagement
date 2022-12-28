let authUser = undefined;
var emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
var passwordPattern = /^[A-Za-z]\w{4,14}$/;
// let authToken = undefined;
var allAvailableUsers = undefined;

document.getElementById("form-submit").addEventListener("submit", (e) => {
  e.preventDefault();
});
document.getElementById("form-submit-task").addEventListener("submit", (e) => {
  e.preventDefault();
});
document.getElementById("admin-interface").style.display = "none";
document.getElementById("landing-page").style.display = "flex";
document.getElementById("user-interface").style.display = "none";
document.getElementById("user-toDo-task-card").style.display = "none";
document.getElementById("user-inProgress-task-card").style.display = "none";
document.getElementById("user-complete-task-card").style.display = "none";

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var saveUser = async () => {
  let userFullName = document.getElementById("userFullName").value;
  let userEmail = document.getElementById("userEmail").value;
  let userPassword = document.getElementById("userPassword").value;
  let userCpassword = document.getElementById("userCpassword").value;

  let msg = document.getElementById("msg");
  msg.innerHTML = "";
  document.getElementById("userFullName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPassword").value = "";
  document.getElementById("userCpassword").value = "";

  if (
    userFullName != "" &&
    userEmail != "" &&
    userPassword != "" &&
    userCpassword != ""
  ) {
    if (emailPattern.test(userEmail)) {
      if (passwordPattern.test(userPassword)) {
        if (userPassword == userCpassword) {
          await fetch(`/users`, {
            method: "post",

            headers: {
              "content-type": "application/json",
            },

            body: JSON.stringify({
              userFullName: userFullName,
              userEmail: userEmail,
              userPassword: userPassword,
            }),
          });
          msg.innerHTML = `
            <div class="alert alert-success custom-alert" role="alert">
                <strong>Congratulations!!!</strong>Signed Up successfully.
              </div>
            `;
          setTimeout(() => {
            msg.innerHTML = "";
          }, 2000);
        } else if (userPassword != userCpassword) {
          msg.innerHTML = `
            <div class="alert alert-danger custom-alert" role="alert">
                <strong>Password donot match!!!</strong>Try again carefully.
              </div>
            `;
          setTimeout(() => {
            msg.innerHTML = "";
          }, 2000);
        }
      } else {
        msg.innerHTML = `
          <div class="alert alert-danger custom-alert" role="alert">
          <strong>Password</strong> must have at least 4 characters.
          </div>
          `;
        setTimeout(() => {
          msg.innerHTML = "";
        }, 2000);
      }
    } else {
      msg.innerHTML = `
        <div class="alert alert-danger custom-alert" role="alert">
            <strong>Email</strong> is invalid.
        </div>
        `;
      setTimeout(() => {
        msg.innerHTML = "";
      }, 2000);
    }
  } else if (userFullName == "" && userEmail == "" && userPassword == "") {
    msg.innerHTML = `
      <div class="alert alert-danger custom-alert" role="alert">
          Enter your data in the following input fields.
      </div>
      `;
    setTimeout(() => {
      msg.innerHTML = "";
    }, 2000);
  } else if (userFullName == "") {
    msg.innerHTML = `
      <div class="alert alert-danger custom-alert" role="alert">
          Enter your fullname.
      </div>
      `;
    setTimeout(() => {
      msg.innerHTML = "";
    }, 2000);
  } else if (userEmail == "") {
    msg.innerHTML = `s
      <div class="alert alert-danger custom-alert" role="alert">
          Enter your email.
      </div>      
      `;
    setTimeout(() => {
      msg.innerHTML = "";
    }, 2000);
  } else if (userPassword == "") {
    msg.innerHTML = `
      <div class="alert alert-danger custom-alert" role="alert">
          Enter your password.
      </div>
      `;
    setTimeout(() => {
      msg.innerHTML = "";
    }, 2000);
  }
};

var userLogin = async () => {
  // e.preventDefault();
  let loginEmail = document.getElementById("loginEmail").value;
  let loginPassword = document.getElementById("loginPassword").value;
  let msgLogin = document.getElementById("msg-login");
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";

  document.getElementById("msg-login").innerHTML = "";
  if (loginEmail != "" && loginPassword != "") {
    const data = await fetch(`/user-login`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        loginEmail: loginEmail,
        loginPassword: loginPassword,
      }),
    });

    const res = await data.json();
    const token = res?.token;
    if (token) {
      setCookie("auth-Token", token);
      authToken = token;
      msgLogin.innerHTML = `
        <div class="alert alert-success custom-alert" role="alert">
            Successfully logged In
        </div>
        `;
      setTimeout(() => {
        msgLogin.innerHTML = "";
      }, 2000);

      seeAssignedTask();
      document.getElementById("admin-login-button").style.display = "none";
      document.getElementById("landing-page").style.display = "none";
      document.getElementById("user-interface").style.display = "block";
    } else {
      msgLogin.innerHTML = `
        <div class="alert alert-danger custom-alert" role="alert">
            Invalid Credentials
        </div>
        `;
      setTimeout(() => {
        msgLogin.innerHTML = "";
      }, 2000);
    }
  } else if (loginPassword == "" && loginEmail == "") {
    msgLogin.innerHTML = `
      <div class="alert alert-danger custom-alert" role="alert">
        Enter email and  Password
      </div>
      `;
    setTimeout(() => {
      msgLogin.innerHTML = "";
    }, 2000);
  } else if (loginPassword == "") {
    msgLogin.innerHTML = `
      <div class="alert alert-danger custom-alert" role="alert">
        Enter email and  Password
      </div>
      `;
    setTimeout(() => {
      msgLogin.innerHTML = "";
    }, 2000);
  } else if (loginEmail == "") {
    msgLogin.innerHTML = `<h4 class="text-danger">Entere email</h4>
      <div class="alert alert-danger custom-alert" role="alert">
        Enter valid email.
      </div>
      `;
    setTimeout(() => {
      msgLogin.innerHTML = "";
    }, 2000);
  }
};

var logout = async () => {
  setCookie("auth-Token", "");
  authToken = undefined;
  document.getElementById("admin-login-button").style.display = "block";
  document.getElementById("landing-page").style.display = "flex";
  document.getElementById("user-interface").style.display = "none";
};

var getLogedInUser = async () => {
  if (!!authToken) {
    let cbody = document.getElementById("user-profile-card");
    const data = await fetch(`/profile`, {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });
    const user = await data.json();

    if (user) {
      authUser = user;
      cbody.innerHTML = "";

      cbody.innerHTML += `
        <h6 class="card-subtitle mb-2" style="color: #008080">
          User Name: <strong>${user.userFullName}</strong>
        </h6>
        <p class="card-text" style="color: #008080">User Email: <strong>${user.userEmail}</strong></p>
        <button class="btn custom-btns lgot-btn" data-bs-dismiss="modal" onclick="deleteUser()">Delete account</button>

      `;
      document.getElementById("userCurrentFullName").value = user.userFullName;
      document.getElementById("userCurrentEmail").value = user.userEmail;
    }
  } else {
    authUser = undefined;
  }
};

var deleteUser = async () => {
  if (!!authToken) {
    await fetch(`/remove-account`, {
      method: "delete",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    });
    logout();
  }
};

var adminLogin = async (e) => {
  e.preventDefault();
  let adminEmail = document.getElementById("adminEmail").value;
  let adminPassword = document.getElementById("adminPassword").value;
  let msgLogin = document.getElementById("msg-admin-login");
  document.getElementById("adminEmail").value = "";
  document.getElementById("adminPassword").value = "";

  document.getElementById("msg-admin-login").innerHTML = "";
  if (adminEmail != "" && adminPassword != "") {
    const data = await fetch(`/admin-login`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        adminEmail: adminEmail,
        adminPassword: adminPassword,
      }),
    });

    const res = await data.json();
    const token = res?.token;
    if (token) {
      setCookie("auth-Token", token);
      adminAuthToken = token;
      msgLogin.innerHTML = `
        <div class="alert alert-success custom-alert" role="alert">
            Successfully logged In
        </div>
        `;
      setTimeout(() => {
        msgLogin.innerHTML = "";
      }, 2000);

      document.getElementById("admin-interface").style.display = "flex";
      document.getElementById("admin-login-button").style.display = "none";
      document.getElementById("landing-page").style.display = "none";
      document.getElementById("user-interface").style.display = "none";
    }

    const userData = await fetch(`/users`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + adminAuthToken,
      },
    });
    let users = await userData.json();
    let selectUser = document.getElementById("select-user");
    // selectUser.innerHTML = "";
    users.forEach((user) => {
      selectUser.innerHTML += `
      <option value="${user.id}">${user.userFullName}</option>
      `;
    });
  }
};

var adminLogout = async () => {
  setCookie("auth-Token", "");
  authToken = undefined;
  document.getElementById("admin-login-button").style.display = "block";
  document.getElementById("landing-page").style.display = "flex";
  document.getElementById("user-interface").style.display = "none";
  document.getElementById("admin-interface").style.display = "none";
};

var getAllUsers = async () => {
  let data = await fetch(`/users`, {
    method: "get",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + adminAuthToken,
    },
  });
  let users = await data.json();
  allAvailableUsers = users;
  const userTableBody = document.getElementById("users-table-body");
  userTableBody.innerHTML = "";

  users.forEach((user) => {
    userTableBody.innerHTML += `
        <tr>
          <td>${user.userFullName}</td>
          <td>${user.userEmail}</td>
          <td>
            <button class="btn custom-btns lgot-btn" data-bs-dismiss="modal" onclick="deleteUserByAdmin(${user.id})">Delete</button>
          </td>
        </tr>
    `;
  });
};

var getAllTasks = async () => {
  let data = await fetch(`/tasks`, {
    method: "get",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + adminAuthToken,
    },
  });
  let tasks = await data.json();
  const userTableBody = document.getElementById("task-table-body");
  userTableBody.innerHTML = "";

  tasks.forEach((task) => {
    userTableBody.innerHTML += `
        <tr>
          <td>${task.taskTitle}</td>
          <td>${task.taskDescription}</td>
          <td>${task.taskStatus}</td>
          <td>${task.User.userFullName}</td>
          <td>
            <button class="btn custom-btns lgot-btn" onclick="deleteTask(${task.id})">Delete</button>
          </td>
        </tr>
    `;
  });
};

var deleteUserByAdmin = async (uId) => {
  let userId = uId;
  await fetch(`/users/${userId}`, {
    method: "delete",
  });
  getAllUsers();
};

var deleteTask = async (tId) => {
  let taskId = tId;
  await fetch(`/tasks/${taskId}`, {
    method: "delete",
  });
  getAllTasks();
};

var addTask = async () => {
  let taskMsg = document.getElementById("task-msg");
  let taskTitle = document.getElementById("task-title").value;
  let taskDescription = document.getElementById("task-description").value;
  taskStatus = "toDo";
  let fKey = document.getElementById("select-user").value;
  document.getElementById("select-user").value = null;
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";

  if (taskTitle != "" && taskDescription != "" && fKey != null) {
    await fetch(`/tasks`, {
      method: "post",

      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + adminAuthToken,
      },

      body: JSON.stringify({
        taskTitle: taskTitle,
        taskDescription: taskDescription,
        taskStatus: taskStatus,
        userId: fKey,
      }),
    });
    taskMsg.innerHTML = `
        <div class="alert alert-success custom-alert" role="alert">
            <strong>Task Added successfully.</strong>
          </div>
        `;
    setTimeout(() => {
      taskMsg.innerHTML = "";
    }, 2000);
  } else if (taskTitle == "" && taskDescription == "") {
    taskMsg.innerHTML = `
    <div class="alert alert-warning custom-alert" role="alert">
        Add <strong>Task Title</strong> and some <strong>Task's Description.</strong>
      </div>
    `;
    setTimeout(() => {
      taskMsg.innerHTML = "";
    }, 2000);
  } else if (taskTitle == "") {
    taskMsg.innerHTML = `
  <div class="alert alert-warning custom-alert" role="alert">
      Add <strong>Task Title</strong> .</strong>
    </div>
  `;
    setTimeout(() => {
      taskMsg.innerHTML = "";
    }, 2000);
  } else if (taskDescription == "") {
    taskMsg.innerHTML = `
  <div class="alert alert-warning custom-alert" role="alert">
      Add <strong>Task's Description.</strong>
    </div>
  `;
    setTimeout(() => {
      taskMsg.innerHTML = "";
    }, 2000);
  }
};

var seeAssignedTask = async () => {
  let data = await fetch(`/assigned-user-tasks`, {
    method: "get",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
  let userAssignedTask = await data.json();
  console.log(userAssignedTask);
  let taskToDoCard = document.getElementById("user-toDo-task-card");
  let taskInProgressCard = document.getElementById("user-inProgress-task-card");
  let taskCompleteCard = document.getElementById("user-complete-task-card");

  taskToDoCard.innerHTML = "";
  taskInProgressCard.innerHTML = "";
  taskCompleteCard.innerHTML = "";
  // if (userAssignedTask.length == 0) {
  //   taskToDoCard.style.display = "flex";
  //   taskToDoCard.innerHTML += `
  //   <div class="card custom-card-style mx-1 my-2">
  //   <div class="card-body" >
  //     <h5 class="card-title" style="color: #008080">No Assigned Task</h5>
  //     <p class="card-text" style="color: #008080">You can see your task when admin Assign to you</p>
  //   </div>
  // </div>
  //   `;
  // }
  let toDotaskStatusCount = 0;
  let inProcessStatusCount = 0;
  let completeStatusCount = 0;
  userAssignedTask.forEach((task) => {
    if (task.taskStatus == "toDo") {
      toDotaskStatusCount++;
    } else if (task.taskStatus == "inProcess") {
      inProcessStatusCount++;
    } else if (task.taskStatus == "complete") {
      completeStatusCount++;
    }
  });

  if (toDotaskStatusCount == 0) {
    taskToDoCard.style.display = "flex";
    taskToDoCard.innerHTML += `
    <div class="card custom-card-style mx-1 my-2">
    <div class="card-body" >
      <h5 class="card-title" style="color: #008080"><span class="text-danger">No tasks "To Do"</span></p></h5>
      <p class="card-text" style="color: #008080">You can see new tasks when admin Assign to you</p>
    </div>
  </div>
    `;
  } 
   if (inProcessStatusCount == 0) {
    taskInProgressCard.style.display = "flex";
    taskInProgressCard.innerHTML += `
    <div class="card custom-card-style mx-1 my-2">
    <div class="card-body" >
      <h5 class="card-title text-warning">No Tasks In progress</h5>
      <p class="card-text" style="color: #008080">You can see your task's <span class="text-warning">"In Progress"</span> here.</p>
    </div>
  </div>
    `;
  } 
   if (completeStatusCount == 0) {
    taskCompleteCard.style.display = "flex";
    taskCompleteCard.innerHTML += `
    <div class="card custom-card-style mx-1 my-2">
      <div class="card-body" >
      <h5 class="card-title text-warning">No Complete Tasks</h5>
      <p class="card-text" style="color: #008080">You can see your <span class="text-warning">"Completed"</span> task's  here.</p>
      </div>
  </div>
    `;
  }

  userAssignedTask.forEach((task) => {
    if (task.taskStatus == "toDo") {
      taskToDoCard.style.display = "flex";
      taskToDoCard.innerHTML += `
    <div class="card custom-card-style mx-1 my-2">
    <div class="card-body" >
      <h5 class="card-title" style="color: #008080">${task.taskTitle}</h5>
      <p class="card-text" style="color: #008080">${task.taskDescription}</p>
      <label style="color: #008080">Change Task Status</label>
      <div class="d-flex">
        <div onclick="updateStatusInProcess(${task.id})"><i class="fa fa-sharp fa-hourglass custom-icons custom-icons-font-size px-2"></i>
          <span class="text-warning">In progress</span>
        </div>
        <div onclick="updateStatusComplete(${task.id})"><i class="fa fa-sharp fa-check custom-icons px-2 custom-icons-font-size"></i>
        <span class="text-success">Complete</span>
        </div>
      </div>
      </label>
    </div>
  </div>
    `;
    } else if (task.taskStatus == "inProcess") {
      taskInProgressCard.style.display = "flex";
      taskInProgressCard.innerHTML += `
    <div class="card custom-card-style mx-1 my-2">
    <div class="card-body" >
      <h5 class="card-title" style="color: #008080">${task.taskTitle}</h5>
      <p class="card-text" style="color: #008080">${task.taskDescription}</p>
      <label style="color: #008080">Change Task Status</label>
      
      <div class="d-flex">
        <div onclick="updateStatusToDo(${task.id})"><i class="fa fa-sharp fa-ban custom-icons custom-icons-font-size px-2"></i>
          <span class="text-danger">To do</span>
        </div>
        <div onclick="updateStatusComplete(${task.id})"><i class="fa fa-sharp fa-check custom-icons px-2 custom-icons-font-size"></i>
        <span class="text-success">Complete</span>
        </div>
      </div>

    </div>
  </div>
    `;
    } else if (task.taskStatus == "complete") {
      taskCompleteCard.style.display = "flex";
      taskCompleteCard.innerHTML += `
    <div class="card custom-card-style mx-1 my-2">
    <div class="card-body" >
      <h5 class="card-title" style="color: #008080">${task.taskTitle}</h5>
      <p class="card-text" style="color: #008080">${task.taskDescription}</p>
      <label style="color: #008080">Change Task Status</label>
    
      <div class="d-flex">
        <div onclick="updateStatusToDo(${task.id})"><i class="fa fa-sharp fa-ban custom-icons custom-icons-font-size px-2"></i>
          <span class="text-danger">To do</span>
        </div>
        <div onclick="updateStatusInProcess(${task.id})"><i class="fa fa-sharp fa-check custom-icons px-2 custom-icons-font-size"></i>
          <span class="text-warning">In Process</span>
        </div>
      </div>

    </div>
  </div>
    `;
    }
  });
};

var updateStatusToDo = async (tId) => {
  let taskId = tId;
  let taskStatus = "toDo";
  fetch(`/update-task-status/${taskId}`, {
    method: "put",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({
      taskStatus,
    }),
  });
  seeAssignedTask();
};

var updateStatusInProcess = async (tId) => {
  let taskId = tId;
  let taskStatus = "inProcess";
  fetch(`/update-task-status/${taskId}`, {
    method: "put",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({
      taskStatus,
    }),
  });
  seeAssignedTask();
};

var updateStatusComplete = async (tId) => {
  let taskId = tId;
  let taskStatus = "complete";
  fetch(`/update-task-status/${taskId}`, {
    method: "put",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({
      taskStatus,
    }),
  });
  seeAssignedTask();
};

var updateUser = async () => {
  let editName = document.getElementById("userCurrentFullName").value;
  let editEmail = document.getElementById("userCurrentEmail").value;

  document.getElementById("userCurrentFullName").value = "";
  document.getElementById("userCurrentEmail").value = "";
  const data = await fetch(`/update-account`, {
    method: "put",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + authToken,
    },
    body: JSON.stringify({
      userFullName: editName,
      userEmail: editEmail,
    }),
  });
  const result = await data.json();
  console.log(result);
};
