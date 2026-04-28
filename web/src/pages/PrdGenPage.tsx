import React from 'react';
import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import PrdGeneratorPanel from '../components/PrdGeneratorPanel';

const { Content } = Layout;

const PrdGenPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 移除独立的header，由Home.tsx中的统一header控制导航
  // 如果直接访问此页面，跳转到Home并设置nav参数
  React.useEffect(() => {
    if (!location.search) {
      navigate('/?nav=prdgen', { replace: true });
    }
  }, [location, navigate]);

  return (
    <Content style={{ background: '#fff', overflow: 'hidden' }}>
      <div style={{ height: 'calc(100vh - 64px)', overflow: 'auto', padding: 24 }}>
        <PrdGeneratorPanel />
      </div>
    </Content>
  );
};

export default PrdGenPage;