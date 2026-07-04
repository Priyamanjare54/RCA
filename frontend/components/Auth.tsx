
import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User, token: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-filled with requested credentials for easier testing
  const [formData, setFormData] = useState({
    username: 'Aryan',
    password: 'Aryan',
    name: 'Aryan',
    role: 'Admin',
    age: '',
    contact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await api.login({ username: formData.username, password: formData.password });
        onLogin(res.user, res.token);
      } else {
        await api.signup(formData);
        setIsLogin(true);
        alert('Signup successful! Please login.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#252968] relative overflow-hidden p-4">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#f2ad3f] opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400 opacity-5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl border border-white/20 relative z-10 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#f2ad3f] rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-xl transform -rotate-6">🏏</div>
          <h1 className="text-3xl font-black text-white heading-font tracking-tighter uppercase italic">
            Rajendra <span className="text-[#f2ad3f]">Cricket</span>
          </h1>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2 opacity-80">Elite Academy Access</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-200 text-[10px] font-black uppercase p-3 rounded-xl tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#f2ad3f] uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#f2ad3f] transition-all"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#f2ad3f] uppercase tracking-widest ml-1">Academy Role</label>
                <select
                  className="w-full bg-[#1a1d4a] border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#f2ad3f] transition-all"
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Coach">Coach</option>
                  <option value="Admin">Administrator</option>
                  <option value="Student">Student Athlete</option>
                </select>
              </div>
              {formData.role === 'Student' && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#f2ad3f] uppercase tracking-widest ml-1">Age</label>
                    <input
                      type="number"
                      required
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#f2ad3f] transition-all"
                      value={formData.age}
                      onChange={e => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#f2ad3f] uppercase tracking-widest ml-1">Contact</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#f2ad3f] transition-all"
                      value={formData.contact}
                      onChange={e => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="9988..."
                    />
                  </div>
                </div>
              )}
            </>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#f2ad3f] uppercase tracking-widest ml-1">Username</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#f2ad3f] transition-all"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#f2ad3f] uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-[#f2ad3f] transition-all"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f2ad3f] text-[#252968] py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-yellow-500 active:scale-95 transition-all mt-4 flex items-center justify-center space-x-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-[#252968] border-t-transparent animate-spin rounded-full"></div> : null}
            <span>{isLogin ? 'Enter Academy' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-200 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
          >
            {isLogin ? "Need an account? Sign Up" : "Already registered? Login"}
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-center w-full">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">RCA Performance Suite v2.1 • Local Mode Enabled</p>
      </div>
    </div>
  );
};

export default Auth;
