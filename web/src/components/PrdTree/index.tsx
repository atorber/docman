import React, { useState, useEffect } from 'react';
import type { Key } from 'react';
import { Tree, Empty, Spin, Input } from 'antd';
import { FolderOutlined, FileTextOutlined } from '@ant-design/icons';
import { PrdDocNode } from '../../types';
import { getPrdDocTree } from '../../services/api';

interface PrdTreeProps {
  onSelectDoc: (node: PrdDocNode) => void;
  selectedDocPath?: string;
  defaultSelectFirst?: boolean;
}

const PrdTree: React.FC<PrdTreeProps> = ({ onSelectDoc, selectedDocPath, defaultSelectFirst = false }) => {
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [firstLoaded, setFirstLoaded] = useState(false);

  useEffect(() => {
    loadTree();
  }, []);

  useEffect(() => {
    if (selectedDocPath) {
      setSelectedKeys([selectedDocPath]);
      const parts = selectedDocPath.split('/');
      const parentKeys: string[] = [];
      let current = '';
      for (let i = 0; i < parts.length - 1; i++) {
        current = current ? `${current}/${parts[i]}` : parts[i];
        parentKeys.push(current);
      }
      setExpandedKeys((prev) => Array.from(new Set([...prev, ...parentKeys])));
    }
  }, [selectedDocPath]);

  const loadTree = async () => {
    try {
      setLoading(true);
      const data = await getPrdDocTree();

      const transformToAntdTree = (nodes: PrdDocNode[]): any[] => {
        if (!nodes || nodes.length === 0) return [];

        return nodes.map((node) => {
          const children = node.children ? transformToAntdTree(node.children) : [];

          return {
            key: node.relativePath,
            title: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: 4,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {node.type === 'directory' ? (
                  <FolderOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                ) : (
                  <FileTextOutlined
                    style={{
                      color: node.reviewStatus === 'has-history' ? '#52c41a' : '#8c8c8c',
                      marginRight: 8
                    }}
                  />
                )}
                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 13,
                  }}
                  title={node.name}
                >
                  {node.name}
                </span>
              </div>
            ),
            icon: node.type === 'directory'
              ? <FolderOutlined />
              : <FileTextOutlined
                  style={{
                    color: node.reviewStatus === 'has-history' ? '#52c41a' : '#8c8c8c'
                  }}
                />,
            isLeaf: node.type === 'file',
            selectable: node.type === 'file',
            children: children,
          };
        });
      };

      const transformedData = transformToAntdTree(data);
      setTreeData(transformedData);

      if (selectedDocPath) {
        const parts = selectedDocPath.split('/');
        const parentKeys: string[] = [];
        let current = '';
        for (let i = 0; i < parts.length - 1; i++) {
          current = current ? `${current}/${parts[i]}` : parts[i];
          parentKeys.push(current);
        }
        setExpandedKeys(parentKeys);
        setSelectedKeys([selectedDocPath]);
        onSelectDoc({
          name: parts[parts.length - 1],
          path: selectedDocPath,
          relativePath: selectedDocPath,
          type: 'file',
        });
      } else if (defaultSelectFirst && !firstLoaded && transformedData.length > 0) {
        setExpandedKeys([]);
        const findFirstFile = (nodes: any[]): any => {
          for (const node of nodes) {
            if (node.isLeaf) return node;
            if (node.children) {
              const found = findFirstFile(node.children);
              if (found) return found;
            }
          }
          return null;
        };
        const firstFile = findFirstFile(transformedData);
        if (firstFile) {
          setSelectedKeys([firstFile.key]);
          onSelectDoc({
            name: firstFile.key.split('/').pop() || firstFile.key,
            path: firstFile.key,
            relativePath: firstFile.key,
            type: 'file',
          });
          setFirstLoaded(true);
        }
      }

    } catch (error) {
      console.error('Failed to load PRD doc tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTree = (nodes: any[], searchText: string): any[] => {
    if (!searchText) return nodes;

    const result: any[] = [];
    for (const node of nodes) {
      if (node.title.props.children[2]?.props?.children?.includes(searchText)) {
        result.push(node);
      } else if (node.children) {
        const filteredChildren = filterTree(node.children, searchText);
        if (filteredChildren.length > 0) {
          result.push({
            ...node,
            children: filteredChildren,
          });
        }
      }
    }
    return result;
  };

  const handleExpand = (keys: Key[]) => {
    setExpandedKeys(keys.map((k) => String(k)));
  };

  const handleSelect = (keys: Key[], info: { node: any }) => {
    const node = info.node;
    if (node.isLeaf) {
      setSelectedKeys(keys.map((k) => String(k)));
      onSelectDoc({
        name: node.key.split('/').pop() || node.key,
        path: node.key,
        relativePath: node.key,
        type: 'file',
      });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (treeData.length === 0) {
    return <Empty description="暂无PRD文档，请在 prd/ 目录下添加文档" />;
  }

  const displayData = searchValue ? filterTree(treeData, searchValue) : treeData;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Input.Search
        placeholder="搜索PRD文档..."
        style={{ marginBottom: 12 }}
        onChange={(e) => setSearchValue(e.target.value)}
        allowClear
      />
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          border: '1px solid #f0f0f0',
          borderRadius: 6,
          padding: 8,
        }}
      >
        <Tree
          showIcon={false}
          showLine
          defaultExpandAll={false}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onExpand={handleExpand}
          onSelect={handleSelect}
          treeData={displayData}
          blockNode
          selectable
        />
      </div>
    </div>
  );
};

export default PrdTree;
