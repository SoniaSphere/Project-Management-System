var users = JSON.parse(localStorage.getItem("users"));
console.log(users);

function showSuccessMessage(message) {
    document.getElementById("successMessage").innerText = message;
    $('#successModal').modal('show');
}

function showErrorMessage(message) {
    document.getElementById("errorMessage").innerText = message;
    $('#errorModal').modal('show');
}

function login() {
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;

    // Check if email and password are not empty
    if (email.trim() === "" || password.trim() === "") {
        showErrorMessage("Please enter both email and password.");
        return;
    }

    // Retrieve data from localStorage
    var users = JSON.parse(localStorage.getItem("users"));

    // Check if user exists
    var user = users.find(function (user) {
        return user.email === email && user.password === password;
    });

    if (user) {
        // Store the current user in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Redirect to respective dashboards based on role
        if (user.role === "administrator") {
            window.location.href = "template-parts/admin/admin_dashboard.html";
        } else if (user.role === "member") {
            window.location.href = "template-parts/member/member_dashboard.html";
        }
    } else {
        showErrorMessage("Invalid credentials. Please try again.");
    }
}


function register() {
    var name = document.querySelector("#reg-name").value;
    var email = document.querySelector("#reg-email").value;
    var password = document.querySelector("#reg-password").value;
    var confirmPassword = document.querySelector("#confirm-password").value;
    var role = document.querySelector("#role").value;


    // Check if email, password, and role are not empty
    if (email.trim() === "" || password.trim() === "" || role.trim() === "") {
        showErrorMessage("Please fill in all fields.");
        return;
    }

    // Retrieve existing users from localStorage or initialize an empty array
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if the email is already registered
    var existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {
        showErrorMessage("This email is already registered. Please use a different email.");
        return;
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
        showErrorMessage("Password and Confirm Password do not match.");
        return;
    }

    // Validate the password according to your criteria
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!password.match(passwordRegex)) {
        showErrorMessage("Password must be at least 8 characters long and contain a capital letter, a lowercase letter, and a number.");
        return;
    }

    registerUser(email, password, role, name);

    // Clear the input fields
    document.querySelector("#email").value = "";
    document.querySelector("#password").value = "";
    document.querySelector("#role").value = "";

    // Switch to the login tab
    document.querySelector("#login-tab").click();

    showErrorMessage("Registration successful! You can now log in.");
}

function registerUser(email, password, role, name) {
    // Generate a new user ID
    var userID = generateUserID();

    // Create the new user object
    var newUser = {
        userID: userID,
        email: email,
        password: password,
        role: role,
        name: name
    };

    if(role == 'member'){
        newUser.rate = 20; // default rate
    }

    // Retrieve users from localStorage
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Add the new user to the users list
    users.push(newUser);

    // Save the updated users back to localStorage
    localStorage.setItem("users", JSON.stringify(users));
}


function generateUserID() {
    // Retrieve users from localStorage
    var users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the maximum userID
    var maxUserID = 0;
    users.forEach(function (user) {
        if (user.userID > maxUserID) {
            maxUserID = user.userID;
        }
    });

    // Increment the maximum userID to generate a new unique ID
    return maxUserID + 1;
}


document.addEventListener("DOMContentLoaded", function () {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // if (!currentUser || currentUser.role !== "administrator") {
    //     window.location.href = "index.html"; // Redirect to login page
    // }
});

function logout() {
    // Remove the current user information from local storage
    localStorage.removeItem('currentUser');
    
    // Redirect to the login page (you may adjust the URL as needed)
    window.location.href = "../../index.html";
}
