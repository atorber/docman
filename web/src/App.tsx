import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PrdReview from './pages/PrdReview';
import PrdGenPage from './pages/PrdGenPage';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnose" element={<Home />} />
          <Route path="/records" element={<Home />} />
          <Route path="/docgen" element={<Home />} />
          <Route path="/prd-review" element={<PrdReview />} />
          <Route path="/prd-generate" element={<PrdGenPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;