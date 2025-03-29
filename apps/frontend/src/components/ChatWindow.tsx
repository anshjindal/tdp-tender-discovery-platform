import React, { useState } from 'react';
import styled from '@emotion/styled';

const ChatWindowContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 300px;
  height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: ${props => (props.isOpen ? 'translateY(0)' : 'translateY(100%)')};
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: all 0.3s ease;
  z-index: 999;
`;

const ChatHeader = styled.div`
  padding: 15px;
  background: #007bff;
  color: white;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatTitle = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  font-size: 20px;
  line-height: 1;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 15px;
  background: ${props => (props.isUser ? '#007bff' : '#f0f0f0')};
  color: ${props => (props.isUser ? 'white' : 'black')};
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const ChatInput = styled.div`
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage('');
      // Here you would typically also send the message to your backend
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatWindowContainer isOpen={isOpen}>
      <ChatHeader>
        <ChatTitle>Chat Support</ChatTitle>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </ChatHeader>
      <ChatMessages>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.isUser}>
            {msg.text}
          </Message>
        ))}
      </ChatMessages>
      <ChatInput>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <SendButton onClick={handleSend}>Send</SendButton>
      </ChatInput>
    </ChatWindowContainer>
  );
}; 