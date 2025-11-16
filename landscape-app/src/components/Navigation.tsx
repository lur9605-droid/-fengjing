'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import LazyImage from './LazyImage';

export default function Navigation() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="bg-healing-card shadow-healing border-b border-healing-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-healing-primary">风景探索</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-healing-secondary hover:text-healing-accent transition-colors">
                首页
              </Link>
              <Link href="/upload" className="text-healing-secondary hover:text-healing-accent transition-colors">
                上传
              </Link>
              <Link href="/search" className="text-healing-secondary hover:text-healing-accent transition-colors">
                搜索
              </Link>
              <Link href="/favorites" className="text-healing-secondary hover:text-healing-accent transition-colors">
                我的收藏
              </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link href={`/user/${currentUser.id}`} className="flex items-center space-x-2 text-healing-secondary hover:text-healing-accent transition-colors">
                  {currentUser.avatar ? (
                    <LazyImage
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-healing-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span>{currentUser.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-healing-secondary hover:text-red-600 transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-healing-primary">
                登录
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-healing-secondary hover:text-healing-primary focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-healing-light">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-healing-secondary hover:text-healing-accent transition-colors">
                首页
              </Link>
              <Link href="/upload" className="block px-3 py-2 text-healing-secondary hover:text-healing-accent transition-colors">
                上传
              </Link>
              <Link href="/search" className="block px-3 py-2 text-healing-secondary hover:text-healing-accent transition-colors">
                搜索
              </Link>
              <Link href="/favorites" className="block px-3 py-2 text-healing-secondary hover:text-healing-accent transition-colors">
                我的收藏
              </Link>
              
              {currentUser ? (
                <>
                  <Link href={`/user/${currentUser.id}`} className="block px-3 py-2 text-healing-secondary hover:text-healing-accent transition-colors">
                    个人主页
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-healing-secondary hover:text-red-600 transition-colors"
                  >
                    退出
                  </button>
                </>
              ) : (
                <Link href="/login" className="block px-3 py-2 text-healing-accent hover:text-[var(--color-primary-600)] transition-colors">
                  登录
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}