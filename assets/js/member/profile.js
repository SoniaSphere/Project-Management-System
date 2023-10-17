const roleOptions = [
    { value: 'member', label: 'Member' },
    { value: 'administrator', label: 'Admin' },
];

function displayProfile(){

    var currentUser = JSON.parse(localStorage.getItem("currentUser")); 

    var formName = document.getElementById('name');
    var formEmail = document.getElementById('email')

    const roleDropdown = document.getElementById('role');
    roleOptions.forEach(option => {
        const roleOption = document.createElement('option');
        roleOption.value = option.value;
        roleOption.textContent = option.label;
        roleDropdown.appendChild(roleOption);
    });

    if(currentUser){
        formName.value = currentUser.name
        formEmail.value = currentUser.email

        var roleIndex = (currentUser.role === "member") ? 0 : 1
        roleDropdown[roleIndex].selected = true
    }

}

function updateProfile(){

    var currentUser = JSON.parse(localStorage.getItem("currentUser")); 

    var name = document.getElementById('name').value;
    var pwd = document.getElementById('password').value;
    var c_pwd = document.getElementById('c_password').value;

    if(name.trim() === "" || pwd.trim() === "" || c_pwd.trim() === ""){
        alert("Please fill in all fields.")
        return
    }

    if(pwd !== c_pwd){
        alert("Passwords does not match.")
        return
    }

    if(pwd == currentUser.password){
        alert("New password cannot be old password.")
        return
    }

    var users = JSON.parse(localStorage.getItem("users")) || [];
    var updatedUser = {
        userID: currentUser.userID,
        email: currentUser.email,
        password: pwd,
        role: currentUser.role,
        name: name
    }
    users[users.findIndex(user => user.userID == currentUser.userID)] = updatedUser

    // Store the updated user value in localStorage
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Save the updated users back to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    alert("Profile Updated Successfully.")
    displayProfile()

}

// const profilePicture = document.getElementById('profile_pic');
// const profilePictureInput = document.getElementById('profile-picture-input');

// profilePicture.addEventListener('click', () => {
//     profilePictureInput.click();
// });

// profilePictureInput.addEventListener('change', () => {
//     const file = profilePictureInput.files[0];
//     if (file) {
//         const url = URL.createObjectURL(file);
//         profilePicture.src = url;
//     }
// });

// Initialize project list on page load
window.onload = displayProfile;