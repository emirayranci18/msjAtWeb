
import { Database } from './database-auth.js';
const db = new Database();

class dashboard {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('user'));
    }

    async init() {
        document.addEventListener('DOMContentLoaded', async () => {
            console.log("DOMContentLoaded tetiklendi");
            this.setupEventListeners();
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

    async getUser(id) {
        const user = await db.getUserById(id);
        return user;
    }

    async loadFriends() {
        const friends = await db.getFriends(this.user.id);
        const contactsList = document.querySelector(".contacts-list");

        contactsList.innerHTML = "";

        friends.forEach(friend => {
            const name = friend.username || "Bilinmeyen";
            const message = friend.last_message || ""; // varsa mesaj, yoksa boş
            const time = friend.last_time || ""; // opsiyonel
            const unreadCount = friend.unread_count || 0; // opsiyonel

            // contact-item div'i
            const contactItem = document.createElement("div");
            contactItem.classList.add("contact-item");
            contactItem.dataset.contact = name.toLowerCase().replace(/\s+/g, '');
            contactItem.dataset.id = friend.id

            // Avatar
            const avatarDiv = document.createElement("div");
            avatarDiv.classList.add("contact-avatar");
            const avatarImg = document.createElement("img");
            avatarImg.alt = name;
            avatarImg.src = friend.avatar_url || "assets/images/default-avatar.png";
            avatarDiv.appendChild(avatarImg);

            // Bilgi kısmı
            const infoDiv = document.createElement("div");
            infoDiv.classList.add("contact-info");

            // Mesaj varsa ekle
            const lastMessageHtml = message
                ? `<div class="contact-last-message">${message}</div>`
                : "";

            infoDiv.innerHTML = `
        <div class="contact-name">${name}</div>
        ${lastMessageHtml}
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

            // Parçaları birleştir
            contactItem.appendChild(avatarDiv);
            contactItem.appendChild(infoDiv);
            contactItem.appendChild(metaDiv);

            contactsList.appendChild(contactItem);
        });

    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const contact = e.target.closest('.contact-item');
            if (contact) {
                this.selectContact(contact.dataset.id)
            }
        });

        // Mesaj gönderme
        const messageInput = document.querySelector('.message-input');
        const sendBtn = document.querySelector('.send-btn');

        sendBtn.addEventListener('click', this.sendMessage);

        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Çıkış butonu
        document.querySelector('.logout-btn').addEventListener('click', this.logout);

        // Arama
        document.querySelector('.search-input').addEventListener('input', function (e) {
            filterContacts(e.target.value);
        });
    }

    selectContact(contactId) {
        this.updateChatHeader(contactId);
        this.loadMessages(contactId);
    }

    async updateChatHeader(contactId) {
        const user = await this.getUser(contactId);

        document.querySelector('.chat-user-name').textContent = user.username;
        document.querySelector('.chat-avatar').src = contactAvatar;
    }

    async loadMessages(contactId) {
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) return console.error("messages-container bulunamadı!");

        // Önce temizle
        messagesContainer.innerHTML = '';

        // Supabase'den mesajları al
        const messages = await db.getMessages(this.user.id, contactId);
        console.log("mesajlar alınıyor");

        if (!messages || messages.length === 0) {
            messagesContainer.innerHTML = '<div class="no-messages">Henüz mesaj yok</div>';
            return;
        }

        // Her mesajı sırayla ekle
        messages.forEach(msg => {
            // Mesajın türünü belirle (gönderen ben miyim?)
            const type = msg.sender_id === this.user.id ? 'sent' : 'received';
            const text = msg.content;
            const time = new Date(msg.sent_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });

            this.addMessageToChat(text, type, time);
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
