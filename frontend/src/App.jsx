import { useEffect, useState } from "react";
import AuctionCard from "./components/AuctionCard/AuctionCard";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/items")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  return (
    <div className="app">
      <h1>Live Auctions</h1>

      <div className="auction-grid">
        {items.map((item) => (
          <AuctionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default App;
