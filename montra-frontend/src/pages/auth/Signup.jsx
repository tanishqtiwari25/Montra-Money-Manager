import React from 'react';

export const Signup = () => {
  return (
    // Outer Container ko Center kiya hai
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4">
      
      {/* Form Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-center text-emerald-500">MONTRA</h1>
        <p className="text-sm text-center text-slate-400 mt-1 mb-6">
          Create a new organizational account
        </p>

        {/* Dynamic Signup Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Tenant Slug <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="org-name"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Username <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="username"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Role <span className="text-rose-500">*</span>
            </label>
            <select className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-emerald-500">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Already registered?{' '}
          <a href="/login" className="text-emerald-500 hover:underline">
            Log in
          </a>
        </p>
      </div>

    </div>
  );
};

export default Signup;