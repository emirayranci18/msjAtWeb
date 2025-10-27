// Database.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

export class Database {
    constructor() {
        this.supabase = createClient(
            'https://jncqzwnqutwhuvkekrig.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuY3F6d25xdXR3aHV2a2VrcmlnIiwicm9sZSI6ImF0IiwiaWF0IjoxNzYwNDU0ODUyLCJleHAiOjIwNzYwMzA4NTJ9.-tI6UgIjJ6Yg8oHDuyhDa4AmerI1c3BAzxzy_1g9Txs'
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
        const { data, error } = await this.supabase
            .from('friends')
            .select('*')
            .eq('user_id', userId);
        return error ? [] : data;
    }

    async getMessages(contactId) {
        const { data, error } = await this.supabase
            .from('messages')
            .select('*')
            .eq('contact_id', contactId)
            .order('created_at', { ascending: true });
        return error ? [] : data;
    }
}
