# {{product_name}} - 操作指南

## 概述

{{product_description}}

### 功能列表

| 功能 | 说明 |
|------|------|
{{#each feature_list}}
| {{name}} | {{description}} |
{{/each}}

## 前提条件

- 已注册{{product_name}}账号
- 已开通相关服务权限
{{#each prerequisites}}
- {{this}}
{{/each}}

{{#each feature_modules}}
## {{@index_1}}. {{name}}

### 功能说明

{{description}}

### 操作步骤

1. 登录[{{product_name}}控制台]({{console_url}})
2. 在左侧导航栏，选择「{{menu_path}}」
   
   ![导航路径](images/{{product_name}}/{{image_prefix}}_导航路径.png)

3. 点击「{{action_button}}」按钮

4. 在弹出的界面中，填写以下信息：

   | 字段 | 说明 | 是否必填 |
   |------|------|----------|
   {{#each form_fields}}
   | {{name}} | {{description}} | {{required}} |
   {{/each}}

   ![表单界面](images/{{product_name}}/{{image_prefix}}_表单.png)

5. 点击「确定」完成操作

6. 等待操作完成，查看结果

   ![操作结果](images/{{product_name}}/{{image_prefix}}_结果.png)

### 注意事项

> ⚠️ **重要提示**
> 
> {{important_note}}

{{#if constraints}}
#### 限制条件

| 限制项 | 说明 |
|--------|------|
{{#each constraints}}
| {{name}} | {{description}} |
{{/each}}
{{/if}}

{{/each}}

## 常见问题

{{#each faq_list}}
### Q{{@index_1}}：{{question}}

**A**：{{answer}}

{{/each}}

## 相关链接

- [快速入门](quickstart.md)
- [API参考](api-reference.md)
- [产品定价](pricing.md)

---
*文档生成时间：{{timestamp}}*
*基于PRD版本：{{prd_version}}*