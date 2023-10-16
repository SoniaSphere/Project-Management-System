window.onload = function () {
    displayMembers();
};

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

    if (members.length === 0) {
        // If there are no tasks, display a message
        var newRow = taskList.insertRow(0);
        newRow.innerHTML = `
        <td colspan="7"><p class="no-task">No members available at the moment!</p></td> `;
    } else {

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
