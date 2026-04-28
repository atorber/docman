import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Input, Button, Space, message, Spin, Collapse, Tag } from 'antd';
import { CopyOutlined, FileAddOutlined } from '@ant-design/icons';
import { generatePrdPrompt, getPrdPerspectives, getPrdDimensions } from '../../services/api';
import { PrdPerspective, PrdDimension } from '../../types';

const { TextArea } = Input;
const { Panel } = Collapse;

interface PrdPromptPanelProps {
  documentPath: string;
  documentName: string;
}

const PrdPromptPanel: React.FC<PrdPromptPanelProps> = ({ documentPath }) => {
  const [loading, setLoading] = useState(false);
  const [perspectives, setPerspectives] = useState<PrdPerspective[]>([]);
  const [dimensions, setDimensions] = useState<PrdDimension[]>([]);
  const [selectedPerspectives, setSelectedPerspectives] = useState<string[]>([]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [projectBackground, setProjectBackground] = useState('');
  const [techStack, setTechStack] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [perspectivesData, dimensionsData] = await Promise.all([
        getPrdPerspectives(),
        getPrdDimensions(),
      ]);
      setPerspectives(perspectivesData);
      setDimensions(dimensionsData);
      // 默认全选
      setSelectedPerspectives(perspectivesData.map(p => p.id));
      setSelectedDimensions(dimensionsData.map(d => d.id));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePerspectiveChange = (perspectiveId: string, checked: boolean) => {
    const perspectiveDims = dimensions.filter(d => d.perspective === perspectiveId).map(d => d.id);
    
    if (checked) {
      setSelectedPerspectives([...selectedPerspectives, perspectiveId]);
      setSelectedDimensions([...new Set([...selectedDimensions, ...perspectiveDims])]);
    } else {
      setSelectedPerspectives(selectedPerspectives.filter(id => id !== perspectiveId));
      setSelectedDimensions(selectedDimensions.filter(id => !perspectiveDims.includes(id)));
    }
  };

  const handleDimensionChange = (dimensionId: string, checked: boolean) => {
    if (checked) {
      setSelectedDimensions([...selectedDimensions, dimensionId]);
    } else {
      setSelectedDimensions(selectedDimensions.filter(id => id !== dimensionId));
    }
  };

  const handleGenerate = async () => {
    if (!documentPath) {
      message.warning('请先选择文档');
      return;
    }

    setLoading(true);
    try {
      const result = await generatePrdPrompt({
        documentPath,
        perspectives: selectedPerspectives,
        focusDimensions: selectedDimensions,
        projectBackground: projectBackground || undefined,
        techStack: techStack || undefined,
        customRequirements: customRequirements || undefined,
      });
      setPrompt(result.prompt);
      setGenerated(true);
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      message.error('生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    message.success('已复制到剪贴板');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      default: return 'blue';
    }
  };

  if (loading && perspectives.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Card title="评审视角与维度" size="small">
        <Collapse defaultActiveKey={perspectives.map(p => p.id)}>
          {perspectives.map(perspective => {
            const perspectiveDims = dimensions.filter(d => d.perspective === perspective.id);
            const allSelected = perspectiveDims.every(d => selectedDimensions.includes(d.id));
            const someSelected = perspectiveDims.some(d => selectedDimensions.includes(d.id));

            return (
              <Panel
                header={
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    onChange={(e) => handlePerspectiveChange(perspective.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {perspective.name} ({perspective.dimensionCount}个维度)
                  </Checkbox>
                }
                key={perspective.id}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {perspectiveDims.map(dim => (
                    <Checkbox
                      key={dim.id}
                      checked={selectedDimensions.includes(dim.id)}
                      onChange={(e) => handleDimensionChange(dim.id, e.target.checked)}
                    >
                      <Space>
                        <Tag color={getPriorityColor(dim.priority)}>{dim.id}</Tag>
                        <span>{dim.name}</span>
                      </Space>
                    </Checkbox>
                  ))}
                </div>
              </Panel>
            );
          })}
        </Collapse>
      </Card>

      <Card title="评审配置" size="small">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <div style={{ marginBottom: 4, fontWeight: 500 }}>项目背景（可选）</div>
            <TextArea
              placeholder="描述项目背景、业务场景等上下文信息..."
              value={projectBackground}
              onChange={(e) => setProjectBackground(e.target.value)}
              rows={2}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontWeight: 500 }}>技术栈信息（可选）</div>
            <Input
              placeholder="如：后端 Java Spring Boot, 前端 React, 数据库 MySQL"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
            />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontWeight: 500 }}>自定义评审要求（可选）</div>
            <TextArea
              placeholder="额外的评审关注点..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              rows={2}
            />
          </div>
        </Space>
      </Card>

      <Button
        type="primary"
        icon={<FileAddOutlined />}
        onClick={handleGenerate}
        loading={loading}
        size="large"
      >
        生成评审Prompt
      </Button>

      {generated && (
        <Card
          title="生成的 Prompt"
          size="small"
          extra={
            <Button type="link" icon={<CopyOutlined />} onClick={handleCopy}>
              复制
            </Button>
          }
        >
          <pre style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#f6f8fa',
            padding: 16,
            borderRadius: 6,
            maxHeight: 400,
            overflow: 'auto',
            fontSize: 13,
            lineHeight: 1.6,
          }}>
            {prompt}
          </pre>
        </Card>
      )}
    </div>
  );
};

export default PrdPromptPanel;