import React, { useState, useEffect } from 'react';
import { Button, Space, Input, Select, message, Checkbox, Card, Divider, Alert } from 'antd';
import { PlayCircleOutlined, CopyOutlined, FileTextOutlined, GlobalOutlined, AppstoreOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { getDocTypes, getTargetAudiences, generateDocPrompt, getDocTree, getPrdDocTree } from '../../services/api';
import { DocNode, DocTypeOption, PrdDocNode, TargetAudienceOption } from '../../types';

const { TextArea } = Input;

const DocGeneratorPanel: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [docTypes, setDocTypes] = useState<DocTypeOption[]>([]);
  const [targetAudiences, setTargetAudiences] = useState<TargetAudienceOption[]>([]);
  const [rawParentDirs, setRawParentDirs] = useState<string[]>([]);
  const [prdFilePaths, setPrdFilePaths] = useState<string[]>([]);

  // 表单状态
  const [parentDir, setParentDir] = useState<string>('');
  const [docName, setDocName] = useState<string>('');
  const [prdPath, setPrdPath] = useState('');
  const [consoleUrl, setConsoleUrl] = useState('');
  const [docType, setDocType] = useState<string>('操作指南');
  const [targetAudience, setTargetAudience] = useState<string>('普通用户');
  const [outputFormat, setOutputFormat] = useState<string>('Markdown');
  const [useLoggedInBrowser, setUseLoggedInBrowser] = useState(true);
  const [showBrowserUI, setShowBrowserUI] = useState(false);

  // 生成的Prompt
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // 加载选项
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [types, audiences, tree, prdTree] = await Promise.all([
        getDocTypes(),
        getTargetAudiences(),
        getDocTree(),
        getPrdDocTree(),
      ]);
      setDocTypes(types);
      setTargetAudiences(audiences);
      setRawParentDirs(extractRawParentDirs(tree));
      setPrdFilePaths(extractPrdFilePaths(prdTree));
    } catch (e) {
      console.error('Failed to load options:', e);
    }
  };

  const extractRawParentDirs = (nodes: DocNode[]): string[] => {
    const dirs = new Set<string>();

    const walk = (items: DocNode[]) => {
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
    return Array.from(dirs).sort((a, b) => a.localeCompare(b));
  };

  const extractPrdFilePaths = (nodes: PrdDocNode[]): string[] => {
    const paths: string[] = [];

    const walk = (items: PrdDocNode[]) => {
      for (const node of items) {
        if (node.type === 'file') {
          paths.push(node.relativePath);
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

  const getOutputPath = (): string => {
    const normalizedName = getNormalizedDocName(docName);
    if (!normalizedName) return '';
    if (!parentDir) return normalizedName;
    return `${parentDir}/${normalizedName}`;
  };

  const handleGenerate = async () => {
    if (!parentDir) {
      messageApi.warning('请先选择文档父目录');
      return;
    }
    if (!docName.trim()) {
      messageApi.warning('请输入文档名称');
      return;
    }

    const outputPath = getOutputPath();
    if (!outputPath) {
      messageApi.warning('请先配置生成文档路径');
      return;
    }
    if (!prdPath) {
      messageApi.warning('请输入PRD文档路径');
      return;
    }
    if (!consoleUrl) {
      messageApi.warning('请输入控制台URL');
      return;
    }
    setLoading(true);
    try {
      const result = await generateDocPrompt({
        prdPath,
        outputPath,
        consoleUrl,
        docType: docType as '快速入门' | '操作指南' | '功能说明',
        targetAudience: targetAudience as '开发者' | '运维人员' | '普通用户',
        outputFormat: outputFormat as 'Markdown' | 'HTML',
        useLoggedInBrowser,
        showBrowserUI,
      });
      setGeneratedPrompt(result.prompt);
      messageApi.success('Prompt生成成功');
    } catch (e) {
      messageApi.error('生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      messageApi.success('Prompt已复制到剪贴板');
    }
  };

  const handleCopyClaudeCommand = () => {
    if (!generatedPrompt) return;
    const command = `claude -p "$(cat <<'DOCMAN_PROMPT_EOF'\n${generatedPrompt}\nDOCMAN_PROMPT_EOF\n)"`;
    navigator.clipboard.writeText(command);
    messageApi.success('Claude命令已复制到剪贴板');
  };

  return (
    <div style={{ padding: 16, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 说明 */}
        <Alert
          message="帮助文档生成工具"
          description="基于PRD文档和控制台URL，自动生成产品帮助文档。支持快速入门、操作指南、功能说明等多种文档类型。"
          type="info"
          showIcon
        />

        {/* 基础信息 */}
        <Card title={<span><FolderOpenOutlined />配置生成文档存放位置</span>} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>
                  文档父目录（raw 下） <span style={{ color: '#ff4d4f' }}>*</span>
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
                placeholder="请选择 raw 下的父目录"
                value={parentDir || undefined}
                onChange={setParentDir}
                style={{ width: '100%' }}
                showSearch
                options={rawParentDirs.map((dir) => ({ value: dir, label: dir }))}
                optionFilterProp="label"
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                文档名称 <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <Input
                placeholder="如: AIHC_功能需求文档（可不写 .md）"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                prefix={<FileTextOutlined />}
              />
            </div>

          </Space>
        </Card>

        <Card title={<span><FileTextOutlined /> 基础信息</span>} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                PRD文档路径（输入） <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <Select
                placeholder="请选择工作目录内的 PRD 文档"
                value={prdPath || undefined}
                onChange={setPrdPath}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="label"
                options={prdFilePaths.map((path) => ({ value: path, label: path }))}
                suffixIcon={<FileTextOutlined />}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                仅支持选择当前工作目录中的 PRD 文件路径。
              </div>
            </div>

            {/* 控制台URL */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                控制台URL <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <Input
                placeholder="如: https://console.bce.baidu.com/aihc"
                value={consoleUrl}
                onChange={e => setConsoleUrl(e.target.value)}
                prefix={<GlobalOutlined />}
              />
            </div>

          </Space>
        </Card>

        {/* 文档配置 */}
        <Card title={<span><AppstoreOutlined /> 文档配置</span>} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* 文档类型 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>文档类型</div>
              <Select
                value={docType}
                onChange={setDocType}
                style={{ width: '100%' }}
                options={docTypes.map(t => ({
                  value: t.value,
                  label: t.label,
                }))}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                {docTypes.find((t) => t.value === docType)?.description || ''}
              </div>
            </div>

            {/* 目标受众 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>目标受众</div>
              <Select
                value={targetAudience}
                onChange={setTargetAudience}
                style={{ width: '100%' }}
                options={targetAudiences.map(t => ({
                  value: t.value,
                  label: t.label,
                }))}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                {targetAudiences.find((t) => t.value === targetAudience)?.description || ''}
              </div>
            </div>

            {/* 输出格式 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>输出格式</div>
              <Select
                value={outputFormat}
                onChange={setOutputFormat}
                style={{ width: '100%' }}
                options={[
                  { value: 'Markdown', label: 'Markdown (.md)' },
                  { value: 'HTML', label: 'HTML (.html)' },
                ]}
              />
            </div>
          </Space>
        </Card>

        {/* 浏览器配置 */}
        <Card title="浏览器配置" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox
              checked={useLoggedInBrowser}
              onChange={e => setUseLoggedInBrowser(e.target.checked)}
            >
              使用已登录浏览器（推荐）
            </Checkbox>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4, marginLeft: 24 }}>
              勾选后将复用已有的浏览器窗口，无需重复登录。请保持浏览器窗口打开状态。
            </div>

            <Checkbox
              checked={showBrowserUI}
              onChange={e => setShowBrowserUI(e.target.checked)}
              style={{ marginTop: 8 }}
            >
              显示浏览器操作界面
            </Checkbox>
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4, marginLeft: 24 }}>
              勾选后将显示浏览器窗口，可观察自动化操作过程。
            </div>
          </Space>
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
          生成帮助文档Prompt
        </Button>

        {/* 生成的Prompt */}
        {generatedPrompt && (
          <Card
            title="生成的Prompt"
            size="small"
            extra={
              <Space size={0}>
                <Button type="link" icon={<CopyOutlined />} onClick={handleCopy}>
                  复制Prompt
                </Button>
                <Button type="link" onClick={handleCopyClaudeCommand}>
                  复制Claude命令
                </Button>
              </Space>
            }
          >
            <TextArea
              rows={15}
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

export default DocGeneratorPanel;
