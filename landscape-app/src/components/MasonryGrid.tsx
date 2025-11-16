'use client';

import Masonry from 'react-masonry-css';
import { Photo } from '@/types';
import PhotoCard from './PhotoCard';

interface MasonryGridProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
}

export default function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {photos.map((photo) => (
        <div key={photo.id} className="mb-4">
          <PhotoCard 
            photo={photo} 
            onClick={() => onPhotoClick?.(photo)}
          />
        </div>
      ))}
    </Masonry>
  );
}