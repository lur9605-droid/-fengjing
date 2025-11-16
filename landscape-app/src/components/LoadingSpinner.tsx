'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray' | 'white';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="加载中"
      >
        <span className="sr-only">加载中...</span>
      </div>
    </div>
  );
}

// 骨架屏组件
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`skeleton animate-pulse ${className}`} />
  );
}

// 卡片骨架屏
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-3" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

// 详情页骨架屏
export function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <Skeleton className="w-full h-96 rounded-lg mb-6" />
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}