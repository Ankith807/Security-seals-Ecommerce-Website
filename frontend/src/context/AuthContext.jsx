import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('raibex_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Load user profile on startup if token exists
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        
        if (data.success) {
          setUser(data);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Register User
  const register = async (username, email, password, contactNumber, address, role = 'user') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, contactNumber, address, role })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('raibex_token', data.token);
        setToken(data.token);
        setUser(data);
        return { success: true };
      } else {
        setError(data.message || 'Registration failed');
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError(err.message || 'Server error');
      return { success: false, message: 'Server connection failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('raibex_token', data.token);
        setToken(data.token);
        setUser(data);
        return { success: true, role: data.role };
      } else {
        setError(data.message || 'Login failed');
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError(err.message || 'Server error');
      return { success: false, message: 'Server connection failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('raibex_token');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
