document.addEventListener("DOMContentLoaded", function () {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "administrator") {
        window.location.href = "index.html"; // Redirect to login page
    }
});

// tasks functionality

// Function to retrieve tasks from local storage and display them in the table
function displayTasks() {
    // Retrieve tasks from local storage
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Get the table body element
    var taskList = document.getElementById("taskList");

    // Clear existing content in the table
    taskList.innerHTML = '';

    // Loop through tasks and add them to the table
    tasks.forEach(function (task, index) {
        var newRow = taskList.insertRow(taskList.rows.length);
        newRow.innerHTML = `
            <td>${task.taskID}</td>
            <td>${task.taskName}</td>
            <td>${task.taskDescription}</td>
            <td>${task.taskStartDate}</td>
            <td>${task.taskEndDate}</td>
            <td>${task.status}</td>
        `;
    });
}

// Call the displayTasks function to display tasks on page load
window.onload = function () {
    displayTasks();
    displayMembers();
    displayAssignedTasks();
    displayProfileInfo();
};


function showAddTaskModal() {
    $('#addTaskModal').modal('show');
}

function addTask() {
    // Retrieve task details from the modal fields
    var taskName = document.getElementById("taskName").value;
    var description = document.getElementById("description").value;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;

    // Validate if all fields are filled
    if (taskName.trim() === "" || description.trim() === "" || startDate.trim() === "" || endDate.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }
    createTask(taskName, description, startDate, endDate, null);


    // Clear modal fields
    document.getElementById("taskName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("startDate").value = "";
    document.getElementById("endDate").value = "";

    // Refresh the tasks list
    displayTasks();

    // Close the modal
    $('#addTaskModal').modal('hide');
}

function createTask(taskName, taskDescription, taskStartDate, taskEndDate, assignedMember) {
    // Generate a new task ID
    var taskID = generateTaskID();

    // Create the new task object
    var newTask = {
        taskID: taskID,
        taskName: taskName,
        taskDescription: taskDescription,
        taskStartDate: taskStartDate,
        taskEndDate: taskEndDate,
        assignedMember: assignedMember,
        status: "New" // Assuming the default status is "Pending"
    };

    // Retrieve tasks from localStorage
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Add the new task to the tasks list
    tasks.push(newTask);

    // Save the updated tasks back to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function generateTaskID() {
    // Retrieve tasks from localStorage
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Find the maximum taskID
    var maxTaskID = 0;
    tasks.forEach(function (task) {
        if (task.taskID > maxTaskID) {
            maxTaskID = task.taskID;
        }
    });

    // Increment the maximum taskID to generate a new unique ID
    return maxTaskID + 1;
}


// members
function displayMembers() {
    // Retrieve users from localStorage
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Filter out only members
    var members = users.filter(function(user) {
        return user.role === "member";
    });

    // Get the table body element
    var membersList = document.getElementById("membersList");

    // Clear existing content in the table
    membersList.innerHTML = '';

    // Loop through users and add them to the table
    members.forEach(function(user) {
        var newRow = membersList.insertRow(membersList.rows.length);
        newRow.innerHTML = `
            <td>${user.userID}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <div class="input-group">
                    <input type="number" class="form-control" id="rateInput_${user.userID}" value="${user.rate || 20}">
                    <button class="btn btn-primary" onclick="addRate(${user.userID})"><i class="fas fa-pencil-alt"></i></button>
                </div>
            </td>
        `;
    });
}

function addRate(userID) {
    // Retrieve users from localStorage
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user with the specified userID
    var user = users.find(function(user) {
        return user.userID == userID;
    });

    // Get the rate input value
    var rateInput = document.getElementById(`rateInput_${userID}`);
    var rate = rateInput.value;

    // Update the rate of the user
    user.rate = rate;

    // Save the updated users back to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Refresh the displayed members
    displayMembers();

    // Trigger a SweetAlert2 popup for success
    Swal.fire({
        icon: 'success',
        title: 'Rate added successfully!',
        showConfirmButton: false,
        timer: 1500
    });
}



// assign task:

// admin_dashboard.js

function displayAssignedTasks() {
    // Retrieve tasks from localStorage
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Get the table body element
    var assignedTaskList = document.getElementById("assignedTaskList");

    // Clear existing content in the table
    assignedTaskList.innerHTML = '';

    // Loop through assigned tasks and add them to the table
    tasks.forEach(function (task) {
        if (task.assignedMember) { // Only display tasks with assigned members
            var newRow = assignedTaskList.insertRow(assignedTaskList.rows.length);
            newRow.innerHTML = `
                <td>${task.taskID}</td>
                <td>${task.taskName}</td>
                <td>${task.assignedMember}</td>
                <td>${task.status}</td>
                <td></td>
            `;
        }
    });
}


// admin_dashboard.js

function showAssignTaskModal() {
    // Assuming you have functions getMemberList() and getTaskList() to retrieve member and task lists
    var memberList = getMemberList();
    var taskList = getTaskList();


    // Populate member dropdown
    var memberDropdown = document.getElementById("memberDropdown");
    memberDropdown.innerHTML = '';
    memberList.forEach(function (member) {
        var option = document.createElement("option");
        option.value = member.email;
        option.textContent = member.email;
        memberDropdown.appendChild(option);
    });

    // Populate task dropdown
    var taskDropdown = document.getElementById("taskDropdown");
    taskDropdown.innerHTML = '';
    taskList.forEach(function (task) {
        var option = document.createElement("option");
        option.value = task.taskID; // Assuming taskID is unique
        option.textContent = task.taskName;
        taskDropdown.appendChild(option);
    });

    // Show the modal
    $('#assignTaskModal').modal('show');
}

function assignTask() {
    // Retrieve selected member and task from the modal fields
    var selectedMember = document.getElementById("memberDropdown").value;
    var selectedTask = document.getElementById("taskDropdown").value;

    // Assuming you have a function to assign the task
    assignTaskToMember(selectedMember, selectedTask);

    // Close the modal
    $('#assignTaskModal').modal('hide');
}

// Example function to assign a task to a member
function assignTaskToMember(memberEmail, taskID) {
    // Retrieve the existing tasks from localStorage
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Find the task with the specified taskID
    var assignedTask = tasks.find(function (task) {
        return task.taskID == taskID;
    });

    // Update the task with the assigned member information
    assignedTask.assignedMember = memberEmail;
    assignedTask.status = "Active"; // Assuming you want to set the status to "Assigned"

    // Save the updated tasks back to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayAssignedTasks();
}


// profile js

var currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
function displayProfileInfo() {
    var emailElement = document.getElementById("profileEmail");
    var passwordElement = document.getElementById("profilePassword");

    emailElement.textContent = "Email: " + currentUser.email;
    passwordElement.textContent = "Password: " + currentUser.password;
}



function getMemberList() {
    // Retrieve users from localStorage
    var users = JSON.parse(localStorage.getItem("users")) || [];
    // Filter users with the role "members"
    var memberUsers = users.filter(function (user) {
        return user.role === "member";
    });

    // Return the list of members
    return memberUsers;
}

function getTaskList() {
    // Retrieve tasks from localStorage
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Return the list of tasks
    return tasks;
}


// sidebar click

function showDashboardContent() {
    // Show Dashboard content
    document.getElementById("dashboardContent").style.display = "block";
    document.getElementById("tasksContent").style.display = "none";
    document.getElementById("membersContent").style.display = "none";
    document.getElementById("taskAssignmentContent").style.display = "none";
    document.getElementById("profileContent").style.display = "none";

    // Set active class on the clicked sidebar option
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
    });
    document.getElementById('dashboardLink').classList.add('active');
}

