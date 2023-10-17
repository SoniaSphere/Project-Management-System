var addProjects = document.getElementById("add-projects");

function displayProjects() {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];
    var projectsContainer = document.getElementById("projectsContainer");
    var currentUser = JSON.parse(localStorage.getItem("currentUser")); 
    // Clear existing content in the container
    projectsContainer.innerHTML = '';

    // Filter projects that have tasks assigned to the current user
    var assignedProjects = projects.filter(function(project) {
        return project.tasks.some(task => task.assignedMember === currentUser.userID);
    });

    if (assignedProjects.length === 0) {
        // If there are no projects assigned to the current user, display a message
        var message = document.createElement("p");
        message.classList.add("no-project-message");
        message.textContent = "No projects assigned to you.";
        projectsContainer.appendChild(message);
    } else {
        addProjects.style.display = 'block';
        assignedProjects.forEach(function (project) {
            var card = document.createElement("div");

            card.classList.add("project-card", "mr-4");
    
            var cardBody1 = document.createElement("div");
            cardBody1.classList.add("back-folder-part");
    
            var cardBody2 = document.createElement("div");
            cardBody2.classList.add("main-folder-part");
    
            var cardTitle = document.createElement("h5");
            cardTitle.classList.add("card-title");
    
            cardTitle.textContent = project.name;

            cardBody2.appendChild(cardTitle);
            cardBody1.appendChild(cardBody2);
            card.appendChild(cardBody1);

            // Add click functionality to the card
            card.onclick = function() {
                showProjectDetails(project.id);
            };

            projectsContainer.appendChild(card);
        });
    }
}

function showProjectDetails(projectId) {
    // Retrieve project details from local storage
    var projects = JSON.parse(localStorage.getItem("projects")) || [];
    var project = projects.find(project => project.id === projectId);

    var projectsContainer = document.getElementById("projectsContainer");
    var projectDetailsContainer = document.getElementById("projectDetailsContainer");
    var tasksContainer = document.getElementById("tasksContainer");

    projectsContainer.style.display = 'none';
    projectDetailsContainer.style.display = 'block';
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
        displayAssignedTasks(projectId);
    }
}

function displayAssignedTasks(projectId) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the project with the specified projectId
    var project = projects.find(project => project.id === projectId);

    var currentUser = JSON.parse(localStorage.getItem("currentUser")); 

    if (project) {
        var assignedTaskList = document.getElementById("assignedTaskList");

        // Clear existing content in the table
        assignedTaskList.innerHTML = '';

        // Filter tasks that have an assigned member
        // var assignedTasks = project.tasks.filter(task => task.assignedMember !== null);
        var assignedTasks = project.tasks.filter(task => task.assignedMember == currentUser.userID);

        if (assignedTasks.length === 0) {
            // If there are no assigned tasks, display a message
            var newRow = assignedTaskList.insertRow(0);
            newRow.innerHTML = `
                <td colspan="5"><p class="no-task">No tasks assigned at the moment.</p></td>
            `;
        } else {
            assignedTasks.forEach(function (task) {
                var newRow = assignedTaskList.insertRow(assignedTaskList.rows.length);
                var hoursCompleted = task.hoursCompleted != undefined ? task.hoursCompleted : "N/A";
                newRow.innerHTML = `
                    <td>${task.taskID}</td>
                    <td>${task.taskName}</td>
                    <td>${task.taskDescription}</td>
                    <td>${hoursCompleted}</td>
                    <td>
                        <select class="form-select" onchange="changeTaskStatus(${project.id}, ${task.taskID}, this)">
                            <option value="New" ${task.status === "New" ? "selected" : ""}>New</option>
                            <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                            <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                        </select>
                    </td>
                `;
            });
        }
    } else {
        console.error("Project not found.");
    }
}


function changeTaskStatus(projectId, taskId, selectElement) {
    var newStatus = selectElement.value;
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the project with the specified projectId
    var project = projects.find(project => project.id === projectId);

    if (project) {
        // Find the task by ID
        var task = project.tasks.find(task => task.taskID === taskId);

        if (task) {
            // Update the task's status
            task.status = newStatus;

            // Automatically populate start and end dates based on status
            var currentDate = new Date().toISOString().slice(0, 10); // Get current date in format "YYYY-MM-DD"

            if (newStatus === "In Progress" && !task.taskStartDate) {
                task.taskStartDate = currentDate;
            } else if (newStatus === "Completed" && (task.hoursCompleted == undefined || !task.taskEndDate))  {
                task.taskEndDate = currentDate;

                // Prompt member to enter hours completed
                var hoursCompleted = prompt("Enter the number of hours completed:");
                if (hoursCompleted !== null && hoursCompleted !== "") {
                    task.hoursCompleted = parseInt(hoursCompleted);
                }
            }

            // Update the project in the projects array
            project.tasks = project.tasks.map(t => t.taskID === taskId ? task : t);

            // Update projects in local storage
            localStorage.setItem("projects", JSON.stringify(projects));

            // Optionally, you can refresh the display to reflect the updated status
            displayAssignedTasks(projectId);
        } else {
            console.error("Task not found.");
        }
    } else {
        console.error("Project not found.");
    }
}






// clearAssignedTasks(1697397555579);

function clearAssignedTasks(projectId) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the project with the specified projectId
    var project = projects.find(project => project.id === projectId);

    if (project) {
        // Clear the assigned member for all tasks in the project
        project.tasks.forEach(task => {
            task.assignedMember = null;
        });

        // Update the project in the projects array
        projects = projects.map(p => p.id === projectId ? project : p);

        // Update projects in local storage
        localStorage.setItem("projects", JSON.stringify(projects));

        // Optionally, you can refresh the display to reflect the updated tasks
        displayAssignedTasks(projectId);
    } else {
        console.error("Project not found.");
    }
}



// Initialize project list on page load
window.onload = displayProjects;