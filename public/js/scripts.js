// public/js/scripts.js

// Example: Simple form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitBtn = form.querySelector('input[type="submit"]');
  
    form.addEventListener('submit', function(event) {
      const username = form.querySelector('input[name="username"]').value;
      const password = form.querySelector('input[name="password"]').value;
  
      if (!username || !password) {
        alert('Please fill in all fields');
        event.preventDefault(); // Prevent form submission
      }
    });
  });
  