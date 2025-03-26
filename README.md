# **Directus Extension: directus-extension-custom-javascript-and-page**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Directus](https://img.shields.io/badge/Directus-%5E10.10.0-ff69b4)](https://directus.io/)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/directus-extension-custom-javascript-and-page?style=social)](https://github.com/ryoakirasan/directus-extension-custom-javascript-and-page)

---

## **Project Background**

**Directus** is an open-source headless content management system (Headless CMS) that provides powerful data management and API generation capabilities. However, in some complex business scenarios, developers may need to customize JavaScript scripts to enhance the administrator interface or create custom public pages. To meet these needs, the **directus-extension-custom-javascript-and-page** was developed. This is a hybrid extension designed to provide Directus with the following features:

1. **Custom JavaScript Injection**: Allows injecting custom JavaScript scripts into the administrator interface to implement specific functions or integrate third-party services.
2. **Public Page Hosting**: Supports hosting custom public pages within Directus without relying on external servers or services.

---
## **Screenshots**

Home:

<img width="1533" alt="image" src="https://github.com/user-attachments/assets/cba1bc2b-0919-4b0f-a19b-73cee1fae4bc" />

Edit Script:

<img width="1535" alt="image" src="https://github.com/user-attachments/assets/4fc91392-2363-4879-9544-09ca8892c678" />

Edit Page HTML:

<img width="1535" alt="image" src="https://github.com/user-attachments/assets/629411d9-ce95-4b03-b475-42099ecee543" />

Example console.log:

<img width="1812" alt="image" src="https://github.com/user-attachments/assets/6d13b523-f4c8-4e64-a36d-a94242d1f326" />

Custom Page View:

<img width="832" alt="image" src="https://github.com/user-attachments/assets/c87b33a2-39b1-4975-a96b-74e5ada37e91" />

---
## **Functionality Overview**

### **1. Directory Structure**

```
src/
├── custom-javascript-page/
│   ├── components/
│   │   └── navigation.vue       // Navigation component for rendering page navigation menu
│   ├── pages/
│   │   ├── admin-scripts.vue    // Administrator script management page
│   │   ├── app-scripts.vue      // Application script management page
│   │   ├── custom-page.vue      // Custom public page management page
│   │   └── home.vue             // Extension homepage, displaying usage instructions and security warnings
│   ├── components/
│   │   └── PageNavigation.vue   // Implementation file for the navigation component
│   ├── use-directus-token.js    // Utility function for handling Directus authentication token
│   ├── index.ts                 // Extension entry file, defining basic extension information and routes
│   └── module.vue               // Main module component, combining various sub-components and pages
├── embed-scripts-hook/
│   └── index.ts                 // Hook for embedding scripts, used for dynamically inserting custom scripts
├── load-page-endpoint/
│   └── index.ts                 // Public page hosting endpoint, handling page access and settings
└── load-scripts-endpoint/
    └── index.ts                 // Script loading endpoint, handling script reading and returning
```


### **2. Custom JavaScript Injection**

- **Administrator Script Management**:
  - **Head Script**: Inject custom JavaScript code into the `<head>` section of the administrator interface.
  - **Body Script**: Inject custom JavaScript code into the `<body>` section of the administrator interface.
  - **Permission Control**: Only allow administrator users to enable and edit administrator scripts to ensure security.

- **Application Script Management**:
  - **Head Script**: Inject custom JavaScript code into public pages or specific applications.
  - **Body Script**: Inject custom JavaScript code into public pages or specific applications.
  - **Permission Control**: Load different script content based on user permissions (administrator and non-administrator).

### **3. Public Page Hosting**

- **Custom Page Creation**:
  - **HTML Editor**: Create and edit custom public page content through the built-in HTML editor.
  - **Real-time Preview**: Provide a real-time preview function during the editing process to facilitate users to view the page effect.

- **Page Access Management**:
  - **Enable/Disable**: Control the visibility of custom pages by setting switches.
  - **Access Control**: Control page access permissions through the `.disable` file to ensure that only authorized users can access.

- **Integration and Routing**:
  - **Custom Routing**: Access hosted public pages through the `/custompage/view` endpoint (index.html file in the page directory).
  - **Static Resource Hosting**: Supports hosting static resources such as CSS, JavaScript, and image files, accessible via `/custompage/static/fileName.ext` (the name of the static resource file to be accessed).

### **4. Settings and Configuration**

- **Extension Settings Storage**:
  - **JSON Storage**: All extension settings (such as script content, enable status, etc.) are stored in the `ext_custom_scripts_page_settings` field of the `directus_settings` collection.
  - **Automatic Field Creation**: The extension automatically creates the necessary fields in the `directus_settings` collection during the initial installation to ensure the integrity of data storage.

- **Security Configuration**:
  - **Content Security Policy (CSP)**: To execute custom scripts, users need to configure `CONTENT_SECURITY_POLICY_DIRECTIVES__SCRIPT_SRC` in the environment variables to allow `unsafe-inline` and `unsafe-eval`. Please note that this may bring security risks, and it is recommended to configure with caution.

- **Directory Configuration**:
  - **public** directory: When starting for the first time, a `public` directory will be created in the project root directory.
  - **page** directory: When starting for the first time, a `page` directory will be created in the `public` directory for storing HTML files and static resource files of custom pages.

