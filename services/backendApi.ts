const API_URL = (import.meta && (import.meta.env && (import.meta.env.VITE_API_URL as string))) || 'http://localhost:4000';

export const request = async (path: string, opts: RequestInit = {}) => {
	const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any || {}) };
	const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
	if (!res.ok) {
		const txt = await res.text();
		let parsed: any = null;
		try { parsed = JSON.parse(txt); } catch(e) { parsed = null; }
		const errmsg = (parsed && typeof parsed === 'object' && 'error' in parsed) ? parsed.error : res.statusText || 'Request failed';
		throw new Error(errmsg as string);
	}
	return res.json();
};

export default API_URL;

