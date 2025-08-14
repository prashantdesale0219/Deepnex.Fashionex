'use client';
import LoginModal from './login';

// This file now re-exports the LoginModal component from login.jsx
// The LoginModal component has been updated to support both login and signup functionality

const RegisterModal = ({ isOpen, onClose }) => {
  // Pass initialMode as 'signup' to start in signup mode
  return <LoginModal isOpen={isOpen} onClose={onClose} initialMode="signup" />;
};

export default RegisterModal;