function showTasksContent() {
    // Show Tasks content
    document.getElementById("dashboardContent").style.display = "none";
    document.getElementById("tasksContent").style.display = "block";
    document.getElementById("membersContent").style.display = "none";
    document.getElementById("profileContent").style.display = "none";
    document.getElementById("taskAssignmentContent").style.display = "none";

    // Set active class on the clicked sidebar option
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
    });
    document.getElementById('tasksLink').classList.add('active');
}

function showMembersContent() {
    // Show Members content
    document.getElementById("dashboardContent").style.display = "none";
    document.getElementById("tasksContent").style.display = "none";
    document.getElementById("taskAssignmentContent").style.display = "none";
    document.getElementById("membersContent").style.display = "block";
    document.getElementById("profileContent").style.display = "none";

    // Set active class on the clicked sidebar option
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
    });
    document.getElementById('membersLink').classList.add('active');
}

function showTaskAssignmentContent() {
    // Hide other content sections
    document.getElementById("dashboardContent").style.display = "none";
    document.getElementById("tasksContent").style.display = "none";
    document.getElementById("membersContent").style.display = "none";
    document.getElementById("profileContent").style.display = "none";

    // Show Task Assignment content
    document.getElementById("taskAssignmentContent").style.display = "block";

    // Set active class on the clicked sidebar option
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
    });
    document.getElementById('taskAssignmentLink').classList.add('active');
}


