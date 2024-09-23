"use client";
import { useState, useEffect, useRef } from 'react';
import Spinner from '../../components/spinner/Spinner'; 
import StreakCounter from '../../components/streak-counter/StreakCounter';
import Card from 'react-bootstrap/Card'; 
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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

  const incrementStreak = () => {
    if (streakCounterRef.current) {
      streakCounterRef.current.incrementStreak();
    }
  };


  const streakCounterRef = useRef<any>(null);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">Top Stories</h1>
      <StreakCounter ref={streakCounterRef}/>
      <Row xs={1} md={2} lg={3} className="g-4">
        {topStories.map((story) => (
          <Col key={story.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center mb-4" 
            style={{ minHeight: '200px', maxHeight: '200px' }} 
            onClick={() => incrementStreak()}>
              <Card.Body className='d-flex flex-column justify-between'>
                <Card.Title>{story.title} <i className="bi bi-link" style={{ cursor: 'pointer' }} onClick={() => window.open(story.url, '_blank')} /></Card.Title>
                <Card.Text className="mt-auto">
                  <div className="text-xs">{story.score} points by {story.by}</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div ref={observerRef} className="loading-indicator text-center">
        {loading && <Spinner size={50} color="#09f" />} 
      </div>
    </div>
  );
}
