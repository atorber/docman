import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Button, Space, message, Tabs, Spin, Card, Tag, Empty, Table, Select } from 'antd';
import { FileTextOutlined, HistoryOutlined, FileSearchOutlined, CopyOutlined, EditOutlined, FileAddOutlined, DashboardOutlined, EyeOutlined, CheckCircleOutlined, AppstoreOutlined, RocketOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import * as Diff from 'diff';
import DocTree from '../components/DocTree';
import HistoryList from '../components/HistoryList';
import PromptPanel from '../components/PromptPanel';
import DocGeneratorPanel from '../components/DocGeneratorPanel';
import PrdGeneratorPanel from '../components/PrdGeneratorPanel';
import PrdTree from '../components/PrdTree';
import MainNavHeader, { MainNavKey } from '../components/MainNavHeader';
import { getDocumentContent, getReport, getTimeline, getFixedDoc, getDocTree, saveFixedDoc, getRecentRecords } from '../services/api';
import { DocNode, DiagnoseRecord, TimelineData, RecentRecordItem, PrdDocNode } from '../types';

const { Sider, Content } = Layout;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [selectedDoc, setSelectedDoc] = useState<DocNode | null>(null);
  const [selectedPrdDoc, setSelectedPrdDoc] = useState<PrdDocNode | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiagnoseRecord | null>(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [docTree, setDocTree] = useState<DocNode[]>([]);
  const [recentRecords, setRecentRecords] = useState<RecentRecordItem[]>([]);
  const [loadingRecentRecords, setLoadingRecentRecords] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<'all' | RecentRecordItem['source']>('all');
  const [initialLoadDone, setInitialLoadDone] = useState(false);

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

  // URL同步：使用 react-router 的 searchParams
  const docPath = searchParams.get('doc') || undefined;
  const recordPath = searchParams.get('record') || undefined;
  const navQuery = searchParams.get('nav');

  // 主导航：Home 仅挂载在 /、/diagnose、/records、/docgen；PRD 生成通过 ?nav=prdgen（与 PrdGenPage 重定向一致）
  const currentNav: 'diagnose' | 'records' | 'docgen' | 'prdgen' =
    location.pathname === '/records'
      ? 'records'
      : location.pathname === '/docgen'
        ? 'docgen'
        : (location.pathname === '/' || location.pathname === '/diagnose') && navQuery === 'prdgen'
          ? 'prdgen'
          : 'diagnose';

  // 更新URL参数
  const updateUrl = (doc?: DocNode, record?: DiagnoseRecord) => {
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
          // 查找对应的诊断记录
          const findRecord = (nodes: DocNode[]): DiagnoseRecord | null => {
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
            setActiveTab('report');
          }
        } else if (docPath) {
          // 查找对应文档
          const findDoc = (nodes: DocNode[]): DocNode | null => {
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
            setActiveTab('preview');
          }
        }
      }
      setInitialLoadDone(true);
    };
    initFromUrl();
  }, [docPath, recordPath, docTree]); // 依赖URL参数变化

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
      loadRecentRecordList();
    }
  }, [currentNav]);

  const loadDocTree = async (): Promise<DocNode[]> => {
    try {
      const data = await getDocTree();
      setDocTree(data);
      return data;
    } catch (e) {
      console.error('Failed to load doc tree:', e);
      return [];
    }
  };

  const loadRecentRecordList = async () => {
    setLoadingRecentRecords(true);
    try {
      const data = await getRecentRecords();
      setRecentRecords(data);
    } catch (e) {
      console.error('Failed to load recent records:', e);
      setRecentRecords([]);
    } finally {
      setLoadingRecentRecords(false);
    }
  };

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
    // 更新URL（跳过初始化时的更新）
    if (initialLoadDone) {
      updateUrl(node, undefined);
    }
  };

  const handleSelectDocForDocGen = (node: DocNode) => {
    setSelectedDoc(node);
  };

  const handleSelectPrdDocForPrdGen = (node: PrdDocNode) => {
    setSelectedPrdDoc(node);
  };

  const handleSelectRecord = (record: DiagnoseRecord) => {
    setSelectedRecord(record);
    // 更新URL（跳过初始化时的更新）
    if (initialLoadDone) {
      updateUrl(record.doc, record);
    }
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

  // Diff 对比视图渲染
  const renderDiffView = (opts?: { height?: string; showFullscreen?: boolean }) => {
    const height = opts?.height ?? 'calc(100vh - 380px)';
    const showFullscreen = opts?.showFullscreen ?? false;

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
        {/* Header */}
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
                  复制修复后文档
                </Button>
                <Button type="link" size="small" onClick={() => setDiffFullscreen(true)}>
                  全屏查看
                </Button>
              </Space>
            )}
          </div>
        </div>
        {/* Diff rows */}
        <div style={{ flex: 1, overflow: 'auto', fontFamily: 'monospace', fontSize: 13, lineHeight: '20px' }}>
          {rows.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', minHeight: 20 }}>
              {/* Left side */}
              <div style={{ display: 'flex', flex: 1, background: lineBg(row.type, 'left'), borderRight: '1px solid #d0d7de' }}>
                <span style={{ width: 40, textAlign: 'right', paddingRight: 8, color: lineNumColor, userSelect: 'none', borderRight: '1px solid #d0d7de' }}>
                  {row.left !== '' ? idx + 1 : ''}
                </span>
                <span style={{ flex: 1, paddingLeft: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {row.left}
                </span>
              </div>
              {/* Right side */}
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
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          {renderDiffView({ showFullscreen: true })}
                        </div>
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
          <FileAddOutlined /> 生成诊断Prompt
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

  const handleViewRecentRecord = (record: RecentRecordItem) => {
    if (record.source === 'prdreview') {
      const params = new URLSearchParams();
      if (record.docPath) params.set('doc', record.docPath.replace(/^prd\//, ''));
      params.set('record', record.timelinePath);
      navigate(`/prd-review?${params.toString()}`);
      return;
    }

    if (record.source === 'diagnose') {
      const params = new URLSearchParams();
      if (record.docPath) params.set('doc', record.docPath);
      params.set('record', record.timelinePath);
      navigate(`/?${params.toString()}`);
      return;
    }

    if (record.source === 'docgen') {
      navigate('/docgen');
      return;
    }

    navigate('/?nav=prdgen');
  };

  const getSourceIcon = (source: RecentRecordItem['source']) => {
    switch (source) {
      case 'diagnose':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'docgen':
        return <FileTextOutlined style={{ color: '#52c41a' }} />;
      case 'prdgen':
        return <RocketOutlined style={{ color: '#722ed1' }} />;
      case 'prdreview':
        return <AppstoreOutlined style={{ color: '#fa8c16' }} />;
      default:
        return <HistoryOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const filteredRecentRecords = sourceFilter === 'all'
    ? recentRecords
    : recentRecords.filter((item) => item.source === sourceFilter);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Tab切换时更新URL
    const params = new URLSearchParams(searchParams);
    params.set('tab', key);
    navigate(`?${params.toString()}`, { replace: true });
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
      {diffFullscreen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>
              {selectedDoc?.name} — {isEditing ? '编辑修复后文档' : isPreviewing ? '修复后文档预览' : '文档对比'}
            </h3>
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
                {/* 左侧：原文档（只读） */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #d0d7de', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', background: '#f6f8fa', borderBottom: '1px solid #d0d7de', fontSize: 12, fontWeight: 600, color: '#57606a' }}>原始文档（只读）</div>
                  <pre style={{ flex: 1, margin: 0, padding: 12, overflow: 'auto', fontFamily: 'monospace', fontSize: 13, lineHeight: '20px', background: '#fafafa', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {docContent}
                  </pre>
                </div>
                {/* 右侧：修复后文档（可编辑） */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #d0d7de', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', background: '#f6f8fa', borderBottom: '1px solid #d0d7de', fontSize: 12, fontWeight: 600, color: '#57606a' }}>修复后文档（编辑中）</div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    style={{ flex: 1, padding: 12, border: 'none', outline: 'none', resize: 'none', fontFamily: 'monospace', fontSize: 13, lineHeight: '20px', background: '#fff', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  />
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
      <MainNavHeader selectedKey={currentNav as MainNavKey} />
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
                onChange={handleTabChange}
                items={tabItems}
                style={{ flex: 1 }}
              />
            </Content>
          </>
        )}
        {currentNav === 'docgen' && (
          <>
            <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
              <div style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: 16 }}>帮助文档目录</h3>
                <DocTree onSelectDoc={handleSelectDocForDocGen} selectedDocPath={selectedDoc?.relativePath} defaultSelectFirst={false} />
              </div>
            </Sider>
            <Content style={{ background: '#fff', overflow: 'hidden' }}>
              <DocGeneratorPanel />
            </Content>
          </>
        )}
        {currentNav === 'prdgen' && (
          <>
            <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
              <div style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: 16 }}>PRD文档目录</h3>
                <PrdTree onSelectDoc={handleSelectPrdDocForPrdGen} selectedDocPath={selectedPrdDoc?.relativePath} defaultSelectFirst={false} />
              </div>
            </Sider>
            <Content style={{ background: '#fff', overflow: 'hidden' }}>
              <PrdGeneratorPanel />
            </Content>
          </>
        )}
        {currentNav === 'records' && (
          <Content style={{ background: '#fff', padding: 24, overflow: 'auto' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>最近记录</h3>
              <Space size={8}>
                <span style={{ color: '#8c8c8c', fontSize: 13 }}>来源筛选</span>
                <Select
                  value={sourceFilter}
                  onChange={(value) => setSourceFilter(value)}
                  style={{ width: 180 }}
                  options={[
                    { value: 'all', label: '全部来源' },
                    { value: 'diagnose', label: '帮助文档诊断' },
                    { value: 'docgen', label: '帮助文档生成' },
                    { value: 'prdgen', label: 'PRD生成' },
                    { value: 'prdreview', label: 'PRD评审' },
                  ]}
                />
              </Space>
            </div>
            {loadingRecentRecords ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <Spin size="large" />
              </div>
            ) : (
              <Table
                dataSource={filteredRecentRecords}
                columns={[
                  {
                    title: '来源',
                    dataIndex: 'sourceLabel',
                    key: 'sourceLabel',
                    width: 160,
                    render: (_, record) => (
                      <Space size={6}>
                        {getSourceIcon(record.source)}
                        <span>{record.sourceLabel}</span>
                      </Space>
                    ),
                  },
                  { title: '记录名称', dataIndex: 'name', key: 'name' },
                  { title: '路径', dataIndex: 'path', key: 'path' },
                  { title: '最近时间', dataIndex: 'timestamp', key: 'timestamp', width: 180 },
                  {
                    title: '操作',
                    key: 'action',
                    render: (_, record) => (
                      <Button type="link" onClick={() => handleViewRecentRecord(record)}>
                        查看详情
                      </Button>
                    ),
                  },
                ]}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: '暂无最近记录' }}
              />
            )}
          </Content>
        )}
      </Layout>
    </Layout>
  );
};

export default Home;