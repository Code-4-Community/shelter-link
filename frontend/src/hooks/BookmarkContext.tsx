import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import {
  getEventBookmarks,
  getShelterBookmarks,
  deleteBookmark,
  postBookmark,
} from '../services/userService';
import { UserEventBookmark, UserShelterBookmark } from '../types';

type BookmarkContextType = {
  shelterBookmarks: string[]; // Array of bookmarked shelter IDs
  toggleShelterBookmark: (shelterId: string) => void;

  eventBookmarks: string[]; // Array of bookmarked event IDs
  toggleEventBookmark: (eventId: string) => void;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [shelterBookmarks, setShelterBookmarks] = useState<string[]>([]);
  const [eventBookmarks, setEventBookmarks] = useState<string[]>([]);
  const { user } = useAuth();

  // Load bookmarks using API when the app starts
  useEffect(() => {
    const loadBookmarks = async () => {
      const storedShelterBookmarks = await getShelterBookmarks(user.userId);
      const storedEventBookmarks = await getEventBookmarks(user.userId);
      if (storedShelterBookmarks) {
        setShelterBookmarks(
          storedShelterBookmarks.map(
            (bookmark: UserShelterBookmark) => bookmark.shelterId
          )
        );
      }
      if (storedEventBookmarks) {
        setEventBookmarks(
          storedEventBookmarks.map(
            (bookmark: UserEventBookmark) => bookmark.eventId
          )
        );
      }
    };
    loadBookmarks();
  }, []);

  // Save bookmarks to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem('shelterBookmarks', JSON.stringify(shelterBookmarks));
  }, [shelterBookmarks]);

  useEffect(() => {
    AsyncStorage.setItem('eventBookmarks', JSON.stringify(eventBookmarks));
  }, [eventBookmarks]);

  // const isShelterBookmarked = (shelterId: string) =>
  //   shelterBookmarks.includes(shelterId);

  const toggleShelterBookmark = async (shelterId: string) => {
    if (shelterBookmarks.includes(shelterId)) {
      setShelterBookmarks((prev: string[]) =>
        prev.filter((id: string) => id !== shelterId)
      );
      await deleteBookmark(user.userId, shelterId, 'shelter'); // Remove from bookmarks
    } else {
      setShelterBookmarks((prev: string[]) => [...prev, shelterId]);
      await postBookmark(user.userId, shelterId, 'shelter'); // Add to bookmarks
    }
  };

  const toggleEventBookmark = async (eventId: string) => {
    if (eventBookmarks.includes(eventId)) {
      setEventBookmarks((prev: string[]) =>
        prev.filter((id: string) => id !== eventId)
      );
      await deleteBookmark(user.userId, eventId, 'event'); // Remove from bookmarks
    } else {
      setEventBookmarks((prev: string[]) => [...prev, eventId]);
      await postBookmark(user.userId, eventId, 'event'); // Add to bookmarks
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        shelterBookmarks,
        toggleShelterBookmark,
        eventBookmarks,
        toggleEventBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
