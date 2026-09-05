import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authApi } from '../../services/auth.api.js';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();


  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');


    try {

      const res = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      console.log(
        'Login Response Unwrapped:',
        res
      );


      // =========================
      // TOKEN CHECK
      // =========================

      if (!res || !res.token) {

        setError(
          'Login successful, but token was not returned.'
        );

        return;
      }


      // =========================
      // USER DATA
      // =========================

      const userData = {
        fullName: res.fullName,
        username: res.username,
        role: res.role,
      };


      // =========================
      // AUTH CONTEXT LOGIN
      // =========================

      login(
        userData,
        res.token
      );


      // =========================
      // DASHBOARD
      // =========================

      navigate(
        '/dashboard',
        { replace: true }
      );

    } catch (err) {

      console.error(
        'Login Error:',
        err
      );

      setError(
        err?.message ||
        'Invalid email/username or password.'
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

        <h1 className="text-2xl font-bold text-center text-emerald-500">
          MONTRA
        </h1>

        <p className="text-sm text-center text-slate-400 mt-1 mb-6">
          Log in to your account
        </p>


        {/* Error */}

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email */}

          <div>

            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Email Address / Username{' '}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <input
              type="text"
              name="email"
              placeholder="name@domain.com or username"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />

          </div>


          {/* Password */}

          <div>

            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Password{' '}
              <span className="text-rose-500">
                *
              </span>
            </label>

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />

          </div>


          {/* Login */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold rounded-lg transition-colors mt-2 flex items-center justify-center"
          >
            {loading
              ? 'Logging in...'
              : 'Log In'}
          </button>

        </form>


        {/* Signup */}

        <p className="text-xs text-center text-slate-500 mt-6">

          Don't have an account?{' '}

          <a
            href={`${import.meta.env.BASE_URL}signup`}
            className="text-emerald-500 hover:underline"
          >
            Sign up
          </a>

        </p>

      </div>

    </div>
  );
};

export default Login;