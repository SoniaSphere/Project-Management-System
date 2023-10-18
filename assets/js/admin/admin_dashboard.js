var currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser.role !== "administrator") {
    window.location.href = "../../index.html";
}

function getCurrentAdminID(){
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser.userID;
}

function getMemberById(memberId) {
    var members = JSON.parse(localStorage.getItem("users")) || [];
    return members.find(member => member.userID === memberId);
}


function displayAdminProjectsChart() {
    var currentAdminID = getCurrentAdminID(); // Assume you have a function to get the current admin's ID
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    var projectLabels = [];
    var projectData = [];

    var adminProjects = projects.filter(function(project) {
        return project.adminId === currentAdminID;
    });

    adminProjects.forEach(function(project) {
        projectLabels.push(project.name);
        projectData.push(project.tasks.length); // Assuming you want to display the number of tasks per project
    });

    var ctx = document.getElementById("adminProjectsChart").getContext('2d');

    var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: projectLabels,
            datasets: [{
                label: 'Number of Tasks',
                data: projectData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    precision: 0,
                    title: {
                        display: true,
                        text: 'Number of Tasks'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Projects'
                    }
                }
            }
        }
    });
}

// display admin projects
displayAdminProjectsChart()

function displayTasksStatusDonutChart() {
    var currentAdminID = getCurrentAdminID(); // Assume you have a function to get the current admin's ID
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Initialize data arrays
    var projectLabels = [];
    var completedTasksData = [];
    var pendingTasksData = [];
    var inProgressTasksData = [];

    var adminProjects = projects.filter(function(project) {
        return project.adminId === currentAdminID;
    });

    // Generate unique colors for each project
    var projectColors = generateRandomColors(adminProjects.length);

    adminProjects.forEach(function(project, index) {
        var completedTasks = project.tasks.filter(function(task) {
            return task.status === 'Completed';
        });
        var pendingTasks = project.tasks.filter(function(task) {
            return task.status === 'Pending';
        });
        var inProgressTasks = project.tasks.filter(function(task) {
            return task.status === 'In Progress';
        });

        projectLabels.push(project.name);
        completedTasksData.push(completedTasks.length);
        pendingTasksData.push(pendingTasks.length);
        inProgressTasksData.push(inProgressTasks.length);

        // Assign unique color to the project
        projectColors[index];
    });

    var ctx = document.getElementById("tasksStatusDonutChart").getContext('2d');
    ctx.canvas.width = 100; // Set the width
    ctx.canvas.height = 100; // Set the height

    var pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: projectLabels,
            datasets: [{
                label: 'Completed Tasks',
                data: completedTasksData,
                backgroundColor: projectColors,
                borderWidth: 1
            }, {
                label: 'Pending Tasks',
                data: pendingTasksData,
                backgroundColor: projectColors, // Using the same colors for pending tasks
                borderWidth: 1
            }]
        }
    });
}

function displayTotalCostPieChart() {
    var currentAdminID = getCurrentAdminID(); // Assume you have a function to get the current admin's ID
    var projects = JSON.parse(localStorage.getItem("projects")) || [];

    // Initialize data arrays
    var projectLabels = [];
    var projectCostData = [];

    var adminProjects = projects.filter(function(project) {
        return project.adminId === currentAdminID;
    });


    adminProjects.forEach(function(project) {
        var totalCost = 0;

        project.tasks.forEach(function(task) {
            if (task.assignedMember !== null && task.status === 'Completed') {
                var assignedMember = getMemberById(task.assignedMember);
                totalCost += assignedMember.rate * task.hoursCompleted;
            }
        });

        projectLabels.push(project.name);
        projectCostData.push(totalCost);
    });

    console.log(projectCostData);

    var ctx = document.getElementById("totalCostPieChart").getContext('2d');
    ctx.canvas.style.width = "100px"; // Set the width
    ctx.canvas.style.height = "100px"; // Set the height

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: projectLabels,
            datasets: [{
                label: 'Total Cost',
                data: projectCostData,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    // Add more colors as needed
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 205, 86, 1)',
                    // Add more colors as needed
                ],
                borderWidth: 1
            }]
        }
    });
}


// Function to generate random colors
function generateRandomColors(numColors) {
    var colors = [];
    for (var i = 0; i < numColors; i++) {
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16); // Generate a random hex color
        colors.push(randomColor);
    }
    return colors;
}





displayTasksStatusDonutChart();
displayTotalCostPieChart();






// script.js


