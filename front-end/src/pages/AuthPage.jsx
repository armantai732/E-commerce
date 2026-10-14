import React, { useState } from 'react';
import { Store, Tag, Zap, Package, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import ForgotPasswordPage from './ForgotPasswordPage';
import { loginData, registerData } from '../api/api';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate();

    // Form State
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            const res = await loginData(form);

            if (res.status) {
                alert(res.message);
                localStorage.setItem("token", res.token);
                const role = res.role
                if (role === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/");
                }
                setForm({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    rememberMe: false,
                });
            } else {
                alert(res.message);
            }
        } else {
            const res = await registerData(form);

            if (res.status) {
                alert(res.message);
                setIsLogin(true);

                setForm({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
            } else {
                alert(res.message);
            }
        }
    };

    if (showForgotPassword) {
        return <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />;
    }

    return (
        <div className="w-full min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 sm:p-6 font-sans">

            {/* Side-by-Side Main Luxury Container */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden grid grid-cols-12 border border-stone-200/80 min-h-[600px]">

                {/* LEFT COLUMN: Luxury Dark Banner */}
                <div className="col-span-5 bg-stone-900 relative flex flex-col justify-between p-6 sm:p-10 text-white overflow-hidden">

                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
                        alt="Shop Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-25"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-stone-900/90" />

                    {/* Top Logo */}
                    <div className="relative z-10 flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-[#FAF3EA]/20 border border-[#FAF3EA]/30 flex items-center justify-center text-amber-200 shrink-0 backdrop-blur-md">
                            <Store size={18} />
                        </div>
                        <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                            ShopNest
                        </span>
                    </div>

                    {/* Middle Content */}
                    <div className="relative z-10 my-auto py-6 space-y-6">
                        <div className="space-y-2">
                            <span className="bg-[#FAF3EA]/20 border border-[#FAF3EA]/30 text-amber-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1 backdrop-blur-md">
                                <Sparkles size={11} /> Exclusive Access
                            </span>
                            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                                {isLogin ? 'Welcome Back' : 'Join The Boutique'}
                            </h2>
                            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-medium">
                                {isLogin
                                    ? 'Access your saved wishlist, track orders, and experience seamless luxury shopping.'
                                    : 'Create your account to unlock curated collections and personalized experiences.'}
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3.5 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-amber-300">
                                    <Tag size={15} />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-stone-200">
                                    Curated luxury collections
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-amber-300">
                                    <Zap size={15} />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-stone-200">
                                    Express & insured shipping
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-amber-300">
                                    <Package size={15} />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-stone-200">
                                    Real-time order tracking
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright */}
                    <div className="relative z-10 text-[10px] text-stone-400 font-medium">
                        © {new Date().getFullYear()} ShopNest. All rights reserved.
                    </div>
                </div>

                {/* RIGHT COLUMN: Login / Register Form */}
                <div className="col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">

                    {/* Tabs Header */}
                    <div className="flex border-b border-stone-100 mb-6">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 text-center pb-3 text-xs sm:text-sm font-black transition-all tracking-wider uppercase ${isLogin
                                ? 'text-stone-900 border-b-2 border-[#966F33]'
                                : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 text-center pb-3 text-xs sm:text-sm font-black transition-all tracking-wider uppercase ${!isLogin
                                ? 'text-stone-900 border-b-2 border-[#966F33]'
                                : 'text-stone-400 hover:text-stone-600'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-stone-700 block">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white transition-colors"
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-stone-700 block">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={form.email}
                                onChange={handleInputChange}
                                required
                                className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-stone-700 block">
                                    Password
                                </label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(true)}
                                        className="text-xs font-bold text-[#966F33] hover:text-stone-900 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full text-xs sm:text-sm font-semibold p-3.5 pr-10 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-stone-700 block">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    value={form.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full text-xs sm:text-sm font-semibold p-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-stone-900 bg-white transition-colors"
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="rememberMe"
                                    checked={form.rememberMe}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-stone-900 focus:ring-stone-900 border-stone-300 rounded cursor-pointer"
                                />
                                <label
                                    htmlFor="rememberMe"
                                    className="text-xs font-bold text-stone-700 cursor-pointer select-none"
                                >
                                    Remember me on this device
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-stone-900 hover:bg-black text-amber-200 font-extrabold py-4 rounded-2xl text-xs sm:text-sm tracking-widest uppercase transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                        >
                            <span>{isLogin ? 'Login to Account' : 'Create Account'}</span>
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* Social Separator */}
                    <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-100" />
                        </div>
                        <span className="relative z-10 bg-white px-3 text-[11px] font-extrabold text-stone-400 uppercase tracking-widest">
                            Or continue with
                        </span>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-stone-200 hover:border-stone-300 text-xs font-extrabold text-stone-700 bg-white hover:bg-stone-50 transition-all shadow-sm"
                        >
                            <FaGoogle className="text-red-500 text-sm" />
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-stone-200 hover:border-stone-300 text-xs font-extrabold text-stone-700 bg-white hover:bg-stone-50 transition-all shadow-sm"
                        >
                            <FaFacebookF className="text-blue-600 text-sm" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    {/* Switch Link */}
                    <p className="text-center text-xs text-stone-500 font-medium mt-6">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-black text-stone-900 underline hover:text-[#966F33] transition-colors"
                        >
                            {isLogin ? 'Register now' : 'Login here'}
                        </button>
                    </p>

                </div>

            </div>
        </div>
    );
};

export default AuthPage;