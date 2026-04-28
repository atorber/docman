import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout, Button, Space, message, Tabs, Spin, Card, Tag, Empty } from 'antd';
import { FileTextOutlined, HistoryOutlined, FileSearchOutlined, CopyOutlined, FileAddOutlined, DashboardOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PrdTree from '../components/PrdTree';
import PrdHistoryList from '../components/PrdHistoryList';
import PrdPromptPanel from '../components/PrdPromptPanel';
import MainNavHeader from '../components/MainNavHeader';
import { getPrdDocumentContent, getPrdReport, getPrdTimeline, getPrdDocTree } from '../services/api';
import { PrdDocNode, PrdReviewRecord, PrdTimelineData } from '../types';

const { Sider, Content } = Layout;

const PrdReview: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedDoc, setSelectedDoc] = useState<PrdDocNode | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PrdReviewRecord | null>(null);
  const [activeMainTab, setActiveMainTab] = useState('preview');
  const [activeHistoryTab, setActiveHistoryTab] = useState('report');
  const [docTree, setDocTree] = useState<PrdDocNode[]>([]);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // 文档内容
  const [docContent, setDocContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);

  // 评审记录相关数据
  const [reportContent, setReportContent] = useState('');
  const [timelineData, setTimelineData] = useState<PrdTimelineData | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  // URL同步
  const docPath = searchParams.get('doc') || undefined;
  const recordPath = searchParams.get('record') || undefined;

  // 更新URL参数
  const updateUrl = (doc?: PrdDocNode, record?: PrdReviewRecord) => {
    const params = new URLSearchParams();
    if (doc) {
      params.set('doc', doc.relativePath);
    }
    if (record) {
      params.set('record', record.timelinePath);
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  // 初始化：从URL恢复状态
  useEffect(() => {
    const initFromUrl = async () => {
      if (docPath || recordPath) {
        const treeData = docTree.length > 0 ? docTree : await loadDocTree();
        if (recordPath) {
          const findRecord = (nodes: PrdDocNode[]): PrdReviewRecord | null => {
            for (const node of nodes) {
              if (node.history?.some(r => r.timelinePath === recordPath)) {
                const matchedRecord = node.history.find(r => r.timelinePath === recordPath);
                return matchedRecord ? { ...matchedRecord, doc: matchedRecord.doc || node } : null;
              }
              if (node.children) {
                const found = findRecord(node.children);
                if (found) return found;
              }
            }
            return null;
          };
          const record = findRecord(treeData);
          if (record) {
            setSelectedRecord(record);
            if (record.doc) {
              setSelectedDoc(record.doc);
            }
            setActiveMainTab('history');
            setActiveHistoryTab('report');
          }
        } else if (docPath) {
          const findDoc = (nodes: PrdDocNode[]): PrdDocNode | null => {
            for (const node of nodes) {
              if (node.relativePath === docPath) return node;
              if (node.children) {
                const found = findDoc(node.children);
                if (found) return found;
              }
            }
            return null;
          };
          const doc = findDoc(treeData);
          if (doc) {
            setSelectedDoc(doc);
            setActiveMainTab('preview');
          }
        }
      }
      setInitialLoadDone(true);
    };
    initFromUrl();
  }, [docPath, recordPath, docTree]);

  useEffect(() => {
    if (selectedDoc) {
      loadDocContent();
    }
  }, [selectedDoc]);

  useEffect(() => {
    if (selectedRecord) {
      loadReviewDetails();
    } else {
      setReportContent('');
      setTimelineData(null);
    }
  }, [selectedRecord]);

  const loadDocTree = async (): Promise<PrdDocNode[]> => {
    try {
      const data = await getPrdDocTree();
      setDocTree(data);
      return data;
    } catch (e) {
      console.error('Failed to load PRD doc tree:', e);
      return [];
    }
  };

  const loadDocContent = async () => {
    if (!selectedDoc) return;
    setLoadingContent(true);
    try {
      const content = await getPrdDocumentContent(selectedDoc.relativePath);
      setDocContent(content);
    } catch (e) {
      console.error('Failed to load PRD doc:', e);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadReviewDetails = async () => {
    if (!selectedRecord) return;
    setLoadingReview(true);
    try {
      const [report, timeline] = await Promise.all([
        getPrdReport(selectedRecord.reportPath).catch(() => '报告文件不存在'),
        getPrdTimeline(selectedRecord.timelinePath).catch(() => null),
      ]);
      setReportContent(report);
      setTimelineData(timeline);
    } catch (error) {
      console.error('Failed to load review details:', error);
    } finally {
      setLoadingReview(false);
    }
  };

  const handleSelectDoc = (node: PrdDocNode) => {
    setSelectedDoc(node);
    setSelectedRecord(null);
    setActiveMainTab('preview');
    if (initialLoadDone) {
      updateUrl(node, undefined);
    }
  };

  const handleSelectRecord = (record: PrdReviewRecord) => {
    setSelectedRecord(record);
    setActiveMainTab('history');
    setActiveHistoryTab('report');
    if (initialLoadDone) {
      updateUrl(record.doc, record);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success('已复制到剪贴板');
  };

  // Markdown 渲染组件配置
  const markdownComponents: any = {
    img: ({ node, ...props }: any) => (
      <img {...props} style={{ maxWidth: '100%', height: 'auto', maxHeight: 400, objectFit: 'contain' }} />
    ),
    table: ({ node, ...props }: any) => (
      <div style={{ overflowX: 'auto' }}><table {...props} style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }} /></div>
    ),
    th: ({ node, ...props }: any) => (
      <th {...props} style={{ border: '1px solid #d9d9d9', padding: '8px 12px', background: '#fafafa', fontWeight: 600, textAlign: 'left' }} />
    ),
    td: ({ node, ...props }: any) => (
      <td {...props} style={{ border: '1px solid #d9d9d9', padding: '8px 12px' }} />
    ),
    pre: ({ node, ...props }: any) => (
      <pre {...props} style={{ background: '#f6f8fa', padding: 16, borderRadius: 6, overflow: 'auto', fontSize: 13, lineHeight: 1.6 }} />
    ),
    code: ({ node, inline, ...props }: any) => (
      inline
        ? <code {...props} style={{ background: '#f6f8fa', padding: '2px 6px', borderRadius: 3, fontSize: 13, color: '#d73a49' }} />
        : <code {...props} style={{ fontSize: 13, lineHeight: 1.6 }} />
    ),
    h1: ({ node, ...props }: any) => (
      <h1 {...props} style={{ fontSize: 24, fontWeight: 600, margin: '24px 0 16px', paddingBottom: 8, borderBottom: '1px solid #eaecef' }} />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 {...props} style={{ fontSize: 20, fontWeight: 600, margin: '20px 0 12px', paddingBottom: 6, borderBottom: '1px solid #eaecef' }} />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 {...props} style={{ fontSize: 17, fontWeight: 600, margin: '16px 0 10px' }} />
    ),
  };

  const renderSummary = () => {
    if (!timelineData) return <Empty description="无评审详情数据" />;

    const getConclusionIcon = (conclusion: string) => {
      switch (conclusion) {
        case '通过':
          return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />;
        case '有条件通过':
          return <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 18 }} />;
        default:
          return <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />;
      }
    };

    return (
      <div>
        <Card title="评审概览" size="small" style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong>评审结论:</strong>
              {getConclusionIcon(timelineData.summary.conclusion)}
              <Tag color={timelineData.summary.conclusion === '通过' ? 'success' : timelineData.summary.conclusion === '有条件通过' ? 'warning' : 'error'}>
                {timelineData.summary.conclusion}
              </Tag>
            </div>
            <div>
              <strong>总问题数:</strong> {timelineData.summary.total_issues}
            </div>
            <div>
              <strong>阻塞性问题:</strong> <Tag color="red">{timelineData.summary.blockers}</Tag>
              <strong style={{ marginLeft: 16 }}>重要问题:</strong>{' '}
              <Tag color="orange">{timelineData.summary.important}</Tag>
              <strong style={{ marginLeft: 16 }}>一般问题:</strong>{' '}
              <Tag color="blue">{timelineData.summary.minor}</Tag>
            </div>
            <div>
              <strong>耗时:</strong> {timelineData.duration_seconds}秒
            </div>
          </Space>
        </Card>

        <Card title="各视角评审详情" size="small">
          {timelineData.perspectives.map((perspective) => {
            const getStatusTag = (status: string) => {
              switch (status) {
                case '✅ 通过': return <Tag color="success">通过</Tag>;
                case '⚠️ 有条件通过': return <Tag color="warning">有条件通过</Tag>;
                default: return <Tag color="error">不通过</Tag>;
              }
            };

            return (
              <div
                key={perspective.id}
                style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>{perspective.name}</span>
                  {getStatusTag(perspective.summary.status)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Tag color="red">高 {perspective.summary.by_severity.high}</Tag>
                  <Tag color="orange">中 {perspective.summary.by_severity.medium}</Tag>
                  <Tag color="blue">低 {perspective.summary.by_severity.low}</Tag>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    );
  };

  // Tab 配置
  const tabItems = [
    {
      key: 'preview',
      label: <span><FileSearchOutlined /> 文档预览</span>,
      children: loadingContent ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(docContent)} style={{ float: 'right' }} size="small">
            复制
          </Button>
          <div style={{ background: '#fff', padding: 16, borderRadius: 6, lineHeight: 1.6, marginTop: 8 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>
              {docContent}
            </ReactMarkdown>
          </div>
        </div>
      ),
    },
    {
      key: 'original',
      label: <span><FileTextOutlined /> 原始文档</span>,
      children: (
        <div>
          <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(docContent)} style={{ float: 'right' }} size="small">
            复制
          </Button>
          <pre style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
            background: '#fafafa',
            padding: 16,
            borderRadius: 6,
            fontSize: 13,
            lineHeight: 1.6,
            marginTop: 8,
          }}>
            {docContent}
          </pre>
        </div>
      ),
    },
    {
      key: 'history',
      label: <span><HistoryOutlined /> 评审历史</span>,
      children: (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <PrdHistoryList
            documentPath={selectedDoc?.relativePath || ''}
            onSelectRecord={handleSelectRecord}
            selectedRecord={selectedRecord}
          />
          {selectedRecord && (
            <div style={{ flex: 1, marginTop: 16, overflow: 'auto' }}>
              <Tabs
                activeKey={activeHistoryTab}
                onChange={(key) => setActiveHistoryTab(key)}
                items={[
                  {
                    key: 'report',
                    label: <span><FileTextOutlined /> 评审报告</span>,
                    children: loadingReview ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <div style={{ maxHeight: 'calc(100vh - 380px)', overflow: 'auto' }}>
                        <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(reportContent)} style={{ float: 'right' }} size="small">复制</Button>
                        <div style={{ background: '#fff', padding: 16, borderRadius: 6, lineHeight: 1.6, marginTop: 8 }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{reportContent}</ReactMarkdown>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'timelineDetail',
                    label: <span><DashboardOutlined /> 评审详情</span>,
                    children: loadingReview ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <div style={{ maxHeight: 'calc(100vh - 380px)', overflow: 'auto' }}>
                        {renderSummary()}
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'prompt',
      label: <span><FileAddOutlined /> 生成评审Prompt</span>,
      children: (
        <PrdPromptPanel
          documentPath={selectedDoc?.relativePath || ''}
          documentName={selectedDoc?.name || ''}
        />
      ),
    },
  ];

  // 文档信息卡片
  const docInfoCard = selectedDoc ? (
    <Card
      size="small"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined />
          <span style={{ fontWeight: 500 }}>{selectedDoc.name}</span>
        </div>
      }
      style={{ marginBottom: 16 }}
    >
      <div style={{ color: '#8c8c8c', fontSize: 12 }}>{selectedDoc.relativePath}</div>
    </Card>
  ) : null;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <MainNavHeader selectedKey="prd-review" />
      <Layout>
        {/* 左侧：文档目录 */}
        <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: 16 }}>PRD文档目录</h3>
            <PrdTree onSelectDoc={handleSelectDoc} selectedDocPath={selectedDoc?.relativePath} defaultSelectFirst={true} />
          </div>
        </Sider>

        {/* 右侧：内容区 */}
        <Content style={{ background: '#fff', padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {docInfoCard}
          <Tabs
            activeKey={activeMainTab}
            onChange={setActiveMainTab}
            items={tabItems}
            style={{ flex: 1 }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PrdReview;