import React, { useState, useEffect } from 'react';
import { Button, Space, Input, Select, message, Checkbox, Card, Divider, Alert } from 'antd';
import { PlayCircleOutlined, CopyOutlined, FileTextOutlined, GlobalOutlined, AppstoreOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { getDocTypes, getTargetAudiences, generateDocPrompt, getDocTree } from '../../services/api';
import { DocNode, DocTypeOption, TargetAudienceOption } from '../../types';

const { TextArea } = Input;

const DocGeneratorPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [docTypes, setDocTypes] = useState<DocTypeOption[]>([]);
  const [targetAudiences, setTargetAudiences] = useState<TargetAudienceOption[]>([]);
  const [rawParentDirs, setRawParentDirs] = useState<string[]>([]);

  // 表单状态
  const [parentDir, setParentDir] = useState<string>('');
  const [docName, setDocName] = useState<string>('');
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
      const [types, audiences, tree] = await Promise.all([
        getDocTypes(),
        getTargetAudiences(),
        getDocTree(),
      ]);
      setDocTypes(types);
      setTargetAudiences(audiences);
      setRawParentDirs(extractRawParentDirs(tree));
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

  const getNormalizedDocName = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed.endsWith('.md') ? trimmed : `${trimmed}.md`;
  };

  const getPrdPath = (): string => {
    const normalizedName = getNormalizedDocName(docName);
    if (!normalizedName) return '';
    if (!parentDir) return normalizedName;
    return `${parentDir}/${normalizedName}`;
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

    const prdPath = getPrdPath();
    if (!prdPath) {
      message.warning('请输入PRD文档路径');
      return;
    }
    if (!consoleUrl) {
      message.warning('请输入控制台URL');
      return;
    }
    setLoading(true);
    try {
      const result = await generateDocPrompt({
        prdPath,
        consoleUrl,
        docType: docType as '快速入门' | '操作指南' | '功能说明',
        targetAudience: targetAudience as '开发者' | '运维人员' | '普通用户',
        outputFormat: outputFormat as 'Markdown' | 'HTML',
        useLoggedInBrowser,
        showBrowserUI,
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

  return (
    <div style={{ padding: 16, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 说明 */}
        <Alert
          message="帮助文档生成工具"
          description="基于PRD文档和控制台URL，自动生成产品帮助文档。支持快速入门、操作指南、功能说明等多种文档类型。"
          type="info"
          showIcon
        />

        {/* 基础信息 */}
        <Card title={<span><FolderOpenOutlined /> 步骤1：选择文档位置</span>} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                文档父目录（raw 下） <span style={{ color: '#ff4d4f' }}>*</span>
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

            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>PRD文档路径（自动拼接）</div>
              <Input
                value={getPrdPath()}
                readOnly
                prefix={<FolderOpenOutlined />}
                placeholder="选择父目录并输入文档名后自动生成"
              />
            </div>
          </Space>
        </Card>

        <Card title={<span><FileTextOutlined /> 基础信息</span>} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
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
              <Button type="link" icon={<CopyOutlined />} onClick={handleCopy}>
                复制
              </Button>
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
