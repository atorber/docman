import React, { useEffect, useState } from 'react';
import { List, Card, Tag, Empty, Spin, Button, Space, Tooltip } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, DashboardOutlined, FileDoneOutlined, SyncOutlined } from '@ant-design/icons';
import { DiagnoseRecord } from '../types';
import { getDiagnoseHistory } from '../../services/api';

interface HistoryListProps {
  documentPath: string;
  onSelectRecord: (record: DiagnoseRecord) => void;
  selectedRecord?: DiagnoseRecord;
}

const HistoryList: React.FC<HistoryListProps> = ({ documentPath, onSelectRecord, selectedRecord }) => {
  const [records, setRecords] = useState<DiagnoseRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (documentPath) {
      loadHistory();
    }
  }, [documentPath]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getDiagnoseHistory(documentPath);
      setRecords(data);
    } catch (error) {
      console.error('Failed to load history:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'failed':
        return <Tag color="error">失败</Tag>;
      case 'partial':
        return <Tag color="warning">部分完成</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}分${secs}秒`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!documentPath) {
    return <Empty description="请选择左侧文档" />;
  }

  if (records.length === 0) {
    return <Empty description="暂无诊断历史" />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>诊断历史 ({records.length})</span>
        <Button type="text" icon={<SyncOutlined />} onClick={loadHistory} size="small">
          刷新
        </Button>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <List
          dataSource={records}
          renderItem={(record) => (
            <Card
              size="small"
              hoverable
              onClick={() => onSelectRecord(record)}
              style={{
                marginBottom: 8,
                borderColor: selectedRecord?.timestamp === record.timestamp ? '#1890ff' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <ClockCircleOutlined />
                    <span style={{ fontWeight: 500 }}>{record.timestamp}</span>
                    {getStatusTag(record.status)}
                  </div>
                  <Space size="small">
                    <Tag color="red">高 {record.highPriority}</Tag>
                    <Tag color="orange">中 {record.mediumPriority}</Tag>
                    <Tag color="blue">低 {record.lowPriority}</Tag>
                    <span style={{ color: '#999', fontSize: 12 }}>
                      耗时: {formatDuration(record.durationSeconds)}
                    </span>
                  </Space>
                </div>
              </div>
            </Card>
          )}
        />
      </div>
    </div>
  );
};

export default HistoryList;