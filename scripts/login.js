document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    // Check if already logged in
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'admin.html';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    sessionStorage.setItem('isLoggedIn', 'true');
                    window.location.href = 'admin.html';
                } else {
                    errorMsg.style.display = 'block';
                }
            })
            .catch(err => {
                console.error('Login error:', err);
                errorMsg.textContent = '系統錯誤，請稍後再試';
                errorMsg.style.display = 'block';
            });
    });
});
