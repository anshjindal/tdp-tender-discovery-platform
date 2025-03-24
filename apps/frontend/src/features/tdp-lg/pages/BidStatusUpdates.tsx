// apps/frontend/src/features/tdp-lg/pages/BidStatusUpdates.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';

interface UpdatedBid {
  bid_id?: string;
  bid_status?: string;
  [key: string]: any;
}
interface UpdatedTender {
  submission_id?: string;
  status?: string;
  [key: string]: any;
}

const BidStatusUpdates: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);

  
  const [bidEvents, setBidEvents] = useState<string[]>([]);
  const [tenderEvents, setTenderEvents] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token') || '';

    // Connect via socket.io
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      query: { token },
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setConnected(true);
    });
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // BIDS
    socket.on('bidInserted', (data: { bid: UpdatedBid }) => {
      console.log('bidInserted event:', data.bid);
      if (!data.bid) return;
      toast.info(`New bid inserted: ${data.bid.bid_id}`);
      setBidEvents((prev) => [
        `INSERT => ID: ${data.bid.bid_id}`,
        ...prev,
      ]);
    });

    socket.on('bidUpdated', (data: { bid: UpdatedBid }) => {
      console.log('bidUpdated event:', data.bid);
      if (!data.bid) return;
      toast.info(`Bid updated: ${data.bid.bid_id} => ${data.bid.bid_status}`);
      setBidEvents((prev) => [
        `UPDATE => ID: ${data.bid.bid_id}, status: ${data.bid.bid_status}`,
        ...prev,
      ]);
    });

    socket.on('bidDeleted', (data: { bid: UpdatedBid }) => {
      console.log('bidDeleted event:', data.bid);
      if (!data.bid) return;
      toast.error(`Bid deleted: ${data.bid.bid_id}`);
      setBidEvents((prev) => [
        `DELETE => ID: ${data.bid.bid_id}`,
        ...prev,
      ]);
    });

    // TENDERS
    socket.on('tenderInserted', (data: { tender: UpdatedTender }) => {
      console.log('tenderInserted event:', data.tender);
      if (!data.tender) return;
      toast.info(`New tender inserted: ${data.tender.submission_id}`);
      setTenderEvents((prev) => [
        `INSERT => ID: ${data.tender.submission_id}`,
        ...prev,
      ]);
    });

    socket.on('tenderUpdated', (data: { tender: UpdatedTender }) => {
      console.log('tenderUpdated event:', data.tender);
      if (!data.tender) return;
      toast.info(`Tender updated: ${data.tender.submission_id} => ${data.tender.status}`);
      setTenderEvents((prev) => [
        `UPDATE => ID: ${data.tender.submission_id}, status: ${data.tender.status}`,
        ...prev,
      ]);
    });

    socket.on('tenderDeleted', (data: { tender: UpdatedTender }) => {
      console.log('tenderDeleted event:', data.tender);
      if (!data.tender) return;
      toast.error(`Tender deleted: ${data.tender.submission_id}`);
      setTenderEvents((prev) => [
        `DELETE => ID: ${data.tender.submission_id}`,
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Bid Status Updates</h2>
      <p>Socket Connection: {connected ? 'Connected' : 'Not Connected'}</p>

      <hr />
      <h3>Recent Bid Events:</h3>
      {bidEvents.length === 0 ? (
        <p>No bid events yet.</p>
      ) : (
        <ul>
          {bidEvents.map((evt, idx) => (
            <li key={idx}>{evt}</li>
          ))}
        </ul>
      )}

      <hr />
      <h3>Recent Tender Events:</h3>
      {tenderEvents.length === 0 ? (
        <p>No tender events yet.</p>
      ) : (
        <ul>
          {tenderEvents.map((evt, idx) => (
            <li key={idx}>{evt}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BidStatusUpdates;

