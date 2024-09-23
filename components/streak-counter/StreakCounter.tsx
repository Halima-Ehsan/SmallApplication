import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';

const StreakCounter = forwardRef((_, ref) => {
  const [streakCount, setStreakCount] = useState<number>(0);
  const [lastVisit, setLastVisit] = useState<Date | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);

  useEffect(() => {
    const cookieName = 'daily_streak';
    const cookieValue = getCookie(cookieName);

    if (cookieValue) {
      const [streak, lastVisitDate, clicks] = cookieValue.split(',');
      setStreakCount(parseInt(streak, 10));
      setLastVisit(new Date(Number(lastVisitDate)));

      const storedClickCount = parseInt(clicks, 10);
      setClickCount(storedClickCount);
    } else {
      const today = new Date();
      setCookie('daily_streak', `1,${today.getTime()},0`);
      setStreakCount(1);
      setLastVisit(today);
      setClickCount(0);
    }
  }, []);

  useEffect(() => {
    const today = new Date();

    if (lastVisit) {
      const isSameDay = lastVisit.toDateString() === today.toDateString();
      if (!isSameDay) {
        const newStreakCount = streakCount + 1;
        setStreakCount(newStreakCount);
        setClickCount(0); 
        setLastVisit(today);

        setCookie('daily_streak', `${newStreakCount},${today.getTime()},0`);
      }
    }
  }, [lastVisit, streakCount]);

  const incrementStreak = () => {
    const today = new Date();
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      setCookie('daily_streak', `${streakCount},${today.getTime()},${newCount}`);
      return newCount;
    });
  };

  const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const setCookie = (name: string, value: string) => {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  };

  useImperativeHandle(ref, () => ({
    incrementStreak,
  }));

  return (
    <div className="streak-counter fixed top-4 right-4 flex items-center p-2 ">
      <FontAwesomeIcon icon={faFire} />
      <span className="ml-2 p-2">
        {clickCount}
      </span>
    </div>
  );
});

StreakCounter.displayName = 'StreakCounter'; 

export default StreakCounter;
