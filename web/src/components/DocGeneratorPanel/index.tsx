import React, { useState, useEffect } from 'react';
import { Button, Space, Input, Select, message, Checkbox, Card, Divider, Alert } from 'antd';
import { PlayCircleOutlined, CopyOutlined, FileTextOutlined, GlobalOutlined, AppstoreOutlined } from '@ant-design/icons';
import { getDocTypes, getTargetAudiences, generateDocPrompt } from '../../services/api';
import { DocTypeOption, TargetAudienceOption } from '../../types';

const { TextArea } = Input;

const DocGeneratorPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [docTypes, setDocTypes] = useState<DocTypeOption[]>([]);
  const [targetAudiences, setTargetAudiences] = useState<TargetAudienceOption[]>([]);

  // 表单状态
  const [prdPath, setPrdPath] = useState('');
  const [consoleUrl, setConsoleUrl] = useState('');
  const [productName, setProductName] = useState('');
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
      const [types, audiences] = await Promise.all([
        getDocTypes(),
        getTargetAudiences(),
      ]);
      setDocTypes(types);
      setTargetAudiences(audiences);
    } catch (e) {
      console.error('Failed to load options:', e);
    }
  };

  const handleGenerate = async () => {
    if (!prdPath) {
      message.warning('请输入PRD文档路径');
      return;
    }
    if (!consoleUrl) {
      message.warning('请输入控制台URL');
      return;
    }
    if (!productName) {
      message.warning('请输入产品名称');
      return;
    }

    setLoading(true);
    try {
      const result = await generateDocPrompt({
        prdPath,
        consoleUrl,
        productName,
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
        <Card title={<span><FileTextOutlined /> 基础信息</span>} size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* PRD文档路径 */}
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                PRD文档路径 <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <Input
                placeholder="如: prd/AIHC_功能需求文档.md"
                value={prdPath}
                onChange={e => setPrdPath(e.target.value)}
                prefix={<FileTextOutlined />}
              />
              <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                支持 .md, .docx, .txt, .pdf 格式
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
                  label: (
                    <div>
                      <div>{t.label}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{t.description}</div>
                    </div>
                  ),
                }))}
              />
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
                  label: (
                    <div>
                      <div>{t.label}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{t.description}</div>
                    </div>
                  ),
                }))}
              />
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
