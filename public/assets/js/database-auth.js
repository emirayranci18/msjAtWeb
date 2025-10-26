// Supabase ile database auth
const SUPABASE_URL = 'https://jncqzwnqutwhuvkekrig.supabase.co'; // Buraya Supabase URL'nizi yazın
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuY3F6d25xdXR3aHV2a2VrcmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTQ4NTIsImV4cCI6MjA3NjAzMDg1Mn0.-tI6UgIjJ6Yg8oHDuyhDa4AmerI1c3BAzxzy_1g9Txs'; // Buraya API key'inizi yazın

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = this.querySelector('input[name="username"]').value;
            const password = this.querySelector('input[name="password"]').value;
            const submitBtn = this.querySelector('input[type="submit"]');
            
            // Loading state
            submitBtn.value = 'Giriş yapılıyor...';
            submitBtn.disabled = true;
            
            try {
                // Supabase'den kullanıcı kontrolü
                const response = await fetch(`${SUPABASE_URL}/rest/v1/users?username=eq.${username}&password=eq.${password}`, {
                    method: 'GET',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const users = await response.json();
                
                if (users && users.length > 0) {
                    alert('Hoş geldin ' + users[0].username + '! Giriş başarılı!');
                    // Başarılı giriş
                    localStorage.setItem('user', JSON.stringify(users[0]));
                    // Dashboard'a yönlendir
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Kullanıcı adı veya şifre hatalı!');
                }
                
            } catch (error) {
                console.error('Database Error:', error);
                alert('Database bağlantı hatası. Lütfen tekrar deneyin.');
            } finally {
                // Reset button
                submitBtn.value = 'Giriş Yap';
                submitBtn.disabled = false;
            }
        });
    }
});
