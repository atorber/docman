import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Input, Select, Space, message } from 'antd';
import { CopyOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { generateResearchPrompt } from '../../services/api';

const { TextArea } = Input;

interface ResearchAnalysisPanelProps {
  selectedDocumentPath?: string;
}

const ResearchAnalysisPanel: React.FC<ResearchAnalysisPanelProps> = ({ selectedDocumentPath }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [documentPath, setDocumentPath] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [reportType, setReportType] = useState<'个股研究' | '行业板块研究'>('个股研究');
  const [analysisPreference, setAnalysisPreference] = useState('');
  const [externalDataPriority, setExternalDataPriority] = useState('东方财富');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  useEffect(() => {
    setDocumentPath(selectedDocumentPath ? `research_reports/${selectedDocumentPath}` : '');
  }, [selectedDocumentPath]);

  const handleGenerate = async () => {
    if (!documentPath.trim() && !documentText.trim()) {
      messageApi.warning('请至少提供研报文件路径或研报文本');
      return;
    }

    setLoading(true);
    try {
      const result = await generateResearchPrompt({
        documentPath: documentPath.trim() || undefined,
        documentText: documentText.trim() || undefined,
        reportType,
        analysisPreference: analysisPreference.trim() || undefined,
        externalDataPriority,
      });
      setGeneratedPrompt(result.prompt);
      messageApi.success('研报分析 Prompt 生成成功');
    } catch (error) {
      console.error('Failed to generate research prompt:', error);
      messageApi.error('研报分析 Prompt 生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    messageApi.success('Prompt 已复制');
  };

  const handleCopyClaudeCommand = () => {
    if (!generatedPrompt) return;
    const command = `claude -p "$(cat <<'DOCMAN_PROMPT_EOF'\n${generatedPrompt}\nDOCMAN_PROMPT_EOF\n)"`;
    navigator.clipboard.writeText(command);
    messageApi.success('Claude 命令已复制');
  };

  return (
    <div style={{ padding: 16, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
      {contextHolder}
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Alert
          message="A股研报分析"
          description="支持券商/机构研报分析。输入研报路径或直接粘贴文本，自动生成调用 cn-a-share-research-report-analysis skill 的 Prompt。"
          type="info"
          showIcon
        />

        <Card title="输入研报信息" size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>原始文档文件（来自左侧目录）</div>
              <Input
                value={documentPath}
                readOnly
                placeholder="请先在左侧目录选择研报文件"
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>原始文档文本（可选）</div>
              <TextArea
                rows={8}
                placeholder="粘贴研报正文或关键章节；若仅提供文本，skill 会先保存为原始文档再分析。"
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
              />
            </div>
          </Space>
        </Card>

        <Card title="分析配置" size="small">
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>报告类型</div>
              <Select
                value={reportType}
                onChange={setReportType}
                style={{ width: '100%' }}
                options={[
                  { label: '个股研究', value: '个股研究' },
                  { label: '行业板块研究', value: '行业板块研究' },
                ]}
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>分析偏好（可选）</div>
              <Input
                placeholder="如: 偏风险、偏机会、偏估值、偏业绩兑现"
                value={analysisPreference}
                onChange={(e) => setAnalysisPreference(e.target.value)}
              />
            </div>

            <div>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>外部数据优先级</div>
              <Select
                value={externalDataPriority}
                onChange={setExternalDataPriority}
                style={{ width: '100%' }}
                options={[
                  { label: '东方财富', value: '东方财富' },
                ]}
              />
            </div>
          </Space>
        </Card>

        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleGenerate}
          loading={loading}
          block
          size="large"
        >
          生成研报分析 Prompt
        </Button>

        {generatedPrompt && (
          <Card
            title="生成的 Prompt"
            size="small"
            extra={(
              <Space size={0}>
                <Button type="link" icon={<CopyOutlined />} onClick={handleCopyPrompt}>
                  复制 Prompt
                </Button>
                <Button type="link" onClick={handleCopyClaudeCommand}>
                  复制 Claude 命令
                </Button>
              </Space>
            )}
          >
            <TextArea
              rows={14}
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

export default ResearchAnalysisPanel;
