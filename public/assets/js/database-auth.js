
// Database.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

export class Database {
    constructor() {
        this.supabase = createClient(
            'https://jncqzwnqutwhuvkekrig.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuY3F6d25xdXR3aHV2a2VrcmlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTQ4NTIsImV4cCI6MjA3NjAzMDg1Mn0.-tI6UgIjJ6Yg8oHDuyhDa4AmerI1c3BAzxzy_1g9Txs'
        );
    }

    // Login kontrolü
    async login(username, password) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password);

        if (error) {
            console.error('Login hatası:', error.message);
            return null;
        }

        if (data.length === 0) return null;

        return data[0];
    }

    async getFriends(userId) {
        try {
            if (!userId) {
                console.error('getFriends: userId undefined!');
                return [];
            }

            console.log('getFriends çağrıldı, userId:', userId);

            const { data: relations, error: relError } = await this.supabase
                .from('friends_list')
                .select('*')
                .or(`id_one.eq."${userId}",id_two.eq."${userId}"`);

            if (relError) {
                console.error('Arkadaşlık verileri alınamadı:', relError.message);
                return [];
            }

            if (!relations || relations.length === 0) {
                console.log('Hiç arkadaşlık kaydı yok.');
                return [];
            }

            const friendIds = [];

            relations.forEach(f => {
                const idOne = f.id_one.trim().toLowerCase();
                const idTwo = f.id_two.trim().toLowerCase();
                const myId = userId.trim().toLowerCase();

                if (idOne === myId) {
                    friendIds.push(f.id_two);
                } else if (idTwo === myId) {
                    friendIds.push(f.id_one);
                } else {
                    console.warn('Eşleşmeyen kayıt:', f);
                }
            });

            if (friendIds.length === 0) {
                console.warn('Hiç geçerli arkadaş ID’si bulunamadı.');
                return [];
            }

            console.log('Arkadaş ID’leri:', friendIds);

            const { data: friendsData, error: userError } = await this.supabase
                .from('users')
                .select('*')
                .in('id', friendIds);

            if (userError) {
                console.error('Arkadaş bilgileri alınamadı:', userError.message);
                return [];
            }

            console.log('Arkadaş bilgileri:', friendsData);
            return friendsData;
        } catch (err) {
            console.error('getFriends beklenmeyen hata:', err);
            return [];
        }
    }

    async getMessages(currentUserId, friendId) {
        try {
            const { data, error } = await this.supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${currentUserId})`)
                .order('sent_at', { ascending: true });

            if (error) {
                console.error("Mesajlar alınamadı:", error.message);
                return [];
            }

            return data;
        } catch (err) {
            console.error("Beklenmeyen hata (getMessages):", err);
            return [];
        }
    }

    async getUserById(userId) {
        if (!userId) {
            console.error("getUserById: userId eksik!");
            return null;
        }

        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single(); // sadece tek bir kullanıcı bekliyoruz

        if (error) {
            console.error('Kullanıcı alınamadı:', error.message);
            return null;
        }

        return data;
    }
}
