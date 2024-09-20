"use client";
import { useState, useEffect, useRef } from 'react';
import Spinner from '../../components/spinner/Spinner'; 

interface Story {
  id: number;
  title: string;
  url: string;
  by?: string;
  descendants?: number;
  kids?: number[];
  score?: number;
  time?: number;
  text?: string;
}

export default function Home() {
  const [topStories, setTopStories] = useState<Story[]>([]);
  const [storyIds, setStoryIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchTopStoryIds = async () => {
      try {
        const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const ids: number[] = await res.json();
        setStoryIds(ids);
      } catch (error) {
        console.error('Error fetching story IDs:', error);
      }
    };

    fetchTopStoryIds();
  }, []);

  const fetchStories = async (startIndex: number, batchSize: number) => {
    try {
      setLoading(true); 
      const batchIds = storyIds.slice(startIndex, startIndex + batchSize);
      const storyPromises = batchIds.map(async (id) => {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return await res.json();
      });

      const stories = await Promise.all(storyPromises);
      setTopStories((prevStories) => [...prevStories, ...stories]);
      setCurrentIndex((prevIndex) => prevIndex + batchSize);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !loading) {
        fetchStories(currentIndex, 20); 
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [currentIndex, loading]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Top Stories</h1>
      <div className="grid grid-cols-1">
        {topStories.map((story) => (
          <div
            key={story.id}
            className="rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 mb-5">
              <a href={story.url} className="text-1xl font-semibold mb-2">{story.title}</a>
              <a href={story.url} className='p-2 text-xs'>({story.url})</a>
              <div className="text-xs p-2 ">{story.score} points by {story.by} </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={observerRef} className="loading-indicator text-center">
        {loading && <Spinner size={50} color="#09f" />} 
      </div>
    </div>
  );
}
