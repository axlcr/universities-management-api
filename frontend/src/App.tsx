import React, { useState } from 'react';
import UniversityTable from './components/UniversityTable';
import AddUniversityForm from './components/AddUniversityForm';
import Modal from './components/Modal';

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Universities</h1>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add University
      </button>
      <UniversityTable />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-lg font-bold mb-4">Add University</h2>
        <AddUniversityForm />
      </Modal>
    </div>
  );
};

export default App;
