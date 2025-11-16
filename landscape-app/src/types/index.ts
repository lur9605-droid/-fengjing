export interface Photo {
  id: string;
  title: string;
  description?: string;
  location: string;
  imageUrl: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  uploadTime: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  tags: string[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  uploadCount: number;
  favorites: string[];
  createdAt: string;
}

export interface SearchFilters {
  location?: string;
  keyword?: string;
  sortBy?: 'time' | 'popular';
}