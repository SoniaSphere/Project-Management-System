var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUserID = currentUser.userID;
var addProjects = document.getElementById("add-projects");
var noProjectCt = document.getElementById("no-project-ct");

function successMsg(msg){
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: msg,
        showConfirmButton: false,
        timer: 1500
    });
}

function errorMsg(msg){
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        showConfirmButton: false,
        timer: 1500
    });
}

// Function to add a project
function addProject() {
    
    var projectName = document.getElementById("projectName").value;
    var projectDescription = document.getElementById("projectDescription").value;

    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    if(projectName.trim() == '' || projectDescription.trim() == ''){
        errorMsg('Please fill all the fields!')
        return;
    }

    // Create a new project object
    var newProject = {
        id: generateProjectID(),
        name: projectName,
        description: projectDescription,
        adminId: currentUserID,
        tasks: []
    };

    successMsg('Project is added successfully!')

    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));

    $('#addProjectModal').modal('hide');
    displayProjects();
}

function displayProjects() {
    
    var allProjects = JSON.parse(localStorage.getItem("projects")) || [];
    // Filter projects for the current user
    var projects = allProjects.filter(function(project) {
        return project.adminId === currentUserID;
    });
    
    if(projects.length == 0){
        addProjects.style.display = 'none';
        noProjectCt.style.display = 'block';
    }else{
        addProjects.style.display = 'block';
        noProjectCt.style.display = 'none';
    }

    

    var projectsContainer = document.getElementById("projectsContainer");

    // Clear existing content in the container
    projectsContainer.innerHTML = '';

    projects.forEach(function (project) {
        var card = document.createElement("div");

        card.classList.add("project-card", "mr-4");

        var cardBody1 = document.createElement("div");
        cardBody1.classList.add("back-folder-part");

        var cardBody2 = document.createElement("div");
        cardBody2.classList.add("main-folder-part");

        var cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");

        cardTitle.textContent = project.name;

        var editButton = document.createElement("button");
        editButton.classList.add("btn", "edit");
        editButton.innerHTML = '<i class="fa fa-edit" aria-hidden="true"></i>';
        editButton.setAttribute("data-toggle", "modal");
        editButton.setAttribute("data-target", "#editProjectModal");
        editButton.onclick = function() {
            // Populate the edit project modal with project details for editing
            populateEditProjectModal(project.id);
        };

        var deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "delete");
        deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
        deleteButton.onclick = function() {
            // Prompt user for confirmation before deleting project
            var confirmDelete = confirm("Are you sure you want to delete this project?");
            if (confirmDelete) {
                deleteProject(project.id);
            }
        };

        cardBody2.appendChild(cardTitle);
        cardBody1.appendChild(cardBody2);
        card.appendChild(cardBody1);
        card.appendChild(editButton);
        card.appendChild(deleteButton);


        // Add click functionality to the card
        cardBody2.onclick = function() {
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

    if(newName.trim() == '' || newDescription.trim() == ''){
        errorMsg('Please fill all the fields!')
        return;
    }


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

    successMsg(`Project updated successfully!`);
    
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
    var projectsContainer = document.getElementById("add-projects");
    var projectDetailsContainer = document.getElementById("projectDetailsContainer");
    var tasksContainer = document.getElementById("tasksContainer");
    var taskAssignmentContainer = document.getElementById("taskAssignmentContainer");
    var addtaskBtn = document.getElementById("add-task");
    var assignBtn = document.getElementById("assign-task");

   
    projectsContainer.style.display = 'none';
    projectDetailsContainer.style.display = 'block';
    // Clear existing content in the container
    projectDetailsContainer.innerHTML = '';

    var backElement = document.createElement("span");
    backElement.classList.add('go-back-btn');
    backElement.innerHTML = `<i class="fa fa-arrow-circle-left" aria-hidden="true" onclick="window.location.reload();"></i>`;

    // Create elements to display project details
    var projectNameElement = document.createElement("h3");
    projectNameElement.textContent = project.name;

    var projectDescriptionElement = document.createElement("p");
    projectDescriptionElement.textContent = project.description;

    projectDetailsContainer.appendChild(backElement);
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
        errorMsg("Please fill in all fields.");
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
            status: "Pending"
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
        errorMsg("Project not found.");
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
                    <button class="btn btn-sm" onclick="deleteTask(${task.taskID}, ${project.id})"><i class="fa fa-trash" aria-hidden="true"></i></button>
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

        project.tasks.filter(task => task.taskID == taskId).forEach( task => {
            //check if task has been assigned or not before deleting a task.
            if(checkTaskAssigned(task)){
                errorMsg("This task has been assigned to a member. Remove the task assignment first to delete a task."); 
                return
            }
            else{

                project.tasks = project.tasks.filter(task => task.taskID !== taskId);

                // Update projects in local storage
                localStorage.setItem('projects', JSON.stringify(projects));
            
                // Refresh the task list display
                displayTasks(projectId);

                //Refresh the assigned task list display
                displayAssignedTasks(projectId)
                
            }
        })

        
    }
    
}

function checkTaskAssigned(task){
    var users = JSON.parse(localStorage.getItem("users")) || [];
    var assignedMember = users.find(function (user){
        return user.userID === task.assignedMember
    });
    console.log("check task assign for task: "+task.taskID +" is "+assignedMember)
    return assignedMember
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

//
function generateProjectID() {
    // Retrieve projects from localStorage
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Find the maximum projectID
    var maxProjectID = 0;

    projects.forEach(function (project) {
        var projectIdNumber = parseInt(project.id);
        if (projectIdNumber > maxProjectID) {
            maxProjectID = projectIdNumber;
        }
    });

    // Increment the maximum projectID
    var newProjectID = maxProjectID + 1;

    return newProjectID;
}





// Function to populate the assign task modal with members, tasks, and projects
function populateAssignTaskModal() {
    var users = JSON.parse(localStorage.getItem("users")) || [];

    var memberDropdown = document.getElementById("memberDropdown");
    var taskDropdown = document.getElementById("taskDropdown");
    var projectId = parseInt(document.getElementById("assign-task").getAttribute("data-project-id"));

    //remove previous appended task list for redundancy
    while(taskDropdown.firstChild){
        taskDropdown.removeChild(taskDropdown.firstChild)
    }
    //remove previous appended members list for redundancy
    while(memberDropdown.firstChild){
        memberDropdown.removeChild(memberDropdown.firstChild)
    }

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
                errorMsg("Task not found.");
            }
        } else {
            errorMsg("Project not found.");
        }
    } else {
        errorMsg("Please select a member and a task.");
    }
}

function displayAssignedTasks(projectId) {
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    var users = JSON.parse(localStorage.getItem("users")) || [];

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

                //Find the assigned member of the task
                var assignedMember = users.find(user => user.userID === task.assignedMember);
                console.log("task:"+task.taskID+" got:" +assignedMember)

                var newRow = assignedTaskList.insertRow(assignedTaskList.rows.length);
                newRow.innerHTML = `
                    <td>${task.taskID}</td>
                    <td>${task.taskName}</td>
                    <td>${assignedMember.name}</td>
                    <td>
                        <button class="btn btn-sm" onclick="deleteAssign(${project.id}, ${task.taskID})"> <i class="fa fa-trash" aria-hidden="true"></i></button>
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

// localStorage.removeItem("projects");
