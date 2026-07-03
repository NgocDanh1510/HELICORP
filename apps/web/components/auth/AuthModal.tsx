"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Mail, Lock, User, AlertCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "../../lib/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Vui lòng nhập email hợp lệ."),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự.")
});

const registerSchema = z.object({
  name: z.string().min(2, "Tên phải từ 2 ký tự."),
  email: z.string().email("Vui lòng nhập email hợp lệ."),
  password: z.string().min(6, "Mật khẩu phải từ 6 ký tự.")
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthModal() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { isAuthModalOpen, closeAuthModal, login, register, isLoading, error, setError } = useAuthStore();

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignupForm
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  if (!isAuthModalOpen) return null;

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    setError(null);
    resetLoginForm();
    resetSignupForm();
  };

  const onLoginSubmit = async (values: LoginFormValues) => {
    const success = await login(values);
    if (success) {
      resetLoginForm();
    }
  };

  const onSignupSubmit = async (values: RegisterFormValues) => {
    const success = await register(values);
    if (success) {
      resetSignupForm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-950 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-900 dark:hover:text-slate-300"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>

        {/* Modal Header tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => handleTabChange("login")}
            className={`flex-1 py-4 text-center text-sm font-bold border-b-2 transition-colors ${
              activeTab === "login"
                ? "border-aurora text-aurora dark:text-white"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("register")}
            className={`flex-1 py-4 text-center text-sm font-bold border-b-2 transition-colors ${
              activeTab === "register"
                ? "border-aurora text-aurora dark:text-white"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error ? (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="login-email">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    {...registerLogin("email")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none ring-aurora/20 transition-all focus:border-aurora focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-950"
                    placeholder="email@example.com"
                    disabled={isLoading}
                  />
                </div>
                {loginErrors.email ? (
                  <span className="text-[11px] font-semibold text-red-500">{loginErrors.email.message}</span>
                ) : null}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="login-password">Mật khẩu</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    {...registerLogin("password")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none ring-aurora/20 transition-all focus:border-aurora focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-950"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {loginErrors.password ? (
                  <span className="text-[11px] font-semibold text-red-500">{loginErrors.password.message}</span>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-aurora py-3 text-sm font-semibold text-white shadow-lg shadow-aurora/20 transition-all hover:brightness-105 active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="register-name">Họ tên</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    id="register-name"
                    type="text"
                    {...registerSignup("name")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none ring-aurora/20 transition-all focus:border-aurora focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-950"
                    placeholder="Nguyễn Văn A"
                    disabled={isLoading}
                  />
                </div>
                {signupErrors.name ? (
                  <span className="text-[11px] font-semibold text-red-500">{signupErrors.name.message}</span>
                ) : null}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="register-email">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    id="register-email"
                    type="email"
                    {...registerSignup("email")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none ring-aurora/20 transition-all focus:border-aurora focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-950"
                    placeholder="email@example.com"
                    disabled={isLoading}
                  />
                </div>
                {signupErrors.email ? (
                  <span className="text-[11px] font-semibold text-red-500">{signupErrors.email.message}</span>
                ) : null}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="register-password">Mật khẩu</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    id="register-password"
                    type="password"
                    {...registerSignup("password")}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none ring-aurora/20 transition-all focus:border-aurora focus:bg-white focus:ring-4 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-950"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {signupErrors.password ? (
                  <span className="text-[11px] font-semibold text-red-500">{signupErrors.password.message}</span>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-aurora py-3 text-sm font-semibold text-white shadow-lg shadow-aurora/20 transition-all hover:brightness-105 active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
