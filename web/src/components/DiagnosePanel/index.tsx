import React, { useEffect, useState } from 'react';
import { Tabs, Card, Spin, Empty, Button, Space, message, Tag } from 'antd';
import { FileTextOutlined, DashboardOutlined, CodeOutlined } from '@ant-design/icons';
import { DiagnoseRecord, TimelineData } from '../../types';
import { getTimeline, getReport, getFixedDoc } from '../../services/api';

interface DiagnosePanelProps {
  record: DiagnoseRecord | null;
}

const DiagnosePanel: React.FC<DiagnosePanelProps> = ({ record }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('report');
  const [reportContent, setReportContent] = useState('');
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [fixedDocContent, setFixedDocContent] = useState('');

  useEffect(() => {
    if (record) {
      loadDetails();
    }
  }, [record]);

  const loadDetails = async () => {
    if (!record) return;
    setLoading(true);

    try {
      // 并行加载所有数据
      const [report, timeline, fixedDoc] = await Promise.all([
        getReport(record.reportPath).catch(() => '报告文件不存在'),
        getTimeline(record.timelinePath).catch(() => null),
        getFixedDoc(record.fixedDocPath).catch(() => '修复后的文档不存在'),
      ]);

      setReportContent(report);
      setTimelineData(timeline);
      setFixedDocContent(fixedDoc);
    } catch (error) {
      console.error('Failed to load details:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('已复制到剪贴板');
  };

  const renderSummary = () => {
    if (!timelineData) return <Empty description="无诊断详情数据" />;

    return (
      <div>
        <Card title="诊断概览" size="small" style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <strong>任务状态:</strong>{' '}
              <Tag color={timelineData.status === 'completed' ? 'success' : 'error'}>
                {timelineData.status === 'completed' ? '已完成' : timelineData.status}
              </Tag>
            </div>
            <div>
              <strong>总问题数:</strong> {timelineData.summary.total_issues}
            </div>
            <div>
              <strong>高优先级:</strong> <Tag color="red">{timelineData.summary.by_severity.high}</Tag>
              <strong style={{ marginLeft: 16 }}>中优先级:</strong>{' '}
              <Tag color="orange">{timelineData.summary.by_severity.medium}</Tag>
              <strong style={{ marginLeft: 16 }}>低优先级:</strong>{' '}
              <Tag color="blue">{timelineData.summary.by_severity.low}</Tag>
            </div>
            <div>
              <strong>耗时:</strong> {timelineData.duration_seconds}秒
            </div>
          </Space>
        </Card>

        <Card title="各维度诊断详情" size="small">
          {timelineData.dimensions.map((dim) => (
            <div
              key={dim.id}
              style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>
                {dim.id}. {dim.name}
              </span>
              <Space>
                <Tag color={dim.status === 'completed' ? 'success' : 'default'}>
                  {dim.status === 'completed' ? '已完成' : dim.status}
                </Tag>
                <Tag color={dim.issue_count > 0 ? 'red' : 'green'}>
                  {dim.issue_count}个问题
                </Tag>
              </Space>
            </div>
          ))}
        </Card>
      </div>
    );
  };

  if (!record) {
    return <Empty description="请选择左侧文档和诊断记录" />;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  const items = [
    {
      key: 'report',
      label: (
        <span>
          <FileTextOutlined /> 诊断报告
        </span>
      ),
      children: (
        <div>
          <Button
            type="link"
            icon={<CodeOutlined />}
            onClick={() => copyToClipboard(reportContent)}
            style={{ float: 'right' }}
          >
            复制
          </Button>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 500, overflow: 'auto' }}>
            {reportContent}
          </pre>
        </div>
      ),
    },
    {
      key: 'timeline',
      label: (
        <span>
          <DashboardOutlined /> 诊断详情
        </span>
      ),
      children: renderSummary(),
    },
    {
      key: 'fixed',
      label: (
        <span>
          <CodeOutlined /> 修复后文档
        </span>
      ),
      children: (
        <div>
          <Button
            type="link"
            icon={<CodeOutlined />}
            onClick={() => copyToClipboard(fixedDocContent)}
            style={{ float: 'right' }}
          >
            复制
          </Button>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 500, overflow: 'auto' }}>
            {fixedDocContent}
          </pre>
        </div>
      ),
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      items={items}
    />
  );
};

export default DiagnosePanel;