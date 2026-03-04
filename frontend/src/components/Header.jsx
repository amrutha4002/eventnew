import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <h1 className="text-xl font-black tracking-tight text-gray-900">EventFinder</h1>
        </Link>
        <nav className="flex space-x-3 sm:space-x-6 items-center">
          <Link to="/" className="text-gray-500 hover:text-indigo-600 font-semibold transition text-sm sm:text-base hidden sm:block">Explore</Link>
          <Link to="/events" className="text-gray-500 hover:text-indigo-600 font-semibold transition text-sm sm:text-base hidden sm:block">All Events</Link>
          
          {user ? (
            <>
              {user.role === 'organizer' && user.isVerified && (
                <Link to="/create-event" className="text-gray-500 hover:text-indigo-600 font-semibold transition text-sm sm:text-base hidden sm:block">Create Event</Link>
              )}
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'organizer' ? '/organizer' : '/dashboard'} className="text-gray-500 hover:text-indigo-600 font-semibold transition text-sm sm:text-base hidden sm:block">Dashboard</Link>
              {user.role === 'user' && (
                <Link to="/organizer-request" className="text-yellow-600 hover:text-yellow-800 font-semibold transition text-sm sm:text-base hidden sm:block">Become Organizer</Link>
              )}
              <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
              <span className="text-gray-700 font-medium text-sm sm:text-base hidden sm:block">Hi, {user.name || user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} className="text-red-500 font-semibold hover:text-red-600 transition text-sm sm:text-base">Logout</button>
            </>
          ) : (
            <>
              <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 transition text-sm sm:text-base">Log in</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm text-sm sm:text-base hover:shadow focus:ring-4 focus:ring-indigo-100">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
