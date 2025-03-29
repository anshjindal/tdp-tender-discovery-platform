import React from 'react';
import styled from '@emotion/styled';

const ChatButtonContainer = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    background-color: #0056b3;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ChatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
      fill="currentColor"
    />
  </svg>
);

interface ChatButtonProps {
  onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onClick }) => {
  return (
    <ChatButtonContainer onClick={onClick} aria-label="Open chat">
      <ChatIcon />
    </ChatButtonContainer>
  );
}; 