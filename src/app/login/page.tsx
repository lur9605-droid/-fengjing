'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSocialLogin = (provider: string) => {
    // 模拟社交媒体登录
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      // 创建模拟用户
      const socialUser = {
        id: uuidv4(),
        username: `${provider}用户`,
        email: `demo@${provider.toLowerCase()}.com`,
        avatar: '',
        bio: `通过${provider}登录`,
        uploadCount: 0,
        favorites: [],
        createdAt: new Date().toISOString()
      };
      
      storage.addUser(socialUser);
      storage.setCurrentUser(socialUser);
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const user = storage.getUserByEmail(email);
        if (!user) {
          setError('用户不存在');
          return;
        }
        
        // In a real app, you would verify the password here
        // For demo purposes, we'll just log them in
        storage.setCurrentUser(user);
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        // Register
        if (password !== confirmPassword) {
          setError('两次输入的密码不一致');
          return;
        }

        if (username.length < 2) {
          setError('用户名至少需要2个字符');
          return;
        }

        if (password.length < 6) {
          setError('密码至少需要6个字符');
          return;
        }

        // Check if email already exists
        const existingUser = storage.getUserByEmail(email);
        if (existingUser) {
          setError('该邮箱已被注册');
          return;
        }

        const newUser = {
          id: uuidv4(),
          username: username.trim(),
          email: email.trim(),
          avatar: '',
          bio: '',
          uploadCount: 0,
          favorites: [],
          createdAt: new Date().toISOString()
        };

        storage.addUser(newUser);
        storage.setCurrentUser(newUser);
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err) {
      setError(isLogin ? '登录失败' : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-healing-soft">
      <Navigation />
      
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-healing-card rounded-xl shadow-healing p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-healing-accent/10 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-healing-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-healing-primary mb-2">
              {isLogin ? '登录' : '注册'}
            </h1>
            <p className="text-healing-muted">
              {isLogin ? '欢迎回来！' : '创建新账户'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-lg">
              <p className="text-[var(--color-error-600)] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-healing-secondary mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-healing-secondary mb-2">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                placeholder="请输入邮箱地址"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-healing-secondary mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                placeholder="请输入密码"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-healing-secondary mb-2">
                  确认密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                  placeholder="请再次输入密码"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 btn-healing-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{isLogin ? '登录中...' : '注册中...'}</span>
                </div>
              ) : (
                <span>{isLogin ? '登录' : '注册'}</span>
              )}
            </button>
          </form>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-lg">
              <p className="text-[var(--color-success-600)] text-sm font-medium">✅ 登录成功！正在跳转...</p>
            </div>
          )}

          {/* Social Login Options */}
          {isLogin && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-healing-light"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-healing-card text-healing-muted">或者使用以下方式登录</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="w-full py-2 px-4 text-sm text-healing-accent hover:text-[var(--color-primary-600)] font-medium transition-colors"
                >
                  使用 Google 账号登录
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Twitter')}
                  className="w-full py-2 px-4 text-sm text-healing-accent hover:text-[var(--color-primary-600)] font-medium transition-colors"
                >
                  使用 Twitter 账号登录
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Pinterest')}
                  className="w-full py-2 px-4 text-sm text-healing-accent hover:text-[var(--color-primary-600)] font-medium transition-colors"
                >
                  使用 Pinterest 账号登录
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-healing-muted">
              {isLogin ? '还没有账户？' : '已有账户？'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-healing-accent hover:text-[var(--color-primary-600)] font-medium ml-1"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 p-4 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] rounded-lg">
              <p className="text-[var(--color-primary-800)] text-sm font-medium mb-2">测试账户</p>
              <p className="text-[var(--color-primary-700)] text-sm">邮箱: demo@example.com</p>
              <p className="text-[var(--color-primary-700)] text-sm">密码: 123456</p>
              <button
                type="button"
                onClick={() => {
                  setEmail('demo@example.com');
                  setPassword('123456');
                  // 自动提交表单
                  setTimeout(() => {
                    handleSubmit(new Event('submit') as any);
                  }, 100);
                }}
                className="mt-2 text-healing-accent hover:text-[var(--color-primary-600)] text-sm font-medium"
              >
                使用测试账户登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}