'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const user = storage.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => 
      file.type === 'image/jpeg' || 
      file.type === 'image/png' || 
      file.type === 'image/webp'
    );

    if (validFiles.length !== acceptedFiles.length) {
      alert('只支持 JPG、PNG 和 WebP 格式的图片');
    }

    setFiles(validFiles);
    
    // Create preview URLs using base64
    const urls = await Promise.all(validFiles.map(file => fileToBase64(file)));
    setPreviewUrls(urls);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!currentUser) {
      alert('请先登录');
      router.push('/login');
      return;
    }

    if (files.length === 0) {
      alert('请选择图片');
      return;
    }

    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    if (!location.trim()) {
      alert('请输入地点');
      return;
    }

    setUploading(true);

    try {
      // 将图片文件转换为base64格式进行持久化存储
      const file = files[0];
      const base64Image = await fileToBase64(file);
      
      const newPhoto = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim(),
        imageUrl: base64Image,
        userId: currentUser.id,
        userName: currentUser.username,
        userAvatar: currentUser.avatar,
        uploadTime: new Date().toISOString(),
        likes: 0,
        likedBy: [],
        comments: [],
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      storage.addPhoto(newPhoto);
      
      // Update user upload count
      const updatedUser = {
        ...currentUser,
        uploadCount: currentUser.uploadCount + 1
      };
      storage.updateUser(currentUser.id, updatedUser);



      // Redirect to photo detail page
      router.push(`/photo/${newPhoto.id}`);
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 辅助函数：将文件转换为base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-healing-soft">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-healing-card rounded-xl shadow-healing p-8">
          <h1 className="text-3xl font-bold text-healing-primary mb-8 text-center">
            上传风景照片
          </h1>

          {/* Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-healing-secondary mb-2">
              选择图片
            </label>
            
            {files.length === 0 ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-[var(--border-focus)] bg-[var(--color-primary-50)]' 
                    : 'border-healing-medium hover:border-[var(--border-focus)] hover:bg-healing-warm'
                }`}
              >
                <input {...getInputProps()} />
                <svg className="mx-auto h-12 w-12 text-healing-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg text-healing-secondary mb-2">
                  {isDragActive ? '松开以上传文件' : '拖拽图片到这里，或点击选择'}
                </p>
                <p className="text-sm text-healing-muted">
                  支持 JPG、PNG、WebP 格式
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={previewUrls[index]} 
                      alt={`预览 ${index + 1}`}
                      className="w-full max-h-96 object-contain rounded-xl"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-2 bg-healing-error text-white rounded-full hover:bg-[var(--color-error-600)] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setFiles([]);
                    setPreviewUrls([]);
                  }}
                  className="text-healing-accent hover:text-[var(--color-primary-600)] text-sm"
                >
                  重新选择
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-healing-secondary mb-2">
                标题 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                placeholder="给你的照片起个标题"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-healing-secondary mb-2">
                拍摄地点 *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                placeholder="例如：杭州西湖"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-healing-secondary mb-2">
                描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent resize-none input-healing"
                placeholder="描述一下这张照片的故事..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-healing-secondary mb-2">
                标签
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border border-healing-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent input-healing"
                placeholder="用逗号分隔标签，例如：日出, 山峦, 云海"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 text-healing-secondary hover:text-healing-primary transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="px-8 py-3 btn-healing-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {uploading && (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{uploading ? '上传中...' : '发布照片'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}