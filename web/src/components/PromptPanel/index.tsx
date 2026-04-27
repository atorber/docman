import React, { useState } from 'react';
import { Button, Space, Input, Select, Spin, message, Checkbox } from 'antd';
import { PlayCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { getDimensions, generatePrompt } from '../../services/api';
import { DiagnoseDimension } from '../../types';

interface PromptPanelProps {
  documentPath: string;
  documentName: string;
}

const { TextArea } = Input;

const PromptPanel: React.FC<PromptPanelProps> = ({ documentPath, documentName }) => {
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState<DiagnoseDimension[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<number[]>([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [useLoggedInBrowser, setUseLoggedInBrowser] = useState(true);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // 加载诊断维度
  React.useEffect(() => {
    loadDimensions();
  }, []);

  const loadDimensions = async () => {
    try {
      const data = await getDimensions();
      setDimensions(data);
      setSelectedDimensions(data.map(d => d.id));
    } catch (e) {
      console.error('Failed to load dimensions:', e);
    }
  };

  const handleGenerate = async () => {
    if (!documentPath) {
      message.warning('请先选择文档');
      return;
    }
    setLoading(true);
    try {
      const result = await generatePrompt({
        documentPath,
        targetUrl: targetUrl || undefined,
        customCheckRequirements: customRequirements || undefined,
        focusDimensions: selectedDimensions.length === dimensions.length ? undefined : selectedDimensions,
        useLoggedInBrowser: targetUrl ? useLoggedInBrowser : false,
      });
      setGeneratedPrompt(result.prompt);
    } catch (e) {
      message.error('生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      message.success('已复制');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedDimensions(checked ? dimensions.map(d => d.id) : []);
  };

  if (!documentPath) {
    return <div style={{ color: '#8c8c8c', textAlign: 'center', marginTop: 40 }}>请先选择文档</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 目标URL */}
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>目标系统URL（可选）</div>
          <Input
            placeholder="如: https://console.bce.baidu.com/aihc/datasets"
            value={targetUrl}
            onChange={e => setTargetUrl(e.target.value)}
          />
        </div>

        {/* 浏览器配置 */}
        {targetUrl && (
          <div>
            <Checkbox
              checked={useLoggedInBrowser}
              onChange={e => setUseLoggedInBrowser(e.target.checked)}
            >
              使用已登录浏览器（推荐）
            </Checkbox>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4, marginLeft: 24 }}>
              勾选后将复用已有的浏览器窗口，无需重复登录。请保持浏览器窗口打开状态。
            </div>
          </div>
        )}

        {/* 自定义检查要求 */}
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>自定义检查要求（可选）</div>
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
            <span style={{ fontWeight: 500 }}>诊断维度（{selectedDimensions.length}/{dimensions.length}）</span>
            <Checkbox
              checked={selectedDimensions.length === dimensions.length}
              onChange={e => handleSelectAll(e.target.checked)}
            >
              全选
            </Checkbox>
          </div>
          <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #f0f0f0', borderRadius: 6, padding: 8 }}>
            <Checkbox.Group
              value={selectedDimensions}
              onChange={(values) => setSelectedDimensions(values as number[])}
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

        {/* 生成的Prompt */}
        {generatedPrompt && (
          <div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>生成的Prompt</span>
              <Button type="link" icon={<CopyOutlined />} onClick={handleCopy}>
                复制
              </Button>
            </div>
            <TextArea
              rows={15}
              value={generatedPrompt}
              readOnly
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </div>
        )}
      </Space>
    </div>
  );
};

export default PromptPanel;