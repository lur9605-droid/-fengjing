'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MobileNavigation() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在移动端显示
    const checkMobile = () => {
      setIsVisible(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { name: '首页', href: '/', icon: '🏠' },
    { name: '上传', href: '/upload', icon: '📸' },
    { name: '搜索', href: '/search', icon: '🔍' },
    { name: '收藏', href: '/favorites', icon: '❤️' },
  ];

  if (!isVisible) return null;

  return (
    <div className="mobile-nav">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item touch-target ${isActive ? 'active' : ''}`}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}