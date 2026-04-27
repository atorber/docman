import React, { useState } from 'react';
import { Layout, Button, Space, message } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import DocTree from '../components/DocTree';
import HistoryList from '../components/HistoryList';
import DiagnosePanel from '../components/DiagnosePanel';
import PromptPreview from '../components/PromptPreview';
import { DocNode, DiagnoseRecord } from '../types';

const { Header, Sider, Content } = Layout;

const Home: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<DocNode | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<DiagnoseRecord | null>(null);
  const [promptModalVisible, setPromptModalVisible] = useState(false);

  const handleSelectDoc = (node: DocNode) => {
    setSelectedDoc(node);
    setSelectedRecord(null); // 切换文档时清空选中的记录
  };

  const handleSelectRecord = (record: DiagnoseRecord) => {
    setSelectedRecord(record);
  };

  const handleGeneratePrompt = () => {
    if (!selectedDoc) {
      message.warning('请先选择左侧文档');
      return;
    }
    setPromptModalVisible(true);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ margin: 0 }}>文档诊断工具</h2>
        <Space>
          <Button
            type="primary"
            icon={<FileAddOutlined />}
            onClick={handleGeneratePrompt}
            disabled={!selectedDoc}
          >
            生成诊断Prompt
          </Button>
        </Space>
      </Header>
      <Layout>
        <Sider width={300} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <h3 style={{ marginBottom: 16 }}>文档目录</h3>
            <DocTree onSelectDoc={handleSelectDoc} selectedDocPath={selectedDoc?.relativePath} />
          </div>
        </Sider>
        <Sider width={320} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: 16, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <h3 style={{ marginBottom: 16 }}>诊断历史</h3>
            <HistoryList
              documentPath={selectedDoc?.relativePath || ''}
              onSelectRecord={handleSelectRecord}
              selectedRecord={selectedRecord}
            />
          </div>
        </Sider>
        <Content style={{ background: '#fff', padding: 16 }}>
          <DiagnosePanel record={selectedRecord} />
        </Content>
      </Layout>

      <PromptPreview
        visible={promptModalVisible}
        documentPath={selectedDoc?.relativePath || ''}
        documentName={selectedDoc?.name || ''}
        onClose={() => setPromptModalVisible(false)}
      />
    </Layout>
  );
};

export default Home;