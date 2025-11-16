'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { storage } from '@/lib/storage';
import { Photo, Comment } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function PhotoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const photoId = params?.id as string;
  
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhoto();
    const user = storage.getCurrentUser();
    setCurrentUser(user);
  }, [photoId]);

  const loadPhoto = () => {
    const foundPhoto = storage.getPhotoById(photoId);
    if (foundPhoto) {
      setPhoto(foundPhoto);
      
      // Check if current user liked this photo
      const user = storage.getCurrentUser();
      if (user) {
        setIsLiked(foundPhoto.likedBy.includes(user.id));
        const favorites = storage.getUserFavorites(user.id);
        setIsFavorited(favorites.includes(photoId));
      }
    } else {
      // Photo not found
      router.push('/');
    }
    setLoading(false);
  };

  const handleLike = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const result = storage.toggleLike(photoId, currentUser.id);
    setIsLiked(result.liked);
    
    // Update local photo state
    if (photo) {
      setPhoto({
        ...photo,
        likes: result.likes,
        likedBy: result.liked ? [...photo.likedBy, currentUser.id] : photo.likedBy.filter(id => id !== currentUser.id)
      });
    }
  };

  const handleFavorite = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const newFavorited = storage.toggleFavorite(currentUser.id, photoId);
    setIsFavorited(newFavorited);
  };

  const handleComment = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: uuidv4(),
      userId: currentUser.id,
      userName: currentUser.username,
      userAvatar: currentUser.avatar,
      content: commentText.trim(),
      timestamp: new Date().toISOString()
    };

    storage.addComment(photoId, newComment);
    
    // Update local photo state
    if (photo) {
      setPhoto({
        ...photo,
        comments: [newComment, ...photo.comments]
      });
    }
    
    setCommentText('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!photo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">照片不存在</h1>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img 
                src={photo.imageUrl} 
                alt={photo.title}
                className="w-full h-auto max-h-screen object-contain"
              />
            </div>
            
            {/* Photo Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">{photo.title}</h1>
              
              {photo.description && (
                <p className="text-gray-600 mb-4">{photo.description}</p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{photo.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatDate(photo.uploadTime)}</span>
                </div>
              </div>

              {/* Tags */}
              {photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {photo.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{photo.likes}</span>
                </button>
                
                <button
                  onClick={handleFavorite}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isFavorited 
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>{isFavorited ? '已收藏' : '收藏'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">上传者</h3>
              <div className="flex items-center space-x-3 mb-3">
                {photo.userAvatar ? (
                  <img src={photo.userAvatar} alt={photo.userName} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {photo.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800">{photo.userName}</p>
                  <button
                    onClick={() => router.push(`/user/${photo.userId}`)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    查看主页
                  </button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                评论 ({photo.comments.length})
              </h3>
              
              {/* Comment Form */}
              <div className="mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  发表评论
                </button>
              </div>
              
              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {photo.comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">还没有评论，成为第一个评论的人吧！</p>
                ) : (
                  photo.comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center space-x-3 mb-2">
                        {comment.userAvatar ? (
                          <img src={comment.userAvatar} alt={comment.userName} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {comment.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{comment.userName}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.timestamp)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-11">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}