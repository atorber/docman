import React, { useState, useEffect } from 'react';
import { Button, Space, Input, Select, message, Card, Divider, Alert } from 'antd';
import { PlayCircleOutlined, CopyOutlined, FileTextOutlined, AppstoreOutlined, PlusOutlined, LinkOutlined, UserOutlined, TagsOutlined } from '@ant-design/icons';
import { getRequirementTypes, generatePrdGenPrompt } from '../../services/api';
import { RequirementTypeOption } from '../../types';

const { TextArea } = Input;

const PrdGeneratorPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [requirementTypes, setRequirementTypes] = useState<RequirementTypeOption[]>([]);

  // 表单状态
  const [type, setType] = useState<string>('新功能');
  const [productName, setProductName] = useState('');
  const [title, setTitle] = useState('');
  const [initialPrdPath, setInitialPrdPath] = useState('');
  const [description, setDescription] = useState('');
  const [userPersona, setUserPersona] = useState('');
  const [competitiveLinks, setCompetitiveLinks] = useState<string[]>(['']);
  const [referenceDocs, setReferenceDocs] = useState<string[]>(['']);
  const [outputPath, setOutputPath] = useState('');

  // 高级选项展开状态
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 生成的Prompt
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // 加载选项
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const types = await getRequirementTypes();
      setRequirementTypes(types);
    } catch (e) {
      console.error('Failed to load options:', e);
    }
  };

  const handleGenerate = async () => {
    if (!productName) {
      message.warning('请输入产品名称');
      return;
    }
    if (!title) {
      message.warning('请输入需求标题');
      return;
    }
    if (!description) {
      message.warning('请输入需求描述');
      return;
    }

    setLoading(true);
    try {
      const result = await generatePrdGenPrompt({
        type: type as '新功能' | '功能优化' | '重构' | '修复',
        productName,
        title,
        description,
        initialPrdPath: initialPrdPath || undefined,
        userPersona: userPersona || undefined,
        competitiveLinks: competitiveLinks.filter(l => l.trim()) || undefined,
        referenceDocs: referenceDocs.filter(d => d.trim()) || undefined,
        outputPath: outputPath || undefined,
      });
      setGeneratedPrompt(result.prompt);
      message.success('Prompt生成成功');
    } catch (e) {
      message.error('生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      message.success('已复制到剪贴板');
    }
  };

  const handleAddCompetitiveLink = () => {
    setCompetitiveLinks([...competitiveLinks, '']);
  };

  const handleRemoveCompetitiveLink = (index: number) => {
    setCompetitiveLinks(competitiveLinks.filter((_, i) => i !== index));
  };

  const handleAddReferenceDoc = () => {
    setReferenceDocs([...referenceDocs, '']);
  };

  const handleRemoveReferenceDoc = (index: number) => {
    setReferenceDocs(referenceDocs.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: 24, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 说明 */}
        <Alert
          message="PRD生成工具"
          description="根据需求描述、竞品分析等信息，自动生成完整的产品需求文档(PRD)。支持交互式确认和多轮迭代完善。"
          type="info"
          showIcon
        />

        {/* 基础信息 */}
        <Card title={<span><FileTextOutlined /> 基础信息</span>} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 需求类型 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                需求类型 <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <Select
                value={type}
                onChange={setType}
                style={{ width: '100%' }}
                options={requirementTypes.map(t => ({
                  value: t.value,
                  label: (
                    <div>
                      <div>{t.label}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{t.description}</div>
                    </div>
                  ),
                }))}
              />
            </div>

            {/* 产品名称 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                产品名称 <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <Input
                placeholder="如: AIHC智能计算平台"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                prefix={<AppstoreOutlined />}
              />
            </div>

            {/* 需求标题 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                需求标题 <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <Input
                placeholder="如: 数据集管理功能"
                value={title}
                onChange={e => setTitle(e.target.value)}
                prefix={<FileTextOutlined />}
              />
            </div>

            {/* 需求描述 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                需求描述 <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <TextArea
                placeholder="详细描述需求背景、目标和核心功能..."
                rows={6}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* 初始PRD路径 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>初始PRD路径</div>
              <Input
                placeholder="如: prd/initial_prd.md (可选)"
                value={initialPrdPath}
                onChange={e => setInitialPrdPath(e.target.value)}
                prefix={<FileTextOutlined />}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                如果已有简单的PRD，可以提供路径
              </div>
            </div>
          </Space>
        </Card>

        {/* 高级选项 */}
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setShowAdvanced(!showAdvanced)}>
              <span><TagsOutlined /> 高级选项</span>
              <PlusOutlined style={{ transform: showAdvanced ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
            </div>
          }
          size="small"
        >
          {showAdvanced && (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {/* 用户画像 */}
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>用户画像</div>
                <Input
                  placeholder="描述目标用户群体，如: 数据科学家、算法工程师"
                  value={userPersona}
                  onChange={e => setUserPersona(e.target.value)}
                  prefix={<UserOutlined />}
                />
              </div>

              {/* 竞品链接 */}
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>竞品链接</div>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {competitiveLinks.map((link, index) => (
                    <Input
                      key={index}
                      placeholder="竞品产品文档URL"
                      value={link}
                      onChange={e => {
                        const newLinks = [...competitiveLinks];
                        newLinks[index] = e.target.value;
                        setCompetitiveLinks(newLinks);
                      }}
                      prefix={<LinkOutlined />}
                      suffix={
                        competitiveLinks.length > 1 && (
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => handleRemoveCompetitiveLink(index)}
                          >
                            删除
                          </Button>
                        )
                      }
                    />
                  ))}
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={handleAddCompetitiveLink}
                    style={{ width: '100%' }}
                  >
                    添加竞品链接
                  </Button>
                </Space>
              </div>

              {/* 参考文档 */}
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>参考文档</div>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {referenceDocs.map((doc, index) => (
                    <Input
                      key={index}
                      placeholder="参考文档路径或URL"
                      value={doc}
                      onChange={e => {
                        const newDocs = [...referenceDocs];
                        newDocs[index] = e.target.value;
                        setReferenceDocs(newDocs);
                      }}
                      prefix={<FileTextOutlined />}
                      suffix={
                        referenceDocs.length > 1 && (
                          <Button
                            type="text"
                            danger
                            size="small"
                            onClick={() => handleRemoveReferenceDoc(index)}
                          >
                            删除
                          </Button>
                        )
                      }
                    />
                  ))}
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={handleAddReferenceDoc}
                    style={{ width: '100%' }}
                  >
                    添加参考文档
                  </Button>
                </Space>
              </div>

              {/* 输出路径 */}
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>输出路径</div>
                <Input
                  placeholder="默认: prd/{需求标题}_PRD_{时间戳}.md"
                  value={outputPath}
                  onChange={e => setOutputPath(e.target.value)}
                  prefix={<FileTextOutlined />}
                />
              </div>
            </Space>
          )}
        </Card>

        <Divider />

        {/* 生成按钮 */}
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleGenerate}
          loading={loading}
          block
          size="large"
        >
          生成PRD Prompt
        </Button>

        {/* 生成的Prompt */}
        {generatedPrompt && (
          <Card
            title="生成的Prompt"
            size="small"
            extra={
              <Button type="link" icon={<CopyOutlined />} onClick={handleCopy}>
                复制
              </Button>
            }
          >
            <TextArea
              rows={20}
              value={generatedPrompt}
              readOnly
              style={{ fontFamily: 'monospace', fontSize: 12 }}
            />
          </Card>
        )}
      </Space>
    </div>
  );
};

export default PrdGeneratorPanel;
