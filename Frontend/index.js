document.addEventListener('DOMContentLoaded', function() {
    // Fetch and load all users on page load
    fetch('http://localhost:5050/getAllUsers')
    .then(response => response.json())
    .then(responseData => {
        const users = responseData.data; // Access the `data` property of the response
        if (users && Array.isArray(users)) {
            loadHTMLTable(users);
        } else {
            console.error('Unexpected data format:', responseData);
        }
    })
    .catch(error => console.error('Error fetching users:', error));

    // Event listener for adding a new user
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            const usernameInput = document.getElementById('username-input').value.trim();
            const passwordInput = document.getElementById('password-input').value.trim();
            const firstnameInput = document.getElementById('firstname-input').value.trim();
            const lastnameInput = document.getElementById('lastname-input').value.trim();
            const salaryInput = parseFloat(document.getElementById('salary-input').value.trim());
            const ageInput = parseInt(document.getElementById('age-input').value.trim());
            const registerdayInput = document.getElementById('registerday-input').value;
            const signintimeInput = document.getElementById('signintime-input').value;

            // Input validation (basic example)
            if (!usernameInput || !passwordInput || !firstnameInput || !lastnameInput || isNaN(salaryInput) || isNaN(ageInput)) {
                alert('Please fill out all fields correctly.');
                return;
            }

            fetch('http://localhost:5050/createUser', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput,
                    firstname: firstnameInput,
                    lastname: lastnameInput,
                    salary: salaryInput,
                    age: ageInput,
                    registerday: registerdayInput,
                    signintime: signintimeInput
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('User added:', data);
                if (data && data.username) {
                    insertRowIntoTable(data);  // Insert new user into table
                    clearInputFields();  // Clear form fields after successful submission
                } else {
                    console.error('Unexpected response format:', data);
                    alert('Error adding user.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding user.');
            });
        });
    } else {
        console.error('Add User button not found');
    }

    // Function to clear form input fields
    function clearInputFields() {
        document.getElementById('username-input').value = '';
        document.getElementById('password-input').value = '';
        document.getElementById('firstname-input').value = '';
        document.getElementById('lastname-input').value = '';
        document.getElementById('salary-input').value = '';
        document.getElementById('age-input').value = '';
        document.getElementById('registerday-input').value = '';
        document.getElementById('signintime-input').value = '';
    }

    // Setup event delegation for the table buttons
    document.querySelector('table tbody').addEventListener('click', function(event) {
        if (event.target.className === "delete-row-btn") {
            const id = event.target.dataset.id;
            fetch(`http://localhost:5050/deleteUser/${id}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    }
                });
        }
        if (event.target.className === "edit-row-btn") {
            const btn = event.target;
            const row = btn.parentNode.parentNode;
            toggleEdit(row, btn);
        }
    });
});

function toggleEdit(row, btn) {
    const isEditable = row.isContentEditable;
    row.contentEditable = !isEditable;
    btn.textContent = isEditable ? 'Edit' : 'Save';
    if (isEditable) {
        // Here you can optionally handle the saving of data if needed
        // e.g., update data on the server
        updateUserData(row);
    }
}

function updateUserData(row) {
    const cells = row.getElementsByTagName('td');
    const data = {
        user_id: cells[0].textContent,
        username: cells[1].textContent,
        password: cells[2].textContent,
        firstname: cells[3].textContent,
        lastname: cells[4].textContent,
        salary: cells[5].textContent,
        age: cells[6].textContent,
        registerday: cells[7].textContent,
        signintime: cells[8].textContent
    };
    fetch('http://localhost:5050/updateUser', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log('Update successful');
        } else {
            console.error('Failed to update');
        }
    })
    .catch(error => console.error('Error updating user:', error));
}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');

    if (data.hasOwnProperty('username') && data.hasOwnProperty('password')) {
        let tableHtml = `<tr>`;
        tableHtml += `<td>${data.user_id || ''}</td>`; // Ensure user_id is referenced correctly
        tableHtml += `<td>${data.username || ''}</td>`;
        tableHtml += `<td>${typeof data.password === 'object' ? JSON.stringify(data.password) : data.password}</td>`;
        tableHtml += `<td>${data.firstname || ''}</td>`;
        tableHtml += `<td>${data.lastname || ''}</td>`;
        tableHtml += `<td>${data.salary || ''}</td>`;
        tableHtml += `<td>${data.age || ''}</td>`;
        tableHtml += `<td>${new Date(data.registerday).toLocaleDateString()}</td>`;
        tableHtml += `<td>${new Date(data.signintime).toLocaleString()}</td>`;
        tableHtml += `<td><button class='delete-row-btn' data-id='${data.username}'>Delete</button></td>`;
        tableHtml += `<td><button class='edit-row-btn' data-id='${data.username}'>Edit</button></td>`;
        tableHtml += `</tr>`;

        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    } else {
        console.error('Data format incorrect:', data);
    }
}


function loadHTMLTable(users) {
    console.log(users); 
    const table = document.querySelector('table tbody');
    let tableHtml = "";
    if (users.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='9'>No Data</td></tr>";
        return;
    }
    users.forEach(user => {
        tableHtml += `<tr>`;
        tableHtml += `<td>${user.user_id}</td>`; // Ensure user_id is included
        tableHtml += `<td>${user.username}</td>`;
        tableHtml += `<td>${user.password}</td>`;
        tableHtml += `<td>${user.firstname}</td>`;
        tableHtml += `<td>${user.lastname}</td>`;
        tableHtml += `<td>${user.salary}</td>`;
        tableHtml += `<td>${user.age}</td>`;
        tableHtml += `<td>${new Date(user.registerday).toLocaleDateString()}</td>`;
        tableHtml += `<td>${new Date(user.signintime).toLocaleString()}</td>`;
        tableHtml += `<td><button class='delete-row-btn' data-id='${user.username}'>Delete</button></td>`;
        tableHtml += `<td><button class='edit-row-btn' data-id='${user.username}'>Edit</button></td>`;
        tableHtml += `</tr>`;
    });
    table.innerHTML = tableHtml;
}


function filterUsers() {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    const tbody = document.querySelector('table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        let firstNameCell = rows[i].getElementsByTagName('td')[3]; // Index 3 for First Name
        let lastNameCell = rows[i].getElementsByTagName('td')[4]; // Index 4 for Last Name
        if (firstNameCell || lastNameCell) {
            let firstName = firstNameCell.textContent.toLowerCase();
            let lastName = lastNameCell.textContent.toLowerCase();
            if (firstName.includes(filter) || lastName.includes(filter)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}


function filterUsersByID() {
    const input = document.getElementById('search-input-id');
    const filter = input.value.toLowerCase();
    const tbody = document.querySelector('table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        let idCell = rows[i].getElementsByTagName('td')[0]; // assuming the user ID is in the first column
        if (idCell) {
            let id = idCell.textContent.toLowerCase();
            if (id.includes(filter)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

document.getElementById('salary-min').addEventListener('change', filterUsersBySalary);
document.getElementById('salary-max').addEventListener('change', filterUsersBySalary);

function updateSalaryRange() {
    const minSlider = document.getElementById('salary-min');
    const maxSlider = document.getElementById('salary-max');
    const minSpan = document.getElementById('salary-range-min');
    const maxSpan = document.getElementById('salary-range-max');

    if (parseInt(minSlider.value) > parseInt(maxSlider.value)) {
        const temp = minSlider.value;
        minSlider.value = maxSlider.value;
        maxSlider.value = temp;
    }

    minSpan.textContent = minSlider.value;
    maxSpan.textContent = maxSlider.value;

    filterUsersBySalary();
}

function filterUsersBySalary() {
    const minSalary = parseInt(document.getElementById('salary-min').value, 10);
    const maxSalary = parseInt(document.getElementById('salary-max').value, 10);
    const tbody = document.querySelector('table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const salary = parseInt(rows[i].getElementsByTagName('td')[5].textContent); // Adjust the index based on your table structure
        if (salary >= minSalary && salary <= maxSalary) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

function validateSalaryRange() {
    const minInput = document.getElementById('salary-min');
    const maxInput = document.getElementById('salary-max');
    const minValue = parseInt(minInput.value, 10);
    const maxValue = parseInt(maxInput.value, 10);

    if (minValue > maxValue) {
        alert('Minimum salary should not exceed maximum salary.');
        minInput.value = '';
        maxInput.value = '';
    }
}

document.getElementById('age-min').addEventListener('change', filterUsersByAge);
document.getElementById('age-max').addEventListener('change', filterUsersByAge);

function filterUsersByAge() {
    const minAge = parseInt(document.getElementById('age-min').value, 10);
    const maxAge = parseInt(document.getElementById('age-max').value, 10);
    const tbody = document.querySelector('table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const age = parseInt(rows[i].getElementsByTagName('td')[6].textContent); // Adjust the index based on your table structure
        if (age >= minAge && age <= maxAge) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}


document.getElementById('age-min').addEventListener('change', validateAgeRange);
document.getElementById('age-max').addEventListener('change', validateAgeRange);

function validateAgeRange() {
    const minInput = document.getElementById('age-min');
    const maxInput = document.getElementById('age-max');
    const minValue = parseInt(minInput.value, 10);
    const maxValue = parseInt(maxInput.value, 10);

    if (minValue > maxValue) {
        alert('Minimum age should not exceed maximum age.');
        minInput.value = '';
        maxInput.value = '';
    }
}


document.getElementById('registerday-start').addEventListener('change', filterUsersByRegisterDay);
document.getElementById('registerday-end').addEventListener('change', filterUsersByRegisterDay);

function filterUsersByRegisterDay() {
    const startDate = new Date(document.getElementById('registerday-start').value);
    let endDate = new Date(document.getElementById('registerday-end').value);
    endDate = new Date(endDate.setDate(endDate.getDate() + 1));

    const tbody = document.querySelector('table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const registerDate = new Date(rows[i].getElementsByTagName('td')[7].textContent); 
        if (registerDate >= startDate && registerDate < endDate) { 
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}


document.getElementById('registerday-start').addEventListener('change', validateDateRange);
document.getElementById('registerday-end').addEventListener('change', validateDateRange);

function validateDateRange() {
    const startDateInput = document.getElementById('registerday-start');
    const endDateInput = document.getElementById('registerday-end');
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (startDate > endDate) {
        alert('Start date should not be later than end date.');
        startDateInput.value = '';
        endDateInput.value = '';
    }
}


function filterNeverSignedIn() {
    const checkbox = document.getElementById('filter-never-signed-in');
    const tbody = document.querySelector('table tbody');
    const rows = tbody.getElementsByTagName('tr');
  
    for (let i = 0; i < rows.length; i++) {
      const signInTimeCell = rows[i].getElementsByTagName('td')[8]; // Assuming signintime is in the 9th column (index 8)
      const signInTime = signInTimeCell.textContent.trim();
  
      if (checkbox.checked) {
        // Check if signintime is the placeholder date or empty
        if (signInTime === '12/31/1969, 7:00:00 PM' || signInTime === '' || signInTime.toLowerCase() === 'null') {
          rows[i].style.display = ""; // Show rows with no sign-in time
        } else {
          rows[i].style.display = "none"; // Hide rows with sign-in time
        }
      } else {
        rows[i].style.display = ""; // Show all rows if checkbox is unchecked
      }
    }
  }
  



