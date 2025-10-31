
import { Database } from './database-auth.js';
const db = new Database();

class dashboard {


    constructor() {
        this.user = JSON.parse(localStorage.getItem('user')); // user burada tutulur
    }

    async init() {
        document.addEventListener('DOMContentLoaded', async () => {
            console.log("DOMContentLoaded tetiklendi");

            this.loadUserInfo();
            await this.loadFriends();
        });
    }

    loadUserInfo() {
        if (this.user) {
            document.getElementById('currentUser').textContent = this.user.username;
        } else {
            console.warn("User verisi yok, loadUserInfo atlandı.");
        }
    }

    loadFriends() {
        const friends = await db.getFriends(user.id);
        console.log('Arkadaşlar:', friends);
        console.log('Arkadaşrrrr');
        /*const contactsList = document.getElementById("contactsList");

        // Yeni contact-item div'i oluştur
        const contactItem = document.createElement("div");
        contactItem.classList.add("contact-item");
        contactItem.dataset.contact = name.toLowerCase().replace(/\s+/g, '');

        // Avatar kısmı
        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("contact-avatar");
        const avatarImg = document.createElement("img");
        avatarImg.src = avatarUrl || "https://via.placeholder.com/50/ff7f50/ffffff?text=" + name.charAt(0);
        avatarImg.alt = name;
        avatarDiv.appendChild(avatarImg);

        // Bilgi kısmı
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("contact-info");
        infoDiv.innerHTML = `
    <div class="contact-name">${name}</div>
    <div class="contact-last-message">${message}</div>
  `;

        // Meta kısmı
        const metaDiv = document.createElement("div");
        metaDiv.classList.add("contact-meta");

        const timeDiv = document.createElement("div");
        timeDiv.classList.add("last-time");
        timeDiv.textContent = time;

        const unreadDiv = document.createElement("div");
        unreadDiv.classList.add("unread-count");
        if (unreadCount === 0) unreadDiv.classList.add("hidden");
        unreadDiv.textContent = unreadCount;

        metaDiv.appendChild(timeDiv);
        metaDiv.appendChild(unreadDiv);

        // Tüm parçaları birleştir
        contactItem.appendChild(avatarDiv);
        contactItem.appendChild(infoDiv);
        contactItem.appendChild(metaDiv);

        // Listeye ekle
        contactsList.appendChild(contactItem);*/
    }
}


setupEventListeners() {
    // Arkadaş seçimi
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', function () {
            const contactId = this.getAttribute('data-contact');
            selectContact(contactId);
        });
    });

    // Mesaj gönderme
    const messageInput = document.querySelector('.message-input');
    const sendBtn = document.querySelector('.send-btn');

    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Çıkış butonu
    document.querySelector('.logout-btn').addEventListener('click', logout);

    // Arama
    document.querySelector('.search-input').addEventListener('input', function (e) {
        filterContacts(e.target.value);
    });
}

selectContact(contactId) {
    // Aktif arkadaşı güncelle
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('active');
    });

    document.querySelector(`[data-contact="${contactId}"]`).classList.add('active');

    // Chat header'ı güncelle
    updateChatHeader(contactId);

    // Mesajları yükle
    loadMessages(contactId);

    // Okunmamış mesaj sayısını sıfırla
    const activeContact = document.querySelector(`[data-contact="${contactId}"]`);
    const unreadCount = activeContact.querySelector('.unread-count');
    if (unreadCount) {
        unreadCount.classList.add('hidden');
        unreadCount.textContent = '0';
    }
}

updateChatHeader(contactId) {
    const contact = document.querySelector(`[data-contact="${contactId}"]`);
    const contactName = contact.querySelector('.contact-name').textContent;
    const contactAvatar = contact.querySelector('.contact-avatar img').src;

    document.querySelector('.chat-user-name').textContent = contactName;
    document.querySelector('.chat-avatar').src = contactAvatar;
}

loadMessages(contactId) {
    const messagesContainer = document.querySelector('.messages-container');

    // Örnek mesajlar (gerçek uygulamada database'den gelecek)
    const sampleMessages = {
        'john': [
            { type: 'received', text: 'Merhaba! Nasılsın?', time: '14:25' },
            { type: 'sent', text: 'Merhaba! İyiyim, teşekkürler. Sen nasılsın?', time: '14:26' },
            { type: 'received', text: 'Ben de iyiyim. Bugün ne yapıyorsun?', time: '14:27' },
            { type: 'sent', text: 'Çalışıyorum, biraz yoğunum. Sen?', time: '14:28' },
            { type: 'received', text: 'Ben de aynı şekilde. Yarın görüşelim mi?', time: '14:30' }
        ],
        'jane': [
            { type: 'received', text: 'Proje nasıl gidiyor?', time: '12:10' },
            { type: 'sent', text: 'Çok iyi gidiyor, teşekkürler!', time: '12:12' },
            { type: 'received', text: 'Harika! Yarın toplantıda görüşürüz.', time: '12:15' }
        ],
        'mike': [
            { type: 'sent', text: 'Merhaba Mike!', time: '09:40' },
            { type: 'received', text: 'Selam! Nasılsın?', time: '09:42' },
            { type: 'sent', text: 'İyiyim, sen nasılsın?', time: '09:43' },
            { type: 'received', text: 'Proje nasıl gidiyor?', time: '09:45' }
        ]
    };

    const messages = sampleMessages[contactId] || [];

    // Mesajları temizle
    messagesContainer.innerHTML = '';

    // Mesajları ekle
    messages.forEach(message => {
        addMessageToChat(message.text, message.type, message.time);
    });

    // En alta kaydır
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

addMessageToChat(text, type, time) {
    const messagesContainer = document.querySelector('.messages-container');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    if (type === 'received') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <img src="https://via.placeholder.com/30/667eea/ffffff?text=J" alt="Avatar">
            </div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const text = messageInput.value.trim();

    if (text) {
        const currentTime = new Date().toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        addMessageToChat(text, 'sent', currentTime);
        messageInput.value = '';

        // Simüle edilmiş otomatik cevap (gerçek uygulamada database'e kaydedilecek)
        setTimeout(() => {
            const autoReplies = [
                'Anladım!',
                'Harika!',
                'Teşekkürler!',
                'Evet, haklısın.',
                'İlginç!',
                'Tamam, anladım.'
            ];

            const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
            addMessageToChat(randomReply, 'received', new Date().toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
            }));
        }, 1000 + Math.random() * 2000);
    }
}

filterContacts(searchTerm) {
    const contacts = document.querySelectorAll('.contact-item');

    contacts.forEach(contact => {
        const name = contact.querySelector('.contact-name').textContent.toLowerCase();
        const lastMessage = contact.querySelector('.contact-last-message').textContent.toLowerCase();

        if (name.includes(searchTerm.toLowerCase()) || lastMessage.includes(searchTerm.toLowerCase())) {
            contact.style.display = 'flex';
        } else {
            contact.style.display = 'none';
        }
    });
}

logout() {
    if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
}

// Responsive için mobile chat toggle
toggleMobileChat() {
    const chatPanel = document.querySelector('.chat-panel');
    chatPanel.classList.toggle('active');
}

}

const app = new dashboard();
app.init();

// Window resize için
window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        document.querySelector('.chat-panel').classList.remove('active');
    }
});
