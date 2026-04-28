import React, { useState, useEffect, useMemo } from 'react';
import { Layout, Button, Space, message, Tabs, Spin, Card, Tag, Empty, Menu, Table, Modal } from 'antd';
import { FileTextOutlined, HistoryOutlined, FileSearchOutlined, CopyOutlined, EditOutlined, FileAddOutlined, DashboardOutlined, EyeOutlined, FolderOpenOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import * as Diff from 'diff';
import { open } from '@tauri-apps/plugin-dialog';
import DocTree from '../components/DocTree';
import HistoryList from '../components/HistoryList';
import PromptPanel from '../components/PromptPanel';
import { getDocumentContent, getReport, getTimeline, getFixedDoc, getDocTree, saveFixedDoc, getWorkDirectory, setWorkDirectory } from '../services/api';
import { DocNode, DiagnoseRecord, TimelineData } from '../types';

const { Header, Sider, Content } = Layout;

const Home: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocNode | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiagnoseRecord | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [docTree, setDocTree] = useState<DocNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);

  // 工作目录状态
  const [workDir, setWorkDir] = useState<string | null>(null);
  const [showWorkDirModal, setShowWorkDirModal] = useState(false);
  const [selectingDir, setSelectingDir] = useState(false);

  // 文档内容
  const [docContent, setDocContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);

  // 诊断记录相关数据
  const [reportContent, setReportContent] = useState('');
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [fixedContent, setFixedContent] = useState('');
  const [loadingDiagnose, setLoadingDiagnose] = useState(false);
  const [diffFullscreen, setDiffFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);

  // 当前导航
  const [currentNav, setCurrentNav] = useState<'diagnose' | 'records'>('diagnose');

  // 初始化：检查工作目录
  useEffect(() => {
    checkWorkDirectory();
  }, []);

  const checkWorkDirectory = async () => {
    try {
      const dir = await getWorkDirectory();
      console.log('Loaded work directory:', dir);
      if (dir) {
        setWorkDir(dir);
        loadDocTree();
      } else {
        setShowWorkDirModal(true);
      }
    } catch (e) {
      console.error('Failed to check work directory:', e);
      setShowWorkDirModal(true);
    }
  };

  const handleSelectWorkDir = async () => {
    setSelectingDir(true);
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: '选择工作目录（项目根目录）',
      });
      
      console.log('Selected directory:', selected);
      
      if (selected && typeof selected === 'string') {
        await setWorkDirectory(selected);
        setWorkDir(selected);
        setShowWorkDirModal(false);
        message.success('工作目录已设置: ' + selected);
        // 重新加载文档树
        setTimeout(() => loadDocTree(), 100);
      }
    } catch (e) {
      console.error('Failed to select work directory:', e);
      message.error('选择目录失败');
    } finally {
      setSelectingDir(false);
    }
  };

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

  const loadDocTree = async (): Promise<DocNode[]> => {
    setLoadingTree(true);
    try {
      const data = await getDocTree();
      console.log('Loaded doc tree:', data);
      setDocTree(data);
      return data;
    } catch (e) {
      console.error('Failed to load doc tree:', e);
      message.error('加载文档树失败: ' + e);
      return [];
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

  // Diff 对比视图渲染
  const renderDiffView = (opts?: { height?: string; showFullscreen?: boolean }) => {
    const height = opts?.height ?? 'calc(100vh - 380px)';
    const showFullscreen = opts?.showFullscreen ?? true;

    if (!fixedContent || fixedContent === '修复后的文档不存在') {
      return <Empty description="修复后的文档不存在" />;
    }

    const chunks = Diff.diffLines(docContent || '', fixedContent);
    const rows: { left: string; right: string; type: 'equal' | 'delete' | 'add' | 'change' }[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      const splitLines = (text: string) => {
        const lines = text.split('\n');
        if (lines.length > 0 && lines[lines.length - 1] === '') {
          lines.pop();
        }
        return lines;
      };

      if (!chunk.added && !chunk.removed) {
        const lines = splitLines(chunk.value);
        for (const line of lines) {
          rows.push({ left: line, right: line, type: 'equal' });
        }
      } else if (chunk.removed) {
        const nextChunk = chunks[i + 1];
        if (nextChunk && nextChunk.added) {
          const leftLines = splitLines(chunk.value);
          const rightLines = splitLines(nextChunk.value);
          const maxLen = Math.max(leftLines.length, rightLines.length);
          for (let j = 0; j < maxLen; j++) {
            rows.push({
              left: leftLines[j] !== undefined ? leftLines[j] : '',
              right: rightLines[j] !== undefined ? rightLines[j] : '',
              type: 'change',
            });
          }
          i++;
        } else {
          const lines = splitLines(chunk.value);
          for (const line of lines) {
            rows.push({ left: line, right: '', type: 'delete' });
          }
        }
      } else if (chunk.added) {
        const lines = splitLines(chunk.value);
        for (const line of lines) {
          rows.push({ left: '', right: line, type: 'add' });
        }
      }
    }

    const lineBg = (type: string, side: 'left' | 'right') => {
      if (type === 'equal') return 'transparent';
      if (type === 'delete') return side === 'left' ? '#ffebe9' : '#f0f0f0';
      if (type === 'add') return side === 'left' ? '#f0f0f0' : '#dafbe1';
      if (type === 'change') return side === 'left' ? '#ffebe9' : '#dafbe1';
      return 'transparent';
    };

    const lineNumColor = '#6e7781';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height, border: '1px solid #d0d7de', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ display: 'flex', background: '#f6f8fa', borderBottom: '1px solid #d0d7de', fontSize: 12, fontWeight: 600, color: '#57606a', alignItems: 'center' }}>
          <div style={{ flex: 1, padding: '8px 12px', borderRight: '1px solid #d0d7de' }}>原始文档</div>
          <div style={{ flex: 1, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>修复后文档</span>
            {showFullscreen && (
              <Space>
                <Button type="link" size="small" icon={<EditOutlined />} onClick={() => { setDiffFullscreen(true); setIsEditing(true); setEditContent(fixedContent); }}>
                  编辑
                </Button>
                <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => handleCopy(fixedContent)}>
                  复制
                </Button>
              </Space>
            )}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', fontFamily: 'monospace', fontSize: 13, lineHeight: '20px' }}>
          {rows.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', minHeight: 20 }}>
              <div style={{ display: 'flex', flex: 1, background: lineBg(row.type, 'left'), borderRight: '1px solid #d0d7de' }}>
                <span style={{ width: 40, textAlign: 'right', paddingRight: 8, color: lineNumColor, userSelect: 'none', borderRight: '1px solid #d0d7de' }}>
                  {row.left !== '' ? idx + 1 : ''}
                </span>
                <span style={{ flex: 1, paddingLeft: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {row.left}
                </span>
              </div>
              <div style={{ display: 'flex', flex: 1, background: lineBg(row.type, 'right') }}>
                <span style={{ width: 40, textAlign: 'right', paddingRight: 8, color: lineNumColor, userSelect: 'none', borderRight: '1px solid #d0d7de' }}>
                  {row.right !== '' ? idx + 1 : ''}
                </span>
                <span style={{ flex: 1, paddingLeft: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {row.right}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const tabItems = [
    {
      key: 'preview',
      label: <span><FileSearchOutlined /> 文档预览</span>,
      children: loadingContent ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spin size="large" /></div>
      ) : (
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(docContent)} style={{ float: 'right' }} size="small">复制</Button>
          <div style={{ background: '#fff', padding: 16, borderRadius: 6, lineHeight: 1.6, marginTop: 8 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{docContent}</ReactMarkdown>
          </div>
        </div>
      ),
    },
    {
      key: 'original',
      label: <span><FileTextOutlined /> 原始文档</span>,
      children: (
        <div>
          <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(docContent)} style={{ float: 'right' }} size="small">复制</Button>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 'calc(100vh - 200px)', overflow: 'auto', background: '#fafafa', padding: 16, borderRadius: 6, fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>{docContent}</pre>
        </div>
      ),
    },
    {
      key: 'history',
      label: <span><HistoryOutlined /> 诊断历史</span>,
      children: (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <HistoryList documentPath={selectedDoc?.relativePath || ''} workDirectory={workDir} onSelectRecord={handleSelectRecord} selectedRecord={selectedRecord} />
          {selectedRecord && (
            <div style={{ flex: 1, marginTop: 16, overflow: 'auto' }}>
              <Tabs
                defaultActiveKey="report"
                items={[
                  {
                    key: 'report',
                    label: <span><FileTextOutlined /> 诊断报告</span>,
                    children: loadingDiagnose ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spin size="large" /></div> : (
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
                    children: loadingDiagnose ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spin size="large" /></div> : (
                      <div style={{ maxHeight: 'calc(100vh - 380px)', overflow: 'auto' }}>{renderSummary()}</div>
                    ),
                  },
                  {
                    key: 'fixed',
                    label: <span><EditOutlined /> 修复后文档</span>,
                    children: loadingDiagnose ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spin size="large" /></div> : (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, overflow: 'hidden' }}>{renderDiffView({ showFullscreen: true })}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'fixedPreview',
                    label: <span><EyeOutlined /> 修复后文档预览</span>,
                    children: loadingDiagnose ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spin size="large" /></div> : (
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
      label: <span><FileAddOutlined /> 生成诊断</span>,
      children: <PromptPanel documentPath={selectedDoc?.relativePath || ''} documentName={selectedDoc?.name || ''} />,
    },
  ];

  const docInfoCard = selectedDoc ? (
    <Card size="small" title={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FileTextOutlined /><span style={{ fontWeight: 500 }}>{selectedDoc.name}</span></div>} style={{ marginBottom: 16 }}>
      <div style={{ color: '#8c8c8c', fontSize: 12 }}>{selectedDoc.relativePath}</div>
    </Card>
  ) : null;

  const getLatestRecordForDoc = (node: DocNode): DiagnoseRecord | null => {
    if (!node.history || node.history.length === 0) return null;
    return [...node.history].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0] || null;
  };

  const handleNavToDoc = (node: DocNode) => {
    const latestRecord = getLatestRecordForDoc(node);
    setSelectedDoc(node);
    if (latestRecord) {
      setSelectedRecord(latestRecord);
      setActiveTab('report');
    } else {
      setSelectedRecord(null);
      setActiveTab('preview');
    }
  };

  const navItems = [
    { key: 'diagnose', label: '文档诊断' },
    { key: 'records', label: '最近记录' },
  ];

  const handleNavChange = (key: 'diagnose' | 'records') => {
    setCurrentNav(key);
    setSelectedDoc(null);
    setSelectedRecord(null);
  };

  const handleStartEdit = () => {
    setEditContent(fixedContent);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRecord) return;
    try {
      await saveFixedDoc(selectedRecord.fixedDocPath, editContent);
      setFixedContent(editContent);
      setIsEditing(false);
      message.success('修复后文档已保存');
    } catch (error) {
      console.error('Failed to save fixed doc:', error);
      message.error('保存失败');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 工作目录选择模态框 */}
      <Modal
        title="选择工作目录"
        open={showWorkDirModal}
        onCancel={() => workDir && setShowWorkDirModal(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: '16px 0' }}>
          <p>请选择项目根目录作为工作目录（包含 raw、timeline、report 等子目录）。</p>
          <p>当前工作目录：<strong>{workDir || '未设置'}</strong></p>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, marginBottom: 16 }}>
{`工作目录/
├── raw/        # 原始文档
├── timeline/   # 诊断过程记录
├── report/     # 诊断报告
└── new/        # 修复后文档`}
          </pre>
          <Button type="primary" icon={<FolderOpenOutlined />} onClick={handleSelectWorkDir} loading={selectingDir} block>
            选择工作目录
          </Button>
        </div>
      </Modal>

      {/* Diff 全屏模式 */}
      {diffFullscreen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{selectedDoc?.name} — {isEditing ? '编辑修复后文档' : isPreviewing ? '修复后文档预览' : '文档对比'}</h3>
            <Space>
              {isEditing ? (
                <>
                  <Button type="primary" onClick={handleSaveEdit}>保存</Button>
                  <Button onClick={handleCancelEdit}>取消</Button>
                </>
              ) : (
                <>
                  {isPreviewing ? (
                    <Button icon={<EditOutlined />} onClick={() => setIsPreviewing(false)}>返回对比</Button>
                  ) : (
                    <>
                      <Button icon={<EyeOutlined />} onClick={() => setIsPreviewing(true)}>预览</Button>
                      <Button type="primary" icon={<EditOutlined />} onClick={handleStartEdit}>编辑</Button>
                    </>
                  )}
                  <Button onClick={() => setDiffFullscreen(false)}>退出全屏</Button>
                </>
              )}
            </Space>
          </div>
          <div style={{ flex: 1, padding: 16, overflow: 'hidden' }}>
            {isEditing ? (
              <div style={{ display: 'flex', height: '100%', gap: 16 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #d0d7de', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', background: '#f6f8fa', borderBottom: '1px solid #d0d7de', fontSize: 12, fontWeight: 600, color: '#57606a' }}>原始文档（只读）</div>
                  <pre style={{ flex: 1, margin: 0, padding: 12, overflow: 'auto', fontFamily: 'monospace', fontSize: 13, lineHeight: '20px', background: '#fafafa', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{docContent}</pre>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #d0d7de', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', background: '#f6f8fa', borderBottom: '1px solid #d0d7de', fontSize: 12, fontWeight: 600, color: '#57606a' }}>修复后文档（编辑中）</div>
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} style={{ flex: 1, padding: 12, border: 'none', outline: 'none', resize: 'none', fontFamily: 'monospace', fontSize: 13, lineHeight: '20px', background: '#fff', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} />
                </div>
              </div>
            ) : isPreviewing ? (
              <div style={{ height: '100%', overflow: 'auto', background: '#fff', padding: 24, border: '1px solid #d0d7de', borderRadius: 6 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={markdownComponents}>{fixedContent}</ReactMarkdown>
              </div>
            ) : (
              renderDiffView({ height: '100%', showFullscreen: false })
            )}
          </div>
        </div>
      )}

      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 24 }}>
        <h2 style={{ margin: 0, lineHeight: '64px' }}>DocMan</h2>
        <Menu mode="horizontal" selectedKeys={[currentNav]} onClick={(e) => handleNavChange(e.key as 'diagnose' | 'records')} items={navItems} style={{ flex: 1, borderBottom: 'none' }} />
        {workDir && (
          <Button icon={<FolderOpenOutlined />} onClick={() => setShowWorkDirModal(true)} size="small">
            更换目录
          </Button>
        )}
      </Header>

      <Layout>
        {currentNav === 'diagnose' && (
          <>
            <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
              <div style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: 16 }}>帮助文档目录</h3>
                <DocTree onSelectDoc={handleSelectDoc} selectedDocPath={selectedDoc?.relativePath} defaultSelectFirst={true} />
              </div>
            </Sider>
            <Content style={{ background: '#fff', padding: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {docInfoCard}
              <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} style={{ flex: 1 }} />
            </Content>
          </>
        )}
        {currentNav === 'records' && (
          <Content style={{ background: '#fff', padding: 24, overflow: 'auto' }}>
            <h3 style={{ marginBottom: 16 }}>最近记录</h3>
            {loadingTree ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spin size="large" /></div>
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
                    render: (_: unknown, record: DocNode) => <Button type="link" onClick={() => handleNavToDoc(record)}>查看详情</Button>,
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