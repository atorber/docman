import React, { useState, useEffect } from 'react';
import { Tree, Empty, Spin, Input } from 'antd';
import { FolderOutlined, FileTextOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { DocNode } from '../types';
import { getDocTree } from '../../services/api';

interface DocTreeProps {
  onSelectDoc: (node: DocNode) => void;
  selectedDocPath?: string;
}

const { Search } = Tree;

const DocTree: React.FC<DocTreeProps> = ({ onSelectDoc, selectedDocPath }) => {
  const [treeData, setTreeData] = useState<DocNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  useEffect(() => {
    loadTree();
  }, []);

  const loadTree = async () => {
    try {
      setLoading(true);
      const data = await getDocTree();
      setTreeData(data);
      // 默认展开第一层
      const firstLevelKeys = data
        .filter(node => node.type === 'directory')
        .map(node => node.relativePath);
      setExpandedKeys(firstLevelKeys);
    } catch (error) {
      console.error('Failed to load doc tree:', error);
    } finally {
      setLoading(false);
    }
  };

  // 转换数据为antd Tree组件格式
  const transformToTreeData = (nodes: DocNode[]): any[] => {
    return nodes.map(node => ({
      key: node.relativePath,
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {node.type === 'directory' ? <FolderOutlined /> : <FileTextOutlined />}
          <span>{node.name}</span>
          {node.diagnoseStatus === 'has-history' && (
            <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 'auto' }} />
          )}
        </div>
      ),
      children: node.children ? transformToTreeData(node.children) : undefined,
      isLeaf: node.type === 'file',
      icon: node.type === 'directory' ? <FolderOutlined /> : undefined,
    }));
  };

  const handleSelect = (selectedKeys: string[], info: any) => {
    if (selectedKeys.length > 0) {
      const selectedPath = selectedKeys[0];
      // 找到对应的节点
      const findNode = (nodes: DocNode[]): DocNode | null => {
        for (const node of nodes) {
          if (node.relativePath === selectedPath) return node;
          if (node.children) {
            const found = findNode(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(treeData);
      if (node && node.type === 'file') {
        onSelectDoc(node);
      }
    }
  };

  const handleExpand = (keys: string[]) => {
    setExpandedKeys(keys);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (treeData.length === 0) {
    return <Empty description="暂无文档" />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Input.Search
        placeholder="搜索文档"
        style={{ marginBottom: 16 }}
        onChange={e => setSearchValue(e.target.value)}
      />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Tree
          showIcon
          defaultExpandAll={false}
          expandedKeys={expandedKeys}
          onExpand={handleExpand}
          onSelect={handleSelect}
          selectedKeys={selectedDocPath ? [selectedDocPath] : []}
          treeData={transformToTreeData(treeData)}
        />
      </div>
    </div>
  );
};

export default DocTree;