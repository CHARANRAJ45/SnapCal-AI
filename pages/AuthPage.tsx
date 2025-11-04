
import React, { useState } from 'react';
import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../hooks/useAuth';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, loading } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (email: string, password: string) => {
        setError(null);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen -mt-16">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Snapcal AI</h1>
                    <p className="mt-2 text-sm text-gray-600">Your AI-Powered Nutrition Partner</p>
                </div>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                <AuthForm
                    onSubmit={handleSubmit}
                    isLogin={isLogin}
                    loading={loading}
                />
                <p className="text-sm text-center text-gray-500">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium text-green-600 hover:text-green-500 ml-1"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
