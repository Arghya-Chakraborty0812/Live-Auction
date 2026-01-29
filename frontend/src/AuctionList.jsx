import React, { useEffect, useState } from "react";
import AuctionCard from "./AuctionCard/AuctionCard";

// const API = import.meta.env.VITE_BACKEND_URL;

export default function AuctionList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://live-auction-6i7e.onrender.com/api/items")
      .then(res => res.json())
      .then(data => {
        const itemsWithEndTime = data.map(item => ({
          ...item,
          auctionEndTime: Date.now() + 3 * 60 * 1000
        }));
        setItems(itemsWithEndTime);
      });
  }, []);
  


  return (
    <div className="auction-list">
      {items.map(item => (
        <AuctionCard key={item.id} item={item} />
      ))}
    </div>
  );
}
