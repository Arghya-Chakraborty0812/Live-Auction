import { useEffect, useState } from "react";
import "./CountdownTimer.css";

export default function CountdownTimer({ auctionEndTime, onEnd }) {
  const [timeLeft, setTimeLeft] = useState(() =>
    auctionEndTime ? Math.max(auctionEndTime - Date.now(), 0) : 0
  );

  useEffect(() => {
    if (!auctionEndTime) return;

    const interval = setInterval(() => {
      const diff = auctionEndTime - Date.now();

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        onEnd && onEnd();
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionEndTime, onEnd]);

  if (timeLeft === 0) {
    return <p className="ended">Auction Ended</p>;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <div className="timer">
      <div>
        <span>{days}</span>
        <small>Days</small>
      </div>
      <div>
        <span>{hours}</span>
        <small>Hours</small>
      </div>
      <div>
        <span>{minutes}</span>
        <small>Minutes</small>
      </div>
      <div>
        <span>{seconds}</span>
        <small>Seconds</small>
      </div>
    </div>
  );
}
