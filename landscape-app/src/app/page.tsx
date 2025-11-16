'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import { storage } from '@/lib/storage';
import { Photo } from '@/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'time' | 'popular'>('time');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    filterAndSortPhotos();
  }, [photos, searchTerm, sortBy]);

  const loadPhotos = () => {
    let allPhotos = storage.getPhotos();
    
    // 清理可能包含blob URL的照片数据
    const cleanedPhotos = allPhotos.filter(photo => {
      // 检查并清理可能包含blob URL的图片地址
      if (photo.imageUrl && photo.imageUrl.includes('blob:')) {
        console.warn('发现包含blob URL的照片，将被过滤:', photo.id, photo.imageUrl);
        return false; // 过滤掉包含blob URL的照片
      }
      if (photo.userAvatar && photo.userAvatar.includes('blob:')) {
        console.warn('发现包含blob URL的用户头像，将被清理:', photo.id);
        photo.userAvatar = ''; // 清理用户头像中的blob URL
      }
      return true;
    });
    
    // 如果有照片被清理，更新存储
    if (cleanedPhotos.length !== allPhotos.length) {
      console.log(`清理了 ${allPhotos.length - cleanedPhotos.length} 个包含blob URL的照片`);
      storage.savePhotos(cleanedPhotos);
    }
    
    setPhotos(cleanedPhotos);
    setLoading(false);
  };

  const filterAndSortPhotos = () => {
    let filtered = photos;

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(photo => 
        photo.title.toLowerCase().includes(term) ||
        photo.location.toLowerCase().includes(term) ||
        photo.description?.toLowerCase().includes(term)
      );
    }

    // Sort photos
    if (sortBy === 'popular') {
      filtered = filtered.sort((a, b) => b.likes - a.likes);
    } else {
      filtered = filtered.sort((a, b) => 
        new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()
      );
    }

    setFilteredPhotos(filtered);
  };

  const handlePhotoClick = (photo: Photo) => {
    router.push(`/photo/${photo.id}`);
  };

  return (
    <div className="min-h-screen bg-healing-soft">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-healing-warm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-warm mb-4">
            探索美丽的风景
          </h1>
          <p className="text-xl text-healing-muted mb-8 max-w-2xl mx-auto">
            分享你镜头下的自然之美，发现世界各地的精彩风景
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索地点或标题..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    router.push(`/search?q=${encodeURIComponent(searchTerm)}&type=title`);
                  }
                }}
                className="w-full px-6 py-4 text-lg border-2 border-healing-light rounded-full focus:outline-none focus:border-[var(--border-focus)] transition-colors input-healing"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-gradient-warm">
              风景照片
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSortBy('time')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'time' 
                    ? 'btn-healing-primary' 
                    : 'btn-healing-secondary'
                }`}
              >
                最新上传
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === 'popular' 
                    ? 'btn-healing-primary' 
                    : 'btn-healing-secondary'
                }`}
              >
                最受欢迎
              </button>
            </div>
            <div className="text-healing-muted ml-auto">
              共找到 {filteredPhotos.length} 张照片
            </div>
          </div>
      </div>

      {/* Photos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-500)]"></div>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-12 w-12 text-healing-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-healing-primary">暂无照片</h3>
            <p className="mt-1 text-sm text-healing-muted">
              {searchTerm ? '没有找到匹配的照片' : '还没有人上传照片，成为第一个吧！'}
            </p>
            <div className="mt-6">
              <a
                href="/upload"
                className="btn-healing-primary inline-flex items-center px-4 py-2 text-sm font-medium"
              >
                上传照片
              </a>
            </div>
          </div>
        ) : (
          <MasonryGrid photos={filteredPhotos} onPhotoClick={handlePhotoClick} />
        )}
      </div>
    </div>
  );
}
