document.addEventListener('DOMContentLoaded', function() {
    const signinBtn = document.getElementById('signin-btn');
  
    signinBtn.addEventListener('click', function() {
      const username = document.getElementById('signin-username').value.trim();
      const password = document.getElementById('signin-password').value.trim();
  
      if (!username || !password) {
        document.getElementById('signin-message').textContent = "Please fill in all fields.";
        return;
      }
  
      fetch('http://localhost:5050/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById('signin-message').textContent = "Sign-in successful!";
          // Redirect or show the user’s dashboard if needed
        } else {
          document.getElementById('signin-message').textContent = "Invalid username or password.";
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('signin-message').textContent = "An error occurred. Please try again.";
      });
    });
  });

document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.getElementById('register-btn');
  
    registerBtn.addEventListener('click', function() {
      const username = document.getElementById('register-username').value.trim();
      const password = document.getElementById('register-password').value.trim();
      const firstname = document.getElementById('register-firstname').value.trim();
      const lastname = document.getElementById('register-lastname').value.trim();
      const salary = parseFloat(document.getElementById('register-salary').value.trim());
      const age = parseInt(document.getElementById('register-age').value.trim());
  
      if (!username || !password || !firstname || !lastname || isNaN(salary) || isNaN(age)) {
        document.getElementById('register-message').textContent = "Please fill out all fields.";
        return;
      }
  
      fetch('http://localhost:5050/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
          firstname,
          lastname,
          salary,
          age
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById('register-message').textContent = "Registration successful!";
          clearRegisterFields();
        } else {
          document.getElementById('register-message').textContent = "Error registering user.";
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('register-message').textContent = "An error occurred. Please try again.";
      });
    });
  
    function clearRegisterFields() {
      document.getElementById('register-username').value = '';
      document.getElementById('register-password').value = '';
      document.getElementById('register-firstname').value = '';
      document.getElementById('register-lastname').value = '';
      document.getElementById('register-salary').value = '';
      document.getElementById('register-age').value = '';
    }
  });
  
  