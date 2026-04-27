import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, message, Tabs, Spin, Card } from 'antd';
import { FileTextOutlined, HistoryOutlined, FileSearchOutlined, CopyOutlined, EditOutlined, FileAddOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DocTree from '../components/DocTree';
import HistoryList from '../components/HistoryList';
import DiagnosePanel from '../components/DiagnosePanel';
import PromptPanel from '../components/PromptPanel';
import { getDocumentContent, getFixedDoc } from '../services/api';
import { DocNode, DiagnoseRecord } from '../types';

const { Header, Sider, Content } = Layout;

const Home: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocNode | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiagnoseRecord | null>(null);
  const [activeTab, setActiveTab] = useState('preview');

  // 文档内容
  const [docContent, setDocContent] = useState('');
  const [fixedContent, setFixedContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    if (selectedDoc) {
      loadDocContent();
    }
  }, [selectedDoc]);

  useEffect(() => {
    if (selectedRecord) {
      loadFixedContent();
    }
  }, [selectedRecord]);

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

  const loadFixedContent = async () => {
    if (!selectedRecord?.fixedDocPath) return;
    try {
      const content = await getFixedDoc(selectedRecord.fixedDocPath);
      setFixedContent(content);
    } catch (e) {
      console.error('Failed to load fixed:', e);
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => (
                  <img
                    {...props}
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: 400, objectFit: 'contain' }}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div style={{ overflowX: 'auto' }}>
                    <table {...props} style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th {...props} style={{ border: '1px solid #d9d9d9', padding: '8px 12px', background: '#fafafa', fontWeight: 600, textAlign: 'left' }} />
                ),
                td: ({ node, ...props }) => (
                  <td {...props} style={{ border: '1px solid #d9d9d9', padding: '8px 12px' }} />
                ),
              }}
            >
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
              <DiagnosePanel record={selectedRecord} />
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

  // 如果有修复后的文档，添加Tab
  if (selectedRecord && fixedContent) {
    tabItems.push({
      key: 'fixed',
      label: (
        <span>
          <EditOutlined /> 修复后文档
        </span>
      ),
      children: (
        <div>
          <Button
            type="link"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(fixedContent)}
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
              background: '#f0f8ff',
              padding: 16,
              borderRadius: 6,
              fontSize: 13,
              lineHeight: 1.6,
              marginTop: 8,
            }}
          >
            {fixedContent}
          </pre>
        </div>
      ),
    });
  }

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
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ margin: 0, line: '40px' }}>文档诊断工具</h2>
      </Header>
      <Layout>
        {/* 左侧：文档目录 */}
        <Sider width={280} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: 16 }}>文档目录</h3>
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
      </Layout>
    </Layout>
  );
};

export default Home;