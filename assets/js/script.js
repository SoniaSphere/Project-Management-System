var users = JSON.parse(localStorage.getItem("users")) || [];

function showSuccessMessage(message) {
    document.getElementById("successMessage").innerText = message;
    $('#successModal').modal('show');
}

function showErrorMessage(message, color = "red") {
    var errorMessageElement = document.getElementById("errorMessage");
    errorMessageElement.innerText = message;
    errorMessageElement.style.color = color;
    $('#errorModal').modal('show');
}

function validateEmail(email) {
    // Regular expression for a valid email format
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return email.match(emailPattern);
}

function login() {
    var email = document.querySelector("#email").value;
    var password = document.querySelector("#password").value;

    if (validateLoginInputs(email, password)) {
        var user = findUser(email, password);

        if (user) {
            loginUser(user);
            redirectToDashboard(user.role);
        } else {
            showErrorMessage("Invalid credentials. Please try again.");
        }
    }
}

function validateLoginInputs(email, password) {
    if (email.trim() === "" || password.trim() === "") {
        showErrorMessage("Please enter both email and password.");
        return false;
    }

    if (!validateEmail(email)) {
        showErrorMessage("Please enter a valid email address.");
        return false;
    }

    return true;
}

function findUser(email, password) {
    return users.find(function (user) {
        return user.email === email && user.password === password;
    });
}

    if (user) {
        // Store the current user in localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));

        // Redirect to respective dashboards based on role
        if (user.role === "administrator") {
            window.location.href = "admin_dashboard.html";
        } else if (user.role === "member") {
            window.location.href = "member_dashboard.html";
        }
    } else {
        alert("Invalid credentials. Please try again.");
    }
}


function register() {
    var name = document.querySelector("#reg-name").value;
    var email = document.querySelector("#reg-email").value;
    var password = document.querySelector("#reg-password").value;
    var confirmPassword = document.querySelector("#confirm-password").value;
    var role = document.querySelector("#role").value;

    if (validateRegistrationInputs(name, email, password, confirmPassword, role)) {
        if (!isEmailRegistered(email)) {
            registerUser(email, password, role, name);
            showSuccessMessage("Registration successful! You can now log in.");
        }
    }
}

function validateRegistrationInputs(name, email, password, confirmPassword, role) {
    if (name.trim() === "" || email.trim() === "" || password.trim() === "" || role.trim() === "" || confirmPassword.trim() === "") {
        showErrorMessage("Please fill in all fields.");
        return false;
    }

    if (!validateEmail(email)) {
        showErrorMessage("Please enter a valid email address.");
        return false;
    }

    if (!isPasswordValid(password)) {
        showErrorMessage("Password must be at least 8 characters long and contain a capital letter, a lowercase letter, and a number.");
        return false;
    }

    if (password !== confirmPassword) {
        showErrorMessage("Password and Confirm Password do not match.");
        return false;
    }

    return true;
}

function isEmailRegistered(email) {
    var existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {
        showErrorMessage("This email is already registered. Please use a different email.");
        return true;
    }

    return false;
}

function isPasswordValid(password) {
    // Password must be at least 8 characters, contain a capital letter, a lowercase letter, and a number
    var lengthCheck = password.length >= 8;
    var capitalCheck = /[A-Z]/.test(password);
    var lowercaseCheck = /[a-z]/.test(password);
    var numberCheck = /\d/.test(password);

    return lengthCheck && capitalCheck && lowercaseCheck && numberCheck;
}


