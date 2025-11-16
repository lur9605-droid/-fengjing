'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder = 'blur',
  blurDataURL = 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAAcAAAAAQAAABAAQUxQSC0AAAABJ0Cg3l8AZrg3gD8A/n8A/39gAAAAAA==',
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(blurDataURL);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setImageSrc('/placeholder-image.jpg');
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`lazy-image ${isLoaded ? 'loaded' : ''} w-full h-full object-cover`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {!isLoaded && (
        <div className="absolute inset-0 skeleton animate-pulse" />
      )}
    </div>
  );
}