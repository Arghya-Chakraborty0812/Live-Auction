import React, { useEffect, useState } from "react";
import "./AuctionCard.css";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import socket from "../../socket";

export default function AuctionCard({ item }) {
  const [currentBid, setCurrentBid] = useState(item.currentBid);
  const [isEnded, setIsEnded] = useState(false);
  const [flash, setFlash] = useState("");
  const [status, setStatus] = useState("");
  const [myUserId, setMyUserId] = useState(null);

  /* get socket id */
  useEffect(() => {
    const onConnect = () => setMyUserId(socket.id);

    socket.on("connect", onConnect);
    if (socket.connected) setMyUserId(socket.id);

    return () => socket.off("connect", onConnect);
  }, []);

  /* socket listeners */
  useEffect(() => {
    const onUpdateBid = updatedItem => {
      if (updatedItem.id !== item.id) return;

      setCurrentBid(updatedItem.currentBid);
      setFlash("green");
      setTimeout(() => setFlash(""), 400);

      if (updatedItem.lastBidder === myUserId) {
        setStatus("WINNING");
      } else {
        setStatus("OUTBID");
      }
    };

    const onBidError = msg => {
      setFlash("red");
      setStatus("OUTBID");
      alert(msg); // optional
      setTimeout(() => setFlash(""), 400);
    };

    socket.on("UPDATE_BID", onUpdateBid);
    socket.on("BID_ERROR", onBidError);

    return () => {
      socket.off("UPDATE_BID", onUpdateBid);
      socket.off("BID_ERROR", onBidError);
    };
  }, [item.id, myUserId]);

  const handleBid = () => {
    if (isEnded) return;

    socket.emit("BID_PLACED", {
      itemId: item.id,
      bidAmount: currentBid + 10
    });
  };

  return (
    <div className={`auction-card ${flash}`}>
      <img src={item.image} alt={item.title} />
      <h2>{item.title}</h2>
      <h3>₹{currentBid}</h3>

      {status === "WINNING" && <span className="badge winning">Winning</span>}
      {status === "OUTBID" && <span className="badge outbid">Outbid</span>}

      <CountdownTimer
        auctionEndTime={item.auctionEndTime}
        onEnd={() => setIsEnded(true)}
      />

      <button  id = "bid_start_btn"onClick={handleBid} disabled={isEnded}>
        {isEnded ? "Auction Ended" : "Bid +₹10"}
      </button>
    </div>
  );
}
