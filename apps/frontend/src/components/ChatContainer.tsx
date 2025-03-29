import React, { useState } from 'react';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';

export const ChatContainer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatButton onClick={handleToggle} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}; 