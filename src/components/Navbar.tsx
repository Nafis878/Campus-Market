import { ShoppingBag, PlusCircle, LogIn, LogOut, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  userName: string | null;
  onLogout: () => void;
}

export default function Navbar({ currentPage, onNavigate, isLoggedIn, userName, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (label: string, page: Page, icon: React.ReactNode) => (
    <button
      onClick={() => { onNavigate(page); setMenuOpen(false); }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        currentPage === page
          ? 'bg-blue-600 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:text-blue-700 transition-colors"
          >
            <ShoppingBag size={24} />
            <span>CampusMarket</span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            {navLink('Browse', 'home', <ShoppingBag size={16} />)}
            {isLoggedIn && navLink('Sell Item', 'add-product', <PlusCircle size={16} />)}
            {!isLoggedIn && (
              <>
                {navLink('Login', 'login', <LogIn size={16} />)}
                {navLink('Register', 'register', <UserPlus size={16} />)}
              </>
            )}
            {isLoggedIn && (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-gray-500 border-l pl-3">Hi, {userName}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-3 pt-1 flex flex-col gap-1 border-t border-gray-100">
            {navLink('Browse', 'home', <ShoppingBag size={16} />)}
            {isLoggedIn && navLink('Sell Item', 'add-product', <PlusCircle size={16} />)}
            {!isLoggedIn && (
              <>
                {navLink('Login', 'login', <LogIn size={16} />)}
                {navLink('Register', 'register', <UserPlus size={16} />)}
              </>
            )}
            {isLoggedIn && (
              <div className="flex flex-col gap-1 border-t border-gray-100 pt-2 mt-1">
                <span className="text-sm text-gray-500 px-3">Logged in as {userName}</span>
                <button
                  onClick={() => { onLogout(); setMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
