import React from 'react';
import { ConfigProvider, theme } from 'antd';
import Home from './pages/Home';

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
      <Home />
    </ConfigProvider>
  );
};

export default App;