'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import { storage } from '@/lib/storage';
import { Photo } from '@/types';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Photo[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    loadFavorites();
  }, [router]);

  const loadFavorites = () => {
    const favoriteIds = storage.getFavorites();
    const allPhotos = storage.getPhotos();
    const favoritePhotos = allPhotos.filter(photo => favoriteIds.includes(photo.id));
    setFavorites(favoritePhotos);
    setLoading(false);
  };

  const handlePhotoClick = (photo: Photo) => {
    router.push(`/photo/${photo.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">我的收藏</h1>
          <p className="text-gray-600">收藏了 {favorites.length} 张照片</p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">还没有收藏任何照片</h3>
              <p className="mt-1 text-sm text-gray-500">浏览照片并收藏你喜欢的风景</p>
              <div className="mt-6">
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  浏览照片
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8">
            <MasonryGrid photos={favorites} onPhotoClick={handlePhotoClick} />
          </div>
        )}
      </div>
    </div>
  );
}