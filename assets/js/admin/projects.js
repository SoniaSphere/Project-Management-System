// Function to add a project
function addProject() {
    var projectName = document.getElementById("projectName").value;
    var projectDescription = document.getElementById("projectDescription").value;

    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    var projectId = Date.now();

    // Create a new project object
    var newProject = {
        id: projectId,
        name: projectName,
        description: projectDescription,
        tasks: []
    };

    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));

    $('#addProjectModal').modal('hide');
    displayProjects();
}

function displayProjects() {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];
    var projectsContainer = document.getElementById("projectsContainer");

    // Clear existing content in the container
    projectsContainer.innerHTML = '';

    projects.forEach(function (project) {
        var card = document.createElement("div");
        card.classList.add("card", "mr-4");

        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        var cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = project.name;

        var cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = project.description;

        var editButton = document.createElement("button");
        editButton.classList.add("btn", "btn-primary", "mr-2");
        editButton.textContent = "Edit";
        editButton.setAttribute("data-toggle", "modal");
        editButton.setAttribute("data-target", "#editProjectModal");
        editButton.onclick = function() {
            // Populate the edit project modal with project details for editing
            populateEditProjectModal(project.id);
        };

        var deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            // Prompt user for confirmation before deleting project
            var confirmDelete = confirm("Are you sure you want to delete this project?");
            if (confirmDelete) {
                deleteProject(project.id);
            }
        };

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(editButton);
        cardBody.appendChild(deleteButton);
        card.appendChild(cardBody);

        // Add click functionality to the card
        card.onclick = function() {
            showProjectDetails(project.id);
        };

        projectsContainer.appendChild(card);
    });
}

function populateEditProjectModal(id) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    console.log(projects);

    // Find the project with the given id
    var project = projects.find(function (proj) {
        return proj.id === id;
    });

    // Populate the modal fields with project details

    document.getElementById("editProjectId").value = project.id;
    document.getElementById("editProjectName").value = project.name;
    document.getElementById("editProjectDescription").value = project.description;

    // Show the modal
    $('#editProjectModal').modal('show');
}

function saveEditedProject() {
    var id = parseInt(document.getElementById("editProjectId").value);
    var newName = document.getElementById("editProjectName").value;
    var newDescription = document.getElementById("editProjectDescription").value;


    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the project with the given id
    var projectIndex = projects.findIndex(function (proj) {
        return proj.id === id;
    });

    if (projectIndex !== -1) {
        // Update the project details
        projects[projectIndex].name = newName;
        projects[projectIndex].description = newDescription;

        // Save the updated projects back to storage
        localStorage.setItem("projects", JSON.stringify(projects));
    }

    alert(`Project updated successfully!`);
    
     // Close the modal
     $('#editProjectModal').modal('hide');


     // Refresh the displayed projects
    displayProjects();

}


function deleteProject(id) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Filter out the project with the given id
    var updatedProjects = projects.filter(function (proj) {
        return proj.id !== id;
    });

    // Update local storage
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    // Refresh the displayed projects
    displayProjects();
}

function showProjectDetails(projectId) {
    // Retrieve project details from local storage
    var projects = JSON.parse(localStorage.getItem("projects")) || [];
    var project = projects.find(project => project.id === projectId);

    var projectDetailsContainer = document.getElementById("projectDetailsContainer");
    var tasksContainer = document.getElementById("tasksContainer");
    var taskAssignmentContainer = document.getElementById("taskAssignmentContainer");
    var addtaskBtn = document.getElementById("add-task");
    var assignBtn = document.getElementById("assign-task");

   

    // Clear existing content in the container
    projectDetailsContainer.innerHTML = '';

    // Create elements to display project details
    var projectNameElement = document.createElement("h3");
    projectNameElement.textContent = project.name;

    var projectDescriptionElement = document.createElement("p");
    projectDescriptionElement.textContent = project.description;

    projectDetailsContainer.appendChild(projectNameElement);
    projectDetailsContainer.appendChild(projectDescriptionElement);

    if (project && project.tasks) {
        tasksContainer.style.display = "block";
        taskAssignmentContainer.style.display = "block"
        displayTasks(projectId);
        displayAssignedTasks(projectId);
        addtaskBtn.setAttribute("data-project-id", project.id);
        assignBtn.setAttribute("data-project-id", project.id);
        addtaskBtn.onclick = function() {
            showAddTaskModal();
        };
    }
}

