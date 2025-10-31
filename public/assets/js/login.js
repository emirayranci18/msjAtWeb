// login.js
import { Database } from './database-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const db = new Database(); // Database class’ından bağlantı
    console.log("login")
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = this.querySelector('input[name="username"]').value;
            const password = this.querySelector('input[name="password"]').value;
            const submitBtn = this.querySelector('input[type="submit"]');

            submitBtn.value = 'Giriş yapılıyor...';
            submitBtn.disabled = true;

            try {
                const user = await db.login(username, password);

                if (user) {
                    alert('Hoş geldin ' + user.username + '! Giriş başarılı!');
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Kullanıcı adı veya şifre hatalı!');
                }
            } catch (error) {
                console.error('Database bağlantı hatası:', error);
                alert('Database bağlantı hatası. Lütfen tekrar deneyin.');
            } finally {
                submitBtn.value = 'Giriş Yap';
                submitBtn.disabled = false;
            }
        });
    }
});
