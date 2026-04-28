import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Input, message, Checkbox } from 'antd';
import { CopyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { DiagnoseDimension, GeneratePromptResponse } from '../../types';
import { generatePrompt, getDimensions } from '../../services/api';

const { TextArea } = Input;

interface PromptPreviewProps {
  visible: boolean;
  documentPath: string;
  documentName: string;
  onClose: () => void;
}

const PromptPreview: React.FC<PromptPreviewProps> = ({ visible, documentPath, documentName, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState<DiagnoseDimension[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<number[]>([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [promptResult, setPromptResult] = useState<GeneratePromptResponse | null>(null);

  useEffect(() => {
    if (visible) {
      loadDimensions();
      setPromptResult(null);
    }
  }, [visible]);

  const loadDimensions = async () => {
    try {
      const data = await getDimensions();
      setDimensions(data);
      setSelectedDimensions(data.map(d => d.id)); // 默认全选
    } catch (error) {
      console.error('Failed to load dimensions:', error);
    }
  };

  const handleGenerate = async () => {
    if (!documentPath) {
      message.error('请选择文档');
      return;
    }

    setLoading(true);
    try {
      const result = await generatePrompt({
        documentPath,
        targetUrl: targetUrl || undefined,
        customCheckRequirements: customRequirements || undefined,
        focusDimensions: selectedDimensions.length === dimensions.length ? undefined : selectedDimensions,
      });
      setPromptResult(result);
    } catch (error) {
      message.error('生成Prompt失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (promptResult?.prompt) {
      navigator.clipboard.writeText(promptResult.prompt);
      message.success('Prompt已复制到剪贴板');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDimensions(dimensions.map(d => d.id));
    } else {
      setSelectedDimensions([]);
    }
  };

  return (
    <Modal
      title={`生成诊断Prompt - ${documentName}`}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 目标URL */}
        <div>
          <div style={{ marginBottom: 8 }}>目标系统URL（可选）</div>
          <Input
            placeholder="如: https://console.bce.baidu.com/aihc/datasets"
            value={targetUrl}
            onChange={e => setTargetUrl(e.target.value)}
          />
        </div>

        {/* 自定义检查要求 */}
        <div>
          <div style={{ marginBottom: 8 }}>自定义检查要求（可选）</div>
          <TextArea
            rows={2}
            placeholder="如: 重点检查菜单文案是否与系统一致"
            value={customRequirements}
            onChange={e => setCustomRequirements(e.target.value)}
          />
        </div>

        {/* 诊断维度选择 */}
        <div>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>诊断维度（{selectedDimensions.length}/{dimensions.length}）</span>
            <Checkbox
              checked={selectedDimensions.length === dimensions.length}
              onChange={e => handleSelectAll(e.target.checked)}
            >
              全选
            </Checkbox>
          </div>
          <Checkbox.Group
            value={selectedDimensions}
            onChange={(values) => setSelectedDimensions(values as number[])}
            style={{ width: '100%' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {dimensions.map(dim => (
                <Checkbox key={dim.id} value={dim.id}>
                  {dim.id}. {dim.name}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        {/* 生成按钮 */}
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleGenerate}
          loading={loading}
          block
        >
          生成诊断Prompt
        </Button>

        {/* Prompt结果 */}
        {promptResult && (
          <div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>生成的Prompt</span>
              <Button
                type="link"
                icon={<CopyOutlined />}
                onClick={handleCopy}
              >
                复制
              </Button>
            </div>
            <TextArea
              rows={12}
              value={promptResult.prompt}
              readOnly
              style={{ fontFamily: 'monospace' }}
            />
          </div>
        )}
      </Space>
    </Modal>
  );
};

export default PromptPreview;