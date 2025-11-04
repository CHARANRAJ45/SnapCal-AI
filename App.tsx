
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// Fix: The useAuth hook is exported from './hooks/useAuth', not from './context/AuthContext'. This change corrects the import path.
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import AuthPage from './pages/AuthPage';
import GoalPage from './pages/GoalPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import Header from './components/common/Header';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {user && <Header />}
      <main className="p-4 md:p-8 max-w-4xl mx-auto">
        <Routes>
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/goal" element={user ? <GoalPage /> : <Navigate to="/auth" />} />
          <Route path="/history" element={user ? <HistoryPage /> : <Navigate to="/auth" />} />
          <Route path="/" element={user ? (user.goal ? <DashboardPage /> : <Navigate to="/goal" />) : <Navigate to="/auth" />} />
        </Routes>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
