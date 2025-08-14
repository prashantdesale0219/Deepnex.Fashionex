'use client';
import React, { useState } from 'react';
import LoginModal from './login';

const RegisterButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-white text-gray-900 border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        Sign Up
      </button>
      <LoginModal isOpen={isModalOpen} onClose={closeModal} initialMode="signup" />
    </>
  );
};

export default RegisterButton;