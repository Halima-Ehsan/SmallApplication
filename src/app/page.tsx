"use client";
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/data/hackernews_topstories.json');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Story[] = await res.json();
        console.log('Fetched data:', data);
        setTopStories(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
    </div>
  );
}
