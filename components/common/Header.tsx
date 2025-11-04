
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from './Button';

const Header: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    const linkStyle = "text-gray-600 hover:text-green-600 transition-colors duration-200";
    const activeLinkStyle = { color: '#16a34a', fontWeight: '600' };

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm mb-6">
            <nav className="max-w-4xl mx-auto flex justify-between items-center p-4">
                <NavLink to="/" className="text-xl font-bold text-green-600">
                    Snapcal AI
                </NavLink>
                <div className="flex items-center space-x-6">
                    <NavLink
                        to="/"
                        className={linkStyle}
                        style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/history"
                        className={linkStyle}
                        style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                    >
                        History
                    </NavLink>
                    <Button onClick={handleLogout} variant="secondary" size="small">
                        Logout
                    </Button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
