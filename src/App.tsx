import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddProductPage from './pages/AddProductPage';
import type { Page } from './types';
import type { User } from '@supabase/supabase-js';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = (page: Page) => {
    if (page === 'add-product' && !user) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
  };

  const handleLoginSuccess = () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  };

  const userName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isLoggedIn={!!user}
        userName={userName}
        onLogout={handleLogout}
      />

      <main>
        {currentPage === 'home' && (
          <HomePage isLoggedIn={!!user} onNavigate={handleNavigate} />
        )}
        {currentPage === 'login' && (
          <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        )}
        {currentPage === 'register' && (
          <RegisterPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        )}
        {currentPage === 'add-product' && user && (
          <AddProductPage onNavigate={handleNavigate} userId={user.id} />
        )}
        {currentPage === 'add-product' && !user && (
          <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </div>
  );
}
