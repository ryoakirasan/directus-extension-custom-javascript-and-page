# **Directus Extension: Custom JavaScript & Page**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Directus](https://img.shields.io/badge/Directus-%5E10.10.0-ff69b4)](https://directus.io/)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/directus-extension-custom-javascript-and-page?style=social)](https://github.com/ryoakirasan/directus-extension-custom-javascript-and-page)

---

## **项目背景**

**Directus** 是一个开源的无头内容管理系统（Headless CMS），它提供了强大的数据管理和API生成功能。然而，在某些复杂的业务场景下，开发者可能需要自定义JavaScript脚本以增强管理员界面或创建自定义的公共页面。为了满足这些需求，开发了 **Directus Extension: Custom JavaScript & Page**，这是一个混合型扩展程序，旨在为Directus提供以下功能：

1. **自定义JavaScript注入**：允许在管理员界面中注入自定义的JavaScript脚本，以实现特定的功能或集成第三方服务。
2. **公共页面托管**：支持在Directus内部托管自定义的公共页面，无需依赖外部服务器或服务。

---

## **功能概述**

### **1. 目录结构**

```
src/
├── custom-javascript-page/
│   ├── components/
│   │   └── navigation.vue       // 导航组件，用于渲染页面导航菜单
│   ├── pages/
│   │   ├── admin-scripts.vue    // 管理员脚本管理页面
│   │   ├── app-scripts.vue      // 应用脚本管理页面
│   │   ├── custom-page.vue      // 自定义公共页面管理页面
│   │   └── home.vue             // 扩展主页，展示使用说明和安全警告
│   ├── components/
│   │   └── PageNavigation.vue   // 导航组件的实现文件
│   ├── use-directus-token.js    // 处理 Directus 认证 token 的工具函数
│   ├── index.ts                 // 扩展入口文件，定义扩展的基本信息和路由
│   └── module.vue               // 主模块组件，组合各个子组件和页面
├── embed-scripts-hook/
│   └── index.ts                 // 嵌入脚本的钩子，用于动态插入自定义脚本
├── load-page-endpoint/
│   └── index.ts                 // 公共页面托管端点，处理页面访问和设置
└── load-scripts-endpoint/
    └── index.ts                 // 脚本加载端点，处理脚本的读取和返回
```


### **2. 自定义JavaScript注入**

- **管理员脚本管理**：
  - **Head 脚本**：在管理员界面的 `<head>` 部分注入自定义的JavaScript代码。
  - **Body 脚本**：在管理员界面的 `<body>` 部分注入自定义的JavaScript代码。
  - **权限控制**：仅允许管理员用户启用和编辑管理员脚本，确保安全性。

- **应用脚本管理**：
  - **Head 脚本**：在公共页面或特定应用中注入自定义的JavaScript代码。
  - **Body 脚本**：在公共页面或特定应用中注入自定义的JavaScript代码。
  - **权限控制**：根据用户权限（管理员与非管理员）加载不同的脚本内容。

### **3. 公共页面托管**

- **自定义页面创建**：
  - **HTML 编辑器**：通过内置的HTML编辑器创建和编辑自定义的公共页面内容。
  - **实时预览**：在编辑过程中提供实时预览功能，方便用户查看页面效果。

- **页面访问管理**：
  - **启用/禁用**：通过设置开关控制自定义页面的可见性。
  - **访问控制**：通过 `.disable` 文件控制页面访问权限，确保只有授权用户可以访问。

- **集成与路由**：
  - **自定义路由**：通过 `/custompage/view` 端点访问托管的公共页面(page目录下的index.html文件)。
  - **静态资源托管**：支持托管静态资源，如CSS、JavaScript和图片文件，通过 `/custompage/static/fileName.ext`访问静态资源(需要访问的fileName.ext静态资源文件的名称)。

### **4. 设置与配置**

- **扩展设置存储**：
  - **JSON 存储**：所有扩展的设置（如脚本内容、启用状态等）都存储在 `directus_settings` 集合的 `ext_custom_scripts_page_settings` 字段中。
  - **自动创建字段**：扩展在首次安装时自动在 `directus_settings` 集合中创建必要的字段，确保数据存储的完整性。

- **安全配置**：
  - **内容安全策略（CSP）**：为了执行自定义脚本，用户需要在环境变量中配置 `CONTENT_SECURITY_POLICY_DIRECTIVES__SCRIPT_SRC`，以允许 `unsafe-inline` 和 `unsafe-eval`。请注意，这可能会带来安全风险，建议谨慎配置。

- **目录配置**:
  - **public** 目录:初次启动时，会在项目根目录下创建一个 `public` 目录。
  - **page** 目录:初次启动时，会在`public` 目录下创建一个 `page` 目录，用于存储自定义页面的HTML文件与静态资源文件。

---

## **注意事项**

1. **安全性**：
   - **代码注入风险**：自定义JavaScript脚本具有高度权限，可能被用于恶意操作。请确保仅使用来自可信来源的代码，并严格控制脚本的编辑权限。
   - **CSP 配置**：启用 `unsafe-inline` 和 `unsafe-eval` 可能会增加XSS攻击的风险。建议在生产环境中谨慎配置，并尽可能使用更严格的安全策略。

