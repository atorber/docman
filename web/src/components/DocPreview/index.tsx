import React, { useEffect, useState } from 'react';
import { Spin, Empty, Button, Card, Tabs, message } from 'antd';
import { FileTextOutlined, CopyOutlined, FileSearchOutlined, EditOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDocumentContent, getFixedDoc } from '../../services/api';
import { DiagnoseRecord } from '../../types';

interface DocPreviewProps {
  documentPath: string;
  documentName: string;
  selectedRecord?: DiagnoseRecord | null;
}

const DocPreview: React.FC<DocPreviewProps> = ({ documentPath, documentName, selectedRecord }) => {
  const [loading, setLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [fixedContent, setFixedContent] = useState('');
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    if (documentPath) {
      loadContent();
    }
  }, [documentPath]);

  useEffect(() => {
    if (selectedRecord) {
      loadFixedContent();
      setActiveTab('fixed');
    }
  }, [selectedRecord]);

  const loadContent = async () => {
    if (!documentPath) return;
    setLoading(true);
    try {
      const text = await getDocumentContent(documentPath);
      setOriginalContent(text);
    } catch (error) {
      console.error('Failed to load document:', error);
      setOriginalContent('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const loadFixedContent = async () => {
    if (!selectedRecord?.fixedDocPath) return;
    try {
      const text = await getFixedDoc(selectedRecord.fixedDocPath);
      setFixedContent(text);
    } catch (error) {
      console.error('Failed to load fixed document:', error);
      setFixedContent('加载失败');
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    message.success('已复制到剪贴板');
  };

  if (!documentPath) {
    return <Empty description="请选择左侧文档" />;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'preview',
      label: (
        <span>
          <FileSearchOutlined /> 文档预览
        </span>
      ),
      children: (
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
          <Button
            type="link"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(originalContent)}
            style={{ float: 'right' }}
            size="small"
          >
            复制
          </Button>
          <div
            style={{
              background: '#fff',
              padding: 16,
              borderRadius: 6,
              lineHeight: 1.6,
              marginTop: 8,
            }}
          >
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
              {originalContent}
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
            onClick={() => handleCopy(originalContent)}
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
            {originalContent}
          </pre>
        </div>
      ),
    },
  ];

  if (selectedRecord) {
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
            {fixedContent || '暂无修复后的文档'}
          </pre>
        </div>
      ),
    });
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Card
        size="small"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined />
            <span style={{ fontWeight: 500 }}>{documentName}</span>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <div style={{ color: '#8c8c8c', fontSize: 12 }}>{documentPath}</div>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ flex: 1 }}
      />
    </div>
  );
};

export default DocPreview;