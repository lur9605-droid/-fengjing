'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import LazyImage from '@/components/LazyImage';
import MasonryGrid from '@/components/MasonryGrid';
import { storage } from '@/lib/storage';
import { Photo, User } from '@/types';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    const user = storage.getCurrentUser();
    setCurrentUser(user);
  }, [userId]);

  const loadUserData = () => {
    const foundUser = storage.getUserById(userId);
    if (foundUser) {
      setUser(foundUser);
      setEditBio(foundUser.bio || '');
      
      // Load user's photos
      const allPhotos = storage.getPhotos();
      const photos = allPhotos.filter(photo => photo.userId === userId);
      setUserPhotos(photos);
    }
    setLoading(false);
  };

  const handlePhotoClick = (photo: Photo) => {
    router.push(`/photo/${photo.id}`);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    if (user) {
      storage.updateUser(user.id, { bio: editBio });
      setUser({ ...user, bio: editBio });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBio(user?.bio || '');
    setIsEditing(false);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">用户不存在</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.avatar ? (
                <LazyImage src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full" />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.username}</h1>
              
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="介绍一下你自己..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {user.bio ? (
                    <p className="text-gray-600 mb-4">{user.bio}</p>
                  ) : isOwnProfile ? (
                    <p className="text-gray-500 mb-4">还没有个人简介，点击编辑添加</p>
                  ) : (
                    <p className="text-gray-500 mb-4">这个人很懒，什么都没有写...</p>
                  )}
                  
                  {isOwnProfile && (
                    <button
                      onClick={handleEditProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      编辑资料
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">{userPhotos.length}</div>
                <div className="text-sm text-gray-600">照片</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{user.uploadCount}</div>
                <div className="text-sm text-gray-600">上传</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })}
                </div>
                <div className="text-sm text-gray-600">加入时间</div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isOwnProfile ? '我的照片' : `${user.username} 的照片`}
          </h2>
          
          {userPhotos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {isOwnProfile ? '还没有上传照片' : '该用户还没有上传照片'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isOwnProfile ? '分享你的第一张照片吧！' : '期待TA的精彩作品'}
              </p>
              {isOwnProfile && (
                <div className="mt-6">
                  <a
                    href="/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    上传照片
                  </a>
                </div>
              )}
            </div>
          ) : (
            <MasonryGrid photos={userPhotos} onPhotoClick={handlePhotoClick} />
          )}
        </div>
      </div>
    </div>
  );
}