import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ListPage from './pages/ListPage';
import FormPage from './pages/FormPage';
import ItemPage from './pages/ItemPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/list" />} />
      <Route path="/list" element={<ListPage />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/item/:id" element={<ItemPage />} />
    </Routes>
  );
};

export default App;
