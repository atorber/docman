import React, { useState, useEffect } from 'react';
import { Button, Space, Input, Select, message, Card, Divider, Alert } from 'antd';
import { PlayCircleOutlined, CopyOutlined, FileTextOutlined, AppstoreOutlined, PlusOutlined, LinkOutlined, UserOutlined, TagsOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { getRequirementTypes, generatePrdGenPrompt, getPrdDocTree } from '../../services/api';
import { PrdDocNode, RequirementTypeOption } from '../../types';

const { TextArea } = Input;
const PRD_ROOT_DIR = 'prd';

const PrdGeneratorPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [requirementTypes, setRequirementTypes] = useState<RequirementTypeOption[]>([]);
  const [prdParentDirs, setPrdParentDirs] = useState<string[]>([]);
  const [prdFilePaths, setPrdFilePaths] = useState<string[]>([]);

  // 表单状态
  const [parentDir, setParentDir] = useState<string>('');
  const [docName, setDocName] = useState<string>('');
  const [type, setType] = useState<string>('新功能');
  const [productName, setProductName] = useState('');
  const [title, setTitle] = useState('');
  const [initialPrdPath, setInitialPrdPath] = useState('');
  const [description, setDescription] = useState('');
  const [userPersona, setUserPersona] = useState('');
  const [competitiveLinks, setCompetitiveLinks] = useState<string[]>([]);
  const [referenceDocs, setReferenceDocs] = useState<string[]>([]);

  // 高级选项展开状态
  const [showAdvanced, setShowAdvanced] = useState(true);

  // 生成的Prompt
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // 加载选项
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [types, prdTree] = await Promise.all([
        getRequirementTypes(),
        getPrdDocTree(),
      ]);
      setRequirementTypes(types);
      setPrdParentDirs(extractPrdParentDirs(prdTree));
      setPrdFilePaths(extractPrdFilePaths(prdTree));
    } catch (e) {
      console.error('Failed to load options:', e);
    }
  };

  const extractPrdParentDirs = (nodes: PrdDocNode[]): string[] => {
    const dirs = new Set<string>();

    const walk = (items: PrdDocNode[]) => {
      for (const node of items) {
        if (node.type === 'directory') {
          dirs.add(node.relativePath);
          if (node.children && node.children.length > 0) {
            walk(node.children);
          }
        }
      }
    };

    walk(nodes);
    const allDirs = [PRD_ROOT_DIR, ...Array.from(dirs).map((dir) => `${PRD_ROOT_DIR}/${dir}`)];
    return allDirs.sort((a, b) => a.localeCompare(b));
  };

  const extractPrdFilePaths = (nodes: PrdDocNode[]): string[] => {
    const paths: string[] = [];

    const walk = (items: PrdDocNode[]) => {
      for (const node of items) {
        if (node.type === 'file') {
          paths.push(`${PRD_ROOT_DIR}/${node.relativePath}`);
        } else if (node.children && node.children.length > 0) {
          walk(node.children);
        }
      }
    };

    walk(nodes);
    return paths.sort((a, b) => a.localeCompare(b));
  };

  const getNormalizedDocName = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`;
  };

  const getNormalizedInitialPrdPath = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    const withPrefix = trimmed.startsWith('prd/') ? trimmed : `prd/${trimmed.replace(/^\/+/, '')}`;
    return withPrefix.endsWith('.md') ? withPrefix : `${withPrefix}.md`;
  };

  const getOutputPath = (): string => {
    const normalizedName = getNormalizedDocName(docName);
    if (!normalizedName) return '';
    return parentDir ? `${parentDir}/${normalizedName}` : normalizedName;
  };

  const handleGenerate = async () => {
    if (!parentDir) {
      message.warning('请先选择文档父目录');
      return;
    }
    if (!docName.trim()) {
      message.warning('请输入文档名称');
      return;
    }
    const outputPath = getOutputPath();
    if (!outputPath) {
      message.warning('请先配置生成文档路径');
      return;
    }
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
        initialPrdPath: getNormalizedInitialPrdPath(initialPrdPath) || undefined,
        userPersona: userPersona || undefined,
        competitiveLinks: competitiveLinks.filter(l => l.trim()) || undefined,
        referenceDocs: referenceDocs.filter(d => d.trim()) || undefined,
        outputPath,
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

  return (
    <div style={{ padding: 16, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 说明 */}
        <Alert
          message="PRD生成工具"
          description="根据需求描述、竞品分析等信息，自动生成完整的产品需求文档(PRD)。支持交互式确认和多轮迭代完善。"
          type="info"
          showIcon
        />

        <Card title={<span><FolderOpenOutlined /> 配置生成文档存放位置</span>} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>
                  文档父目录（prd 下） <span style={{ color: '#ff4d4f' }}>*</span>
                </span>
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontWeight: 400,
                    color: getOutputPath() ? '#8c8c8c' : '#bfbfbf',
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={getOutputPath() || '选择父目录并输入文档名后自动生成'}
                >
                  {getOutputPath() || '选择父目录并输入文档名后自动生成'}
                </span>
              </div>
              <Select
                placeholder="请选择 prd 下的父目录"
                value={parentDir || undefined}
                onChange={setParentDir}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="label"
                options={prdParentDirs.map((dir) => ({ value: dir, label: dir }))}
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                文档名称 <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <Input
                placeholder="如: AIHC_资源组管理PRD（可不写 .md）"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                prefix={<FileTextOutlined />}
              />
            </div>

          </Space>
        </Card>

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
                optionLabelProp="value"
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
                <div style={{ marginBottom: 8, fontWeight: 500 }}>竞品链接（URL，可多条）</div>
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
                        competitiveLinks.length > 0 && (
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

              {/* 本地参考文档 */}
              <div>
                <div style={{ marginBottom: 8, fontWeight: 500 }}>本地参考文档（prd 下，可多选）</div>
                <Select
                  mode="multiple"
                  value={referenceDocs}
                  onChange={setReferenceDocs}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="label"
                  maxTagCount={3}
                  options={prdFilePaths.map((p) => ({ value: p, label: p }))}
                />
                <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                  选择用于增强生成内容的本地参考文档（只允许 prd 下的 .md 文件）。
                </div>
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