2. **性能影响**：
   - **脚本加载**：注入的脚本可能会影响管理员界面或公共页面的加载性能。请优化脚本代码，避免不必要的资源消耗。
   - **缓存策略**：建议为静态资源和脚本设置适当的缓存策略，以提高页面加载速度。

3. **数据备份**：
   - **设置备份**：定期备份 `directus_settings` 集合中的 `ext_custom_scripts_page_settings` 字段，以防止数据丢失或损坏。

4. **依赖与兼容性**：
   - **Directus 版本**：本扩展基于 Directus 10.x 版本开发，确保与您的 Directus 版本兼容。
   - **前端依赖**：本扩展依赖于 Vue.js 和其他前端库，请确保您的项目环境中已正确引入这些依赖。

---

## **如何使用**

### **1. 安装扩展**

1. **克隆仓库**：

   ```bash
   git clone https://github.com/ryoakirasan/directus-extension-custom-javascript-and-page.git
   ```

2. **安装依赖**：

   ```bash
   cd directus-extension-custom-javascript-and-page
   pnpm install
   ```

3. **构建扩展**：

   ```bash
   pnpm run build
   ```

4. **将扩展复制到 Directus 扩展目录**：

   ```bash
   cp -r dist/* /path/to/your/directus/extensions/directus-extension-custom-javascript-and-page
   ```

5. **重启 Directus 服务(docker)**：

   ```bash
   docker-compose restart directus
   ```

### **2. 配置环境变量**

为了启用自定义脚本的执行，您需要在环境变量中配置内容安全策略（CSP）。编辑您的 `.env` 文件，添加以下内容：

```env
CONTENT_SECURITY_POLICY_DIRECTIVES__SCRIPT_SRC="'self' 'unsafe-inline' 'unsafe-eval'"
```

**注意**：启用 `unsafe-inline` 和 `unsafe-eval` 可能会带来安全风险，请根据实际需求谨慎配置。

### **3. 使用扩展功能**

1. **安装扩展**：
   - 将扩展文件复制到 Directus 扩展目录，并重新启动 Directus 服务。因为hook中的`embed`方法是在directus启动时执行的，所以需要重启directus服务。

2. **访问管理员界面**：
   - 登录 Directus 管理员界面，前往 **设置** 开启模块，您将在左侧菜单中看到一个新的菜单项 **"Custom Scripts & Page"**。

3. **管理自定义脚本**：
   - **管理员脚本**：
     - 导航到 **"Admin Script"** 页面，编辑 **Head** 和 **Body** 脚本内容。
     - 启用 **Admin Script** 开关以激活脚本。
   - **应用脚本**：
     - 导航到 **"App Script"** 页面，编辑 **Head** 和 **Body** 脚本内容。
     - 根据需要启用 **App Script** 开关。

4. **创建和编辑公共页面**：
   - 导航到 **"Custom Page"** 页面。
   - 使用内置的 HTML 编辑器创建或编辑您的公共页面内容。
   - 使用 **预览** 功能查看页面效果。
   - 调整 **页面可见性** 设置以控制页面的访问权限。

5. **访问公共页面**：
   - 通过 `http://your-directus-domain.com/custompage/view` 访问您的自定义公共页面。

### **4. 权限管理**

- **管理员权限**：
  - 只有具有管理员权限的用户可以管理自定义脚本和公共页面设置。

- **非管理员权限**：
  - 非管理员用户可以访问公共页面，但无法修改任何设置。

### **5. 扩展配置**

- **动态脚本插入**：
  - 脚本会根据用户的权限和当前路由动态插入，确保在不同页面中加载正确的脚本内容。

- **动态压缩静态文件**：
  - 本扩展通过fflate实现自动压缩(Gzip)静态文件（如CSS、JavaScript），以提高页面加载速度。
---

## **示例**

### **1. 自定义管理员脚本**

```javascript
// Head Script
console.log('Admin Head Script Loaded');

// Body Script
console.log('Admin Body Script Loaded');
```

### **2. 自定义应用脚本**

```javascript
// Head Script
console.log('App Head Script Loaded');

// Body Script
console.log('App Body Script Loaded');
```

### **3. 自定义公共页面**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Custom Page</title>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>Welcome to My Custom Page</h1>
    <p>This is a custom page created using the Directus Custom Page Extension.</p>
</body>
</html>
```

---

## **开发与贡献**

我们欢迎社区的贡献！如果您想为该项目做出贡献，请按照以下步骤操作：

1. **Fork 仓库**。
2. **创建您的功能分支** (`git checkout -b feature/YourFeature`)。
3. **提交您的更改** (`git commit -m 'Add some feature'`).
4. **推送您的分支** (`git push origin feature/YourFeature`).
5. **打开一个 Pull Request**。

---

## **联系与支持**

如果您在使用过程中遇到任何问题或有任何疑问，请随时通过以下方式联系：

- **GitHub Issues**：在 [Issues](https://github.com/ryoakirasan/directus-extension-custom-javascript-and-page/issues) 页面提交问题。

---

## **许可证**

本项目采用 [MIT 许可证](https://opensource.org/licenses/MIT)。请参阅 [LICENSE](LICENSE) 文件以获取详细信息。
