import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, message, Typography } from 'antd';
import { FolderOpenOutlined, ReloadOutlined } from '@ant-design/icons';
import { open } from '@tauri-apps/plugin-dialog';
import { getWorkDirectory, setWorkDirectory } from '../../services/api';

const { Text, Title } = Typography;

interface WorkDirSelectorProps {
  onWorkDirSet: () => void;
}

const WorkDirSelector: React.FC<WorkDirSelectorProps> = ({ onWorkDirSet }) => {
  const [visible, setVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWorkDir();
  }, []);

  const checkWorkDir = async () => {
    try {
      const path = await getWorkDirectory();
      if (path) {
        setCurrentPath(path);
        onWorkDirSet();
      } else {
        setVisible(true);
      }
    } catch (error) {
      console.error('Failed to check work dir:', error);
      setVisible(true);
    }
  };

  const handleSelectDir = async () => {
    setLoading(true);
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: '选择工作目录',
      });

      if (selected) {
        await setWorkDirectory(selected as string);
        setCurrentPath(selected as string);
        setVisible(false);
        onWorkDirSet();
        message.success('工作目录已设置');
      }
    } catch (error) {
      console.error('Failed to set work dir:', error);
      message.error('设置工作目录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeDir = async () => {
    setVisible(true);
  };

  if (!visible && currentPath) {
    return (
      <div style={{ padding: '8px 16px', background: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          <FolderOpenOutlined />
          <Text ellipsis style={{ maxWidth: 400 }} title={currentPath}>
            {currentPath}
          </Text>
        </Space>
        <Button type="link" size="small" icon={<ReloadOutlined />} onClick={handleChangeDir}>
          切换目录
        </Button>
      </div>
    );
  }

  return (
    <Modal
      title="选择工作目录"
      open={visible}
      closable={false}
      maskClosable={false}
      footer={null}
      width={500}
    >
      <div style={{ padding: '24px 0', textAlign: 'center' }}>
        <Title level={4}>欢迎使用 DocMan</Title>
        <Text type="secondary">请选择一个工作目录来存储文档和诊断结果</Text>
        <div style={{ marginTop: 24 }}>
          <Button
            type="primary"
            size="large"
            icon={<FolderOpenOutlined />}
            onClick={handleSelectDir}
            loading={loading}
          >
            选择目录
          </Button>
        </div>
        <div style={{ marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            工作目录应包含 raw/ 子目录，用于存放待诊断的文档
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default WorkDirSelector;