function showAddTaskModal() {
    $('#addTaskModal').modal('show');
}

function addTask() {
    // Retrieve the project ID from the modal's attribute
    var projectId = parseInt(document.getElementById("add-task").getAttribute("data-project-id"));

    // Retrieve task details from the modal fields
    var taskName = document.getElementById("taskName").value;
    var taskDescription = document.getElementById("description").value;

    // Validate if all fields are filled
    if (taskName.trim() === "" || taskDescription.trim() === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Retrieve projects from localStorage
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the project
    var project = projects.find(project => project.id === projectId);

    if (project) {
        // Create a new task object
        var newTask = {
            taskID: generateTaskID(), // Assuming you have a function to generate unique IDs
            taskName: taskName,
            taskDescription: taskDescription,
            assignedMember: null,
            status: "New"
        };


        // Add the new task to the project's tasks
        project.tasks.push(newTask);

        // Save the updated projects back to localStorage
        localStorage.setItem("projects", JSON.stringify(projects));

        // Refresh the tasks list (for the specific project)
        displayTasks(project.id);

        // Close the modal
        $('#addTaskModal').modal('hide');
         // Clear modal fields
         document.getElementById("taskName").value = "";
         document.getElementById("description").value = "";
    } else {
        alert("Project not found.");
    }
}

function displayTasks(projectId) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];
    var taskList = document.getElementById("taskList");

    // Clear existing content in the table
    taskList.innerHTML = '';

    var project = projects.find(project => project.id === projectId);

    console.log(project);

    if (project && project.tasks.length > 0) {
        project.tasks.forEach(function (task) {
            var newRow = taskList.insertRow(taskList.rows.length);
            newRow.innerHTML = `
                <td>${task.taskID}</td>
                <td>${task.taskName}</td>
                <td>${task.taskDescription}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.taskID}, ${project.id})">Delete</button>
                </td>
            `;
        });
    } else {
        // If there are no tasks for this project, display a message
        var newRow = taskList.insertRow(0);
        newRow.innerHTML = `
            <td colspan="4"><p class="no-task">No tasks for this project.</p></td> 
        `;
    }
}


function deleteTask(taskId, projectId) {
    console.log(taskId);
    // Retrieve projects from local storage
    var projects = JSON.parse(localStorage.getItem('projects')) || [];

    // Find the project with the specified projectId
    var project = projects.find(project => project.id === projectId);

    // Prompt user for confirmation before deleting project
    var confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        project.tasks = project.tasks.filter(task => task.taskID !== taskId);
    
        // Update projects in local storage
        localStorage.setItem('projects', JSON.stringify(projects));
    
        // Refresh the task list display
        displayTasks(projectId);
    }

    
}



function generateTaskID() {
    // Retrieve projects from localStorage
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the maximum taskID across all projects
    var maxTaskID = 0;

    projects.forEach(function (project) {
        project.tasks.forEach(function (task) {
            var taskIdNumber = parseInt(task.taskID);
            if (taskIdNumber > maxTaskID) {
                maxTaskID = taskIdNumber;
            }
        });
    });

    // Increment the maximum taskID
    var newTaskID = maxTaskID + 1;

    return newTaskID;
}




