import { Photo, User } from '@/types';

const STORAGE_KEYS = {
  PHOTOS: 'landscape_photos',
  USERS: 'landscape_users',
  CURRENT_USER: 'landscape_current_user',
  FAVORITES: 'landscape_favorites_'
};

export const storage = {
  // Photos
  getPhotos: (): Photo[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    return data ? JSON.parse(data) : [];
  },

  savePhotos: (photos: Photo[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  },

  addPhoto: (photo: Photo): void => {
    const photos = storage.getPhotos();
    photos.unshift(photo);
    storage.savePhotos(photos);
  },

  getPhotoById: (id: string): Photo | undefined => {
    const photos = storage.getPhotos();
    return photos.find(photo => photo.id === id);
  },

  updatePhoto: (id: string, updates: Partial<Photo>): void => {
    const photos = storage.getPhotos();
    const index = photos.findIndex(photo => photo.id === id);
    if (index !== -1) {
      photos[index] = { ...photos[index], ...updates };
      storage.savePhotos(photos);
    }
  },

  // Users
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  saveUsers: (users: User[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  addUser: (user: User): void => {
    const users = storage.getUsers();
    users.push(user);
    storage.saveUsers(users);
  },

  getUserById: (id: string): User | undefined => {
    const users = storage.getUsers();
    return users.find(user => user.id === id);
  },

  getUserByEmail: (email: string): User | undefined => {
    const users = storage.getUsers();
    return users.find(user => user.email === email);
  },

  updateUser: (id: string, updates: Partial<User>): void => {
    const users = storage.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      storage.saveUsers(users);
      
      // Update current user if it's the same user
      const currentUser = storage.getCurrentUser();
      if (currentUser && currentUser.id === id) {
        storage.setCurrentUser({ ...currentUser, ...updates });
      }
    }
  },

  // Favorites
  getUserFavorites: (userId: string): string[] => {
    if (typeof window === 'undefined') return [];
    const key = STORAGE_KEYS.FAVORITES + userId;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  saveUserFavorites: (userId: string, favorites: string[]): void => {
    if (typeof window === 'undefined') return;
    const key = STORAGE_KEYS.FAVORITES + userId;
    localStorage.setItem(key, JSON.stringify(favorites));
  },

  toggleFavorite: (userId: string, photoId: string): boolean => {
    const favorites = storage.getUserFavorites(userId);
    const index = favorites.indexOf(photoId);
    
    if (index === -1) {
      favorites.push(photoId);
      storage.saveUserFavorites(userId, favorites);
      return true;
    } else {
      favorites.splice(index, 1);
      storage.saveUserFavorites(userId, favorites);
      return false;
    }
  },

  // Comments
  addComment: (photoId: string, comment: any): void => {
    const photo = storage.getPhotoById(photoId);
    if (photo) {
      photo.comments.unshift(comment);
      storage.updatePhoto(photoId, { comments: photo.comments });
    }
  },

  // Likes
  toggleLike: (photoId: string, userId: string): { liked: boolean; likes: number } => {
    const photo = storage.getPhotoById(photoId);
    if (!photo) return { liked: false, likes: 0 };

    const likedIndex = photo.likedBy.indexOf(userId);
    
    if (likedIndex === -1) {
      photo.likedBy.push(userId);
      photo.likes += 1;
    } else {
      photo.likedBy.splice(likedIndex, 1);
      photo.likes -= 1;
    }

    storage.updatePhoto(photoId, { 
      likes: photo.likes, 
      likedBy: photo.likedBy 
    });

    return { 
      liked: likedIndex === -1, 
      likes: photo.likes 
    };
  }
};