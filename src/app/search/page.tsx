'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import MasonryGrid from '@/components/MasonryGrid';
import { storage } from '@/lib/storage';
import { Photo } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'location'>('title');
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    const type = searchParams.get('type') as 'title' | 'location';
    
    if (query) {
      setSearchTerm(query);
      setSearchType(type || 'title');
      performSearch(query, type || 'title');
    }
  }, [searchParams]);

  const performSearch = (term: string, type: 'title' | 'location') => {
    if (!term.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // 使用 setTimeout 模拟搜索延迟
    setTimeout(() => {
      const allPhotos = storage.getPhotos();
      const results = allPhotos.filter(photo => {
        const searchField = type === 'title' ? photo.title : photo.location;
        return searchField.toLowerCase().includes(term.toLowerCase());
      });
      
      setSearchResults(results);
      setLoading(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 更新URL参数
      const params = new URLSearchParams();
      params.set('q', searchTerm);
      params.set('type', searchType);
      router.push(`/search?${params.toString()}`);
      
      performSearch(searchTerm, searchType);
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    router.push(`/photo/${photo.id}`);
  };

  return (
    <div className="min-h-screen bg-healing-soft">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-healing-primary mb-2">搜索照片</h1>
          <p className="text-healing-muted">按标题或地点搜索风景照片</p>
        </div>

        {/* Search Form */}
        <div className="bg-healing-card rounded-xl shadow-healing p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="输入搜索关键词..."
                className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={searchType}
                onChange={(e) => setSearchType(e.target.value as 'title' | 'location')}
                className="px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                >
                  <option value="title">按标题</option>
                  <option value="location">按地点</option>
                </select>
                <button
                  type="submit"
                disabled={loading}
                className="btn-healing-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '搜索中...' : '搜索'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="bg-healing-card rounded-xl shadow-healing p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-healing-primary">
                {loading ? '搜索中...' : `找到 ${searchResults.length} 张照片`}
              </h2>
              {!loading && searchTerm && (
                <p className="text-healing-muted mt-1">
                  搜索关键词: "{searchTerm}" ({searchType === 'title' ? '按标题' : '按地点'})
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary-500)]"></div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-healing-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-healing-primary">没有找到相关照片</h3>
                <p className="mt-1 text-sm text-healing-muted">试试其他关键词或搜索类型</p>
              </div>
            ) : (
              <MasonryGrid photos={searchResults} onPhotoClick={handlePhotoClick} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}