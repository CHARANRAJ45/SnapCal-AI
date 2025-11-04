import { User, Goal, FoodLog } from '../types';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:4000';

const TOKEN_KEY = 'snapcal_token';

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t: string | null) => {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
};

const request = async (path: string, opts: RequestInit = {}) => {
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}${path}`, { ...opts, headers, credentials: 'include' });
        if (!res.ok) {
            const txt = await res.text();
            let parsed: any = null;
            try { parsed = JSON.parse(txt); } catch(e) { parsed = null; }
            const errmsg = (parsed && typeof parsed === 'object' && 'error' in parsed) ? parsed.error : res.statusText || 'Request failed';
            throw new Error(errmsg as string);
        }
    return res.json();
};

export const mockApi = {
    register: async (email: string, password: string): Promise<User> => {
        const body = JSON.stringify({ email, password });
        const data = await request('/api/register', { method: 'POST', body });
        if (data.token) setToken(data.token);
        return data.user as User;
    },

    login: async (email: string, password: string): Promise<User> => {
        const body = JSON.stringify({ email, password });
        const data = await request('/api/login', { method: 'POST', body });
        if (data.token) setToken(data.token);
        return data.user as User;
    },

    logout: async (): Promise<void> => {
        try {
            await request('/api/logout', { method: 'POST' });
        } finally {
            setToken(null);
        }
    },

    getCurrentUser: async (): Promise<User | null> => {
        const data = await request('/api/current', { method: 'GET' });
        return data.user as User | null;
    },

    setGoal: async (userId: string, goal: Goal): Promise<User> => {
        const body = JSON.stringify({ goal });
        const data = await request('/api/goal', { method: 'POST', body });
        return data.user as User;
    },

    getFoodLogs: async (userId: string): Promise<FoodLog[]> => {
        const data = await request('/api/foodlogs', { method: 'GET' });
        return data.logs as FoodLog[];
    },

    addFoodLog: async (userId: string, logData: Omit<FoodLog, 'id' | 'userId' | 'createdAt'>): Promise<FoodLog> => {
        const body = JSON.stringify(logData);
        const data = await request('/api/foodlogs', { method: 'POST', body });
        return data.log as FoodLog;
    }
};