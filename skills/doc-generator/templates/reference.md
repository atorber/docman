# {{product_name}} - {{feature_name}}说明

## 功能概述

{{feature_description}}

## 功能详解

{{#each sub_features}}
### {{name}}

{{description}}

**使用场景**：

{{#each scenarios}}
- {{this}}
{{/each}}

**操作步骤**：

{{#each steps}}
{{@index_1}}. {{description}}
{{/each}}

{{#if screenshot}}
![{{name}}](images/{{product_name}}/{{screenshot}})

{{/if}}
{{/each}}

## 参数说明

{{#if parameters}}
| 参数名 | 类型 | 必填 | 说明 | 默认值 |
|--------|------|------|------|--------|
{{#each parameters}}
| {{name}} | {{type}} | {{required}} | {{description}} | {{default}} |
{{/each}}
{{/if}}

## 限制与约束

| 限制项 | 说明 |
|--------|------|
{{#each constraints}}
| {{name}} | {{description}} |
{{/each}}

## 最佳实践

{{#each best_practices}}
### {{title}}

{{description}}

{{/each}}

## 常见问题

{{#each faq_list}}
### Q{{@index_1}}：{{question}}

**A**：{{answer}}

{{/each}}

## 相关链接

- [操作指南](userguide.md)
- [API参考](api-reference.md)
- [最佳实践](best-practices.md)

---
*文档生成时间：{{timestamp}}*
*基于PRD版本：{{prd_version}}*