function showProfileContent() {
    // Show Profile content
    document.getElementById("dashboardContent").style.display = "none";
    document.getElementById("tasksContent").style.display = "none";
    document.getElementById("membersContent").style.display = "none";
    document.getElementById("taskAssignmentContent").style.display = "none";
    document.getElementById("profileContent").style.display = "block";

    // Set active class on the clicked sidebar option
    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.remove('active');
    });
    document.getElementById('profileLink').classList.add('active');
}

// Dashboard Charts

// Assuming you have a function to retrieve task data
function getTaskData() {
    // Implement logic to retrieve task data (completed, pending, in-progress)
    // For example:
    var completedTasks = 10;
    var pendingTasks = 5;
    var inProgressTasks = 8;

    return [completedTasks, pendingTasks, inProgressTasks];
}

// Function to update the pie chart
// function updatePieChart() {
//     var taskData = getTaskData();

//     var ctx = document.getElementById('taskStatusChart').getContext('2d');
//     var myChart = new Chart(ctx, {
//         type: 'pie',
//         data: {
//             labels: ['Completed Tasks', 'Pending Tasks', 'In Progress Tasks'],
//             datasets: [{
//                 data: taskData,
//                 backgroundColor: [
//                     'rgba(75, 192, 192, 0.2)',
//                     'rgba(255, 99, 132, 0.2)',
//                     'rgba(255, 205, 86, 0.2)'
//                 ],
//                 borderColor: [
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(255, 205, 86, 1)'
//                 ],
//                 borderWidth: 1
//             }]
//         }
//     });
// }

function updateAdminMemberChart() {
    var ctx = document.getElementById('adminMemberChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Admins', 'Members'],
            datasets: [{
                label: 'Number of Users',
                data: [2, 5],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function updateTaskStatusChart() {
    var ctx = document.getElementById('taskStatusChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Pending', 'In Progress'],
            datasets: [{
                label: 'Tasks by Status',
                data: [2, 3, 4],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 205, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 205, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}


function updateHoursSpentChart() {
    var ctx = document.getElementById('hoursSpentChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',  // Change to line chart
        data: {
            labels: ['Task 1', 'Task 2', 'Task 3'], // Add task names
            datasets: [{
                label: 'Hours Spent',
                data: [20, 14, 30], // Add hours spent for each task
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function updateTaskCostChart() {
    var ctx = document.getElementById('taskCostChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',  // Change to doughnut chart
        data: {
            labels: ['Task 1', 'Task 2', 'Task 3'], // Add task names
            datasets: [{
                label: 'Total Cost',
                data: [20, 60, 80], // Add total cost for each task
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 205, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 205, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}






// Call the function to update the pie chart
updateAdminMemberChart();
updateTaskStatusChart();
updateHoursSpentChart();
updateTaskCostChart();



function logout() {
    // Remove the current user information from local storage
    localStorage.removeItem('currentUser');
    
    // Redirect to the login page (you may adjust the URL as needed)
    window.location.href = "index.html";
}