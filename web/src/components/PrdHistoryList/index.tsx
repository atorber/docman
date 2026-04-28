import React, { useState, useEffect } from 'react';
import { List, Tag, Spin, Empty, Space } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PrdReviewRecord } from '../../types';
import { getPrdReviewHistory } from '../../services/api';

interface PrdHistoryListProps {
  documentPath: string;
  onSelectRecord: (record: PrdReviewRecord) => void;
  selectedRecord?: PrdReviewRecord | null;
}

const PrdHistoryList: React.FC<PrdHistoryListProps> = ({ documentPath, onSelectRecord, selectedRecord }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PrdReviewRecord[]>([]);

  useEffect(() => {
    if (documentPath) {
      loadHistory();
    }
  }, [documentPath]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getPrdReviewHistory(documentPath);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load PRD review history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'partial':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
    }
  };

  const getConclusionTag = (conclusion: string) => {
    switch (conclusion) {
      case '通过':
        return <Tag color="success">通过</Tag>;
      case '有条件通过':
        return <Tag color="warning">有条件通过</Tag>;
      default:
        return <Tag color="error">不通过</Tag>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (history.length === 0) {
    return <Empty description="暂无评审历史" />;
  }

  return (
    <List
      dataSource={history}
      renderItem={(item) => (
        <List.Item
          onClick={() => onSelectRecord(item)}
          style={{
            cursor: 'pointer',
            background: selectedRecord?.timelinePath === item.timelinePath ? '#f0f5ff' : 'transparent',
            borderRadius: 6,
            padding: '12px 16px',
            marginBottom: 8,
            border: '1px solid #f0f0f0',
          }}
        >
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Space>
                {getStatusIcon(item.status)}
                <span style={{ fontWeight: 500 }}>{item.timestamp}</span>
                {getConclusionTag(item.conclusion)}
              </Space>
              <Space>
                <Tag color="red">{item.highPriority} 高</Tag>
                <Tag color="orange">{item.mediumPriority} 中</Tag>
                <Tag color="blue">{item.lowPriority} 低</Tag>
              </Space>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8c8c8c', fontSize: 12 }}>
              <span>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {item.durationSeconds ? `${item.durationSeconds}秒` : '-'}
              </span>
              <span>共 {item.totalIssues} 个问题</span>
            </div>
          </div>
        </List.Item>
      )}
    />
  );
};

export default PrdHistoryList;
