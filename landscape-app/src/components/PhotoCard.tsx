'use client';

import { Photo } from '@/types';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { useState, useEffect } from 'react';
import LazyImage from './LazyImage';

interface PhotoCardProps {
  photo: Photo;
  onClick?: () => void;
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const user = storage.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      const favorites = storage.getUserFavorites(user.id);
      setIsFavorited(favorites.includes(photo.id));
    }
  }, [photo.id]);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/photo/${photo.id}`);
    }
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/user/${photo.userId}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const newFavorited = storage.toggleFavorite(currentUser.id, photo.id);
    setIsFavorited(newFavorited);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div 
      className="bg-healing-card rounded-xl shadow-healing hover:shadow-healing-hover transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <LazyImage
          src={photo.imageUrl}
          alt={photo.title}
          width={400}
          height={300}
          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
        >
          <svg 
            className={`w-5 h-5 ${isFavorited ? 'text-healing-accent fill-current' : 'text-healing-muted'}`}
            fill={isFavorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-healing-primary mb-2 line-clamp-2">
          {photo.title}
        </h3>

        {/* Location */}
        {photo.location && (
          <div className="flex items-center text-sm text-healing-secondary mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{photo.location}</span>
          </div>
        )}

        {/* User info */}
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 text-sm text-healing-secondary hover:text-healing-accent transition-colors"
            onClick={handleUserClick}
          >
            {photo.userAvatar ? (
              <LazyImage
                src={photo.userAvatar}
                alt={photo.userName}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-healing-accent rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {photo.userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="truncate">{photo.userName}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-sm text-healing-muted">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{photo.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{photo.comments.length}</span>
            </div>
          </div>
        </div>

        {/* Upload time */}
        <div className="text-xs text-healing-muted mt-2">
          {formatDate(photo.uploadTime)}
        </div>
      </div>
    </div>
  );
}