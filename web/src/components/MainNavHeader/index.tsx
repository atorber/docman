import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

export type MainNavKey = 'diagnose' | 'records' | 'docgen' | 'prdgen' | 'prd-review';

const NAV_ITEMS = [
  { key: 'diagnose', label: '帮助文档诊断' },
  { key: 'docgen', label: '帮助文档生成' },
  { key: 'prdgen', label: 'PRD生成' },
  { key: 'prd-review', label: 'PRD评审' },
  { key: 'records', label: '最近记录' },
] as const;

interface MainNavHeaderProps {
  selectedKey: MainNavKey;
}

const MainNavHeader: React.FC<MainNavHeaderProps> = ({ selectedKey }) => {
  const navigate = useNavigate();

  const handleNavChange = (key: MainNavKey) => {
    if (key === 'diagnose') {
      navigate('/', { replace: true });
    } else if (key === 'docgen') {
      navigate('/docgen', { replace: true });
    } else if (key === 'prdgen') {
      navigate({ pathname: '/', search: '?nav=prdgen' }, { replace: true });
    } else if (key === 'prd-review') {
      navigate('/prd-review', { replace: true });
    } else if (key === 'records') {
      navigate('/records', { replace: true });
    }
  };

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <h2 style={{ margin: 0, lineHeight: '64px' }}>DocMan</h2>
      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={(e) => handleNavChange(e.key as MainNavKey)}
        items={[...NAV_ITEMS]}
        style={{ flex: 1, borderBottom: 'none' }}
      />
    </Header>
  );
};

export default MainNavHeader;
