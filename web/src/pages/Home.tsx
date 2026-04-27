import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Button, Space, message, Tabs, Spin, Card, Tag, Empty, Menu, Table } from 'antd';
import { FileTextOutlined, HistoryOutlined, FileSearchOutlined, CopyOutlined, EditOutlined, FileAddOutlined, DashboardOutlined, EyeOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import DocTree from '../components/DocTree';
import HistoryList from '../components/HistoryList';
import PromptPanel from '../components/PromptPanel';
import { getDocumentContent, getReport, getTimeline, getFixedDoc, getDocTree } from '../services/api';
import { DocNode, DiagnoseRecord, TimelineData } from '../types';

const { Header, Sider, Content } = Layout;

const Home: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocNode | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiagnoseRecord | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [currentNav, setCurrentNav] = useState<'diagnose' | 'records'>('diagnose');
  const [docTree, setDocTree] = useState<DocNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);

  // 文档内容
  const [docContent, setDocContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);

  // 诊断记录相关数据
  const [reportContent, setReportContent] = useState('');
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [fixedContent, setFixedContent] = useState('');
  const [loadingDiagnose, setLoadingDiagnose] = useState(false);

  useEffect(() => {
    if (selectedDoc) {
      loadDocContent();
    }
  }, [selectedDoc]);

  useEffect(() => {
    if (selectedRecord) {
      loadDiagnoseDetails();
    } else {
      setReportContent('');
      setTimelineData(null);
      setFixedContent('');
    }
  }, [selectedRecord]);

  useEffect(() => {
    if (currentNav === 'records') {
      loadDocTree();
    }
  }, [currentNav]);

  const loadDocTree = async () => {
    setLoadingTree(true);
    try {
      const data = await getDocTree();
      setDocTree(data);
    } catch (e) {
      console.error('Failed to load doc tree:', e);
    } finally {
      setLoadingTree(false);
    }
  };

  const recentDocs = useMemo(() => {
    const result: DocNode[] = [];
    const traverse = (nodes: DocNode[]) => {
      for (const node of nodes) {
        if (node.type === 'file' && node.diagnoseStatus === 'has-history') {
          result.push(node);
        } else if (node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(docTree);
    return result.sort((a, b) => (b.lastDiagnoseTime || '').localeCompare(a.lastDiagnoseTime || ''));
  }, [docTree]);

  const loadDocContent = async () => {
    if (!selectedDoc) return;
    setLoadingContent(true);
    try {
      const content = await getDocumentContent(selectedDoc.relativePath);
      setDocContent(content);
    } catch (e) {
      console.error('Failed to load doc:', e);
    } finally {
      setLoadingContent(false);
    }
  };

  const loadDiagnoseDetails = async () => {
    if (!selectedRecord) return;
    setLoadingDiagnose(true);
    try {
      const [report, timeline, fixedDoc] = await Promise.all([
        getReport(selectedRecord.reportPath).catch(() => '报告文件不存在'),
        getTimeline(selectedRecord.timelinePath).catch(() => null),
        getFixedDoc(selectedRecord.fixedDocPath).catch(() => '修复后的文档不存在'),
      ]);
      setReportContent(report);
      setTimelineData(timeline);
      setFixedContent(fixedDoc);
    } catch (error) {
      console.error('Failed to load diagnose details:', error);
    } finally {
      setLoadingDiagnose(false);
    }
  };

  const handleSelectDoc = (node: DocNode) => {
    setSelectedDoc(node);
    setSelectedRecord(null);
    setActiveTab('preview');
  };

  const handleSelectRecord = (record: DiagnoseRecord) => {
    setSelectedRecord(record);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success('已复制到剪贴板');
  };

  // 统一的 Markdown 渲染组件配置
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
    blockquote: ({ node, ...props }: any) => (
      <blockquote {...props} style={{ borderLeft: '4px solid #dfe2e5', padding: '0 16px', margin: '8px 0', color: '#6a737d', background: '#f6f8fa', borderRadius: '0 6px 6px 0' }} />
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
    h4: ({ node, ...props }: any) => (
      <h4 {...props} style={{ fontSize: 15, fontWeight: 600, margin: '14px 0 8px' }} />
    ),
    ul: ({ node, ...props }: any) => (
      <ul {...props} style={{ paddingLeft: 24, margin: '8px 0' }} />
    ),
    ol: ({ node, ...props }: any) => (
      <ol {...props} style={{ paddingLeft: 24, margin: '8px 0' }} />
    ),
    li: ({ node, ...props }: any) => (
      <li {...props} style={{ margin: '4px 0', lineHeight: 1.6 }} />
    ),
    a: ({ node, ...props }: any) => (
      <a {...props} style={{ color: '#1890ff', textDecoration: 'none' }} />
    ),
    hr: ({ node, ...props }: any) => (
      <hr {...props} style={{ border: 0, borderTop: '1px solid #e1e4e8', margin: '16px 0' }} />
    ),
    p: ({ node, ...props }: any) => (
      <p {...props} style={{ margin: '8px 0', lineHeight: 1.6 }} />
    ),
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
          {timelineData.dimensions.map((dim) => {
            // 锚点ID映射：与诊断报告中的锚点格式对应
            const anchorMap: Record<number, string> = {
              1: '2-1-文档与系统一致性',
              2: '2-1-文档与系统一致性',
              3: '2-1-文档与系统一致性',
              4: '2-1-文档与系统一致性',
              5: '2-1-文档与系统一致性',
              6: '2-1-文档与系统一致性',
              7: '2-1-文档与系统一致性',
              8: '2-1-文档与系统一致性',
              9: '2-1-文档与系统一致性',
              10: '2-1-文档与系统一致性',
              11: '2-2-描述不清晰',
              12: '2-1-文档与系统一致性',
              13: '2-1-文档与系统一致性',
              14: '2-1-文档与系统一致性',
              15: '2-1-文档与系统一致性',
              16: '3-2-缺少提示警告注意',
              17: '2-1-文档与系统一致性',
              18: '2-1-文档与系统一致性',
            };
            const anchorId = anchorMap[dim.id] || '2-1-文档与系统一致性';
            return (
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
                  {dim.issue_count > 0 ? (
                    <a
                      href={`#${anchorId}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab('report');
                        setTimeout(() => {
                          const element = document.getElementById(anchorId);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 100);
                      }}
                      style={{ cursor: 'pointer', color: '#ff4d4f' }}
                    >
                      <Tag color="red">{dim.issue_count}个问题</Tag>
                    </a>
                  ) : (
                    <Tag color="green">{dim.issue_count}个问题</Tag>
                  )}
                </Space>
              </div>
            );
          })}
        </Card>
      </div>
    );
  };

  // 基础 Tab
  const tabItems = [
    {
      key: 'preview',
      label: (
        <span>
          <FileSearchOutlined /> 文档预览
        </span>
      ),
      children: loadingContent ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Button
            type="link"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(docContent)}
            style={{ float: 'right' }}
            size="small"
          >
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
      label: (
        <span>
          <FileTextOutlined /> 原始文档
        </span>
      ),
      children: (
        <div>
          <Button
            type="link"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(docContent)}
            style={{ float: 'right' }}
            size="small"
          >
            复制
          </Button>
          <pre
            style={{
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
            }}
          >
            {docContent}
          </pre>
        </div>
      ),
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined /> 诊断历史
        </span>
      ),
      children: (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <HistoryList
            documentPath={selectedDoc?.relativePath || ''}
            onSelectRecord={handleSelectRecord}
            selectedRecord={selectedRecord}
          />
          {selectedRecord && (
            <div style={{ flex: 1, marginTop: 16, overflow: 'auto' }}>
              <Tabs
                defaultActiveKey="report"
                items={[
                  {
                    key: 'report',
                    label: <span><FileTextOutlined /> 诊断报告</span>,
                    children: loadingDiagnose ? (
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
                    label: <span><DashboardOutlined /> 诊断详情</span>,
                    children: loadingDiagnose ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <div style={{ maxHeight: 'calc(100vh - 380px)', overflow: 'auto' }}>
                        {renderSummary()}
                      </div>
                    ),
                  },
                  {
                    key: 'fixed',
                    label: <span><EditOutlined /> 修复后文档</span>,
                    children: loadingDiagnose ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <div>
                        <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(fixedContent)} style={{ float: 'right' }} size="small">复制</Button>
                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 'calc(100vh - 380px)', overflow: 'auto', background: '#f0f8ff', padding: 16, borderRadius: 6, fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
                          {fixedContent}
                        </pre>
                      </div>
                    ),
                  },
                  {
                    key: 'fixedPreview',
                    label: <span><EyeOutlined /> 修复后文档预览</span>,
                    children: loadingDiagnose ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <Spin size="large" />
                      </div>
                    ) : (
                      <div style={{ maxHeight: 'calc(100vh - 380px)', overflow: 'auto' }}>
                        <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(fixedContent)} style={{ float: 'right' }} size="small">复制</Button>
                        <div style={{ background: '#fff', padding: 16, borderRadius: 6, lineHeight: 1.6, marginTop: 8 }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{fixedContent}</ReactMarkdown>
                        </div>
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
      label: (
        <span>
          <FileAddOutlined /> 生成诊断
        </span>
      ),
      children: (
        <PromptPanel
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

  const handleNavToDoc = (node: DocNode) => {
    setCurrentNav('diagnose');
    handleSelectDoc(node);
  };

  const navItems = [
    { key: 'diagnose', label: '文档诊断' },
    { key: 'records', label: '最近记录' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 24 }}>
        <h2 style={{ margin: 0, lineHeight: '64px' }}>DocMan</h2>
        <Menu
          mode="horizontal"
          selectedKeys={[currentNav]}
          onClick={(e) => setCurrentNav(e.key as 'diagnose' | 'records')}
          items={navItems}
          style={{ flex: 1, borderBottom: 'none' }}
        />
      </Header>
      <Layout>
        {currentNav === 'diagnose' && (
          <>
            {/* 左侧：文档目录 */}
            <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
              <div style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: 16 }}>帮助文档目录</h3>
                <DocTree onSelectDoc={handleSelectDoc} selectedDocPath={selectedDoc?.relativePath} defaultSelectFirst={true} />
              </div>
            </Sider>

            {/* 右侧：一层Tab（文档预览/原始文档/诊断历史/修复后文档） */}
            <Content style={{ background: '#fff', padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {docInfoCard}
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                style={{ flex: 1 }}
              />
            </Content>
          </>
        )}
        {currentNav === 'records' && (
          <Content style={{ background: '#fff', padding: 24, overflow: 'auto' }}>
            <h3 style={{ marginBottom: 16 }}>最近记录</h3>
            {loadingTree ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <Spin size="large" />
              </div>
            ) : (
              <Table
                dataSource={recentDocs}
                columns={[
                  { title: '文档名称', dataIndex: 'name', key: 'name' },
                  { title: '路径', dataIndex: 'relativePath', key: 'relativePath' },
                  { title: '最近诊断时间', dataIndex: 'lastDiagnoseTime', key: 'lastDiagnoseTime' },
                  {
                    title: '操作',
                    key: 'action',
                    render: (_, record) => (
                      <Button type="link" onClick={() => handleNavToDoc(record)}>
                        查看详情
                      </Button>
                    ),
                  },
                ]}
                rowKey="relativePath"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: '暂无诊断记录' }}
              />
            )}
          </Content>
        )}
      </Layout>
    </Layout>
  );
};

export default Home;