// Function to populate the assign task modal with members, tasks, and projects
function populateAssignTaskModal() {
    var users = JSON.parse(localStorage.getItem("users")) || [];

    var memberDropdown = document.getElementById("memberDropdown");
    var taskDropdown = document.getElementById("taskDropdown");
    var projectId = parseInt(document.getElementById("assign-task").getAttribute("data-project-id"));

    // Populate member dropdown based on users with role "member"
    users.forEach(function (user) {
        if (user.role === "member") {
            var option = document.createElement("option");
            option.value = user.userID;
            option.text = user.name;
            memberDropdown.appendChild(option);
        }
    });

    // Populate project dropdown
    var projects = JSON.parse(localStorage.getItem("projects")) || [];
    var project = projects.find(project => project.id === projectId);

    if (project) {
        // Populate task dropdown based on tasks in the selected project
        project.tasks.forEach(function (task) {
            var option = document.createElement("option");
            option.value = task.taskID;
            option.text = task.taskName;
            taskDropdown.appendChild(option);
        });
    }
}


// Function to handle task assignment
function assignTask() {
    var memberId = parseInt(document.getElementById("memberDropdown").value);
    var taskId = parseInt(document.getElementById("taskDropdown").value);

    if (memberId && taskId) {
        var projects = JSON.parse(localStorage.getItem("projects")) || [];

        // Find the project containing the task
        var project = projects.find(project => project.tasks.some(task => task.taskID === taskId));

        if (project) {
            // Find the task by ID
            var task = project.tasks.find(task => task.taskID === taskId);

            if (task) {
                // Assign the task to the member
                task.assignedMember = memberId;

                // Optionally, you can refresh the task list display
                // displayTasks();

                // Update projects in local storage
                localStorage.setItem("projects", JSON.stringify(projects));
                displayAssignedTasks(project.id);
                // Close the modal
                $('#assignTaskModal').modal('hide');
            } else {
                alert("Task not found.");
            }
        } else {
            alert("Project not found.");
        }
    } else {
        alert("Please select a member and a task.");
    }
}

function displayAssignedTasks(projectId) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the project with the specified projectId
    var project = projects.find(project => project.id === projectId);

    if (project) {
        var assignedTaskList = document.getElementById("assignedTaskList");

        // Clear existing content in the table
        assignedTaskList.innerHTML = '';

        // Filter tasks that have an assigned member
        var assignedTasks = project.tasks.filter(task => task.assignedMember !== null);

        if (assignedTasks.length === 0) {
            // If there are no assigned tasks, display a message
            var newRow = assignedTaskList.insertRow(0);
            newRow.innerHTML = `
                <td colspan="4"><p class="no-task">No tasks assigned at the moment.</p></td>
            `;
        } else {
            assignedTasks.forEach(function (task) {
                var newRow = assignedTaskList.insertRow(assignedTaskList.rows.length);
                newRow.innerHTML = `
                    <td>${task.taskID}</td>
                    <td>${task.taskName}</td>
                    <td>${task.assignedMember}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteAssign(${project.id}, ${task.taskID})">Delete</button>
                    </td>
                `;
            });
        }
    } else {
        console.error("Project not found.");
    }
}

function deleteAssign(projectId, taskId) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the project with the specified projectId
    var project = projects.find(project => project.id === projectId);

    if (project) {
        // Find the task by ID
        var task = project.tasks.find(task => task.taskID === taskId);

        if (task) {
            // Ask for confirmation
            var confirmDelete = confirm("Are you sure you want to remove the assignment?");
            
            if (confirmDelete) {
                // Remove the assigned member
                task.assignedMember = null;

                // Update projects in local storage
                localStorage.setItem("projects", JSON.stringify(projects));

                // Optionally, you can refresh the assigned task list display
                displayAssignedTasks(projectId);
            }
        } else {
            console.error("Task not found.");
        }
    } else {
        console.error("Project not found.");
    }
}

// clearTasksForProject(1697397555579);


function clearTasksForProject(projectId) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the project with the specified projectId
    var project = projects.find(project => project.id === projectId);

    if (project) {
        // Clear tasks for the project
        project.tasks = [];
        
        // Update projects in local storage
        localStorage.setItem("projects", JSON.stringify(projects));

        // Optionally, you can refresh the display or perform any other actions
        displayProjects();
    } else {
        console.error("Project not found.");
    }
}


// Initialize project list on page load
window.onload = displayProjects;