---

## **Precautions**

1. **Security**:
   - **Code Injection Risk**: Custom JavaScript scripts have high permissions and can be used for malicious operations. Ensure that only code from trusted sources is used and strictly control script editing permissions.
   - **CSP Configuration**: Enabling `unsafe-inline` and `unsafe-eval` may increase the risk of XSS attacks. It is recommended to configure with caution in the production environment and use stricter security policies as much as possible.

2. **Performance Impact**:
   - **Script Loading**: Injected scripts may affect the loading performance of the administrator interface or public pages. Please optimize the script code to avoid unnecessary resource consumption.
   - **Caching Strategy**: It is recommended to set appropriate caching strategies for static resources and scripts to improve page loading speed.

3. **Data Backup**:
   - **Settings Backup**: Regularly back up the `ext_custom_scripts_page_settings` field in the `directus_settings` collection to prevent data loss or damage.

4. **Dependencies and Compatibility**:
   - **Directus Version**: This extension is developed based on Directus 10.x version, ensure compatibility with your Directus version.
   - **Frontend Dependencies**: This extension relies on Vue.js and other frontend libraries, please ensure that these dependencies have been correctly introduced in your project environment.

---

## **How to Use**

### **1. Install the Extension**

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/ryoakirasan/directus-extension-custom-javascript-and-page.git
   ```

2. **Install Dependencies**:

   ```bash
   cd directus-extension-custom-javascript-and-page
   pnpm install
   ```

3. **Build the Extension**:

   ```bash
   pnpm run build
   ```

4. **Copy the Extension to the Directus Extension Directory**:

   ```bash
   cp -r dist/* /path/to/your/directus/extensions/directus-extension-custom-javascript-and-page
   ```

5. **Restart Directus Service (Docker)**:

   ```bash
   docker-compose restart directus
   ```

### **2. Configure Environment Variables**

To enable the execution of custom scripts, you need to configure the Content Security Policy (CSP) in the environment variables. Edit your `.env` file and add the following:

```env
CONTENT_SECURITY_POLICY_DIRECTIVES__SCRIPT_SRC="'self' 'unsafe-inline' 'unsafe-eval'"
```

**Note**: Enabling `unsafe-inline` and `unsafe-eval` may bring security risks, please configure with caution according to actual needs.

### **3. Use Extension Features**

1. **Install the Extension**:
   - Copy the extension file to the Directus extension directory and restart the Directus service. Because the `embed` method in the hook is executed when Directus starts, you need to restart the Directus service.

2. **Access the Administrator Interface**:
   - Log in to the Directus administrator interface, go to **Settings** to enable the module, and you will see a new menu item **"Custom Scripts & Page"** in the left menu.

3. **Manage Custom Scripts**:
   - **Administrator Script**:
     - Navigate to the **"Admin Script"** page and edit the **Head** and **Body** script content.
     - Enable the **Admin Script** switch to activate the script.
   - **Application Script**:
     - Navigate to the **"App Script"** page and edit the **Head** and **Body** script content.
     - Enable the **App Script** switch as needed.

4. **Create and Edit Public Pages**:
   - Navigate to the **"Custom Page"** page.
   - Use the built-in HTML editor to create or edit your public page content.
   - Use the **Preview** function to view the page effect.
   - Adjust the **Page Visibility** settings to control page access permissions.

5. **Access Public Pages**:
   - Access your custom public page via `http://your-directus-domain.com/custompage/view`.

### **4. Permission Management**

- **Administrator Permissions**:
  - Only users with administrator permissions can manage custom scripts and public page settings.

- **Non-Administrator Permissions**:
  - Non-administrator users can access public pages but cannot modify any settings.

### **5. Extension Configuration**

- **Dynamic Script Insertion**:
  - Scripts are dynamically inserted based on user permissions and the current route, ensuring that the correct script content is loaded on different pages.

- **Dynamic Compression of Static Files**:
  - This extension automatically compresses (Gzip) static files (such as CSS, JavaScript) through fflate to improve page loading speed.
---

## **Examples**

### **1. Custom Administrator Script**

```javascript
// Head Script
console.log('Admin Head Script Loaded');

// Body Script
console.log('Admin Body Script Loaded');
```

### **2. Custom Application Script**

```javascript
// Head Script
console.log('App Head Script Loaded');

// Body Script
console.log('App Body Script Loaded');
```

### **3. Custom Public Page**

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

## **Development and Contribution**

We welcome community contributions! If you would like to contribute to this project, please follow these steps:

1. **Fork the Repository**.
2. **Create your Feature Branch** (`git checkout -b feature/YourFeature`).
3. **Commit your Changes** (`git commit -m 'Add some feature'`).
4. **Push to the Branch** (`git push origin feature/YourFeature`).
5. **Open a Pull Request**.

---

## **Contact and Support**

If you encounter any problems or have any questions during use, please feel free to contact us through the following methods:

- **GitHub Issues**: Submit issues on the [Issues](https://github.com/ryoakirasan/directus-extension-custom-javascript-and-page/issues) page.

---

## **License**

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the [LICENSE](LICENSE) file for details.

