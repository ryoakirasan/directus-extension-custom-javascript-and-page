<template>
  <div class="home-page">
    <!-- Welcome Message -->
    <div class="welcome-message">
      <h2>Welcome to Custom Scripts & Pages</h2>
    </div>

    <!-- Security Warning Message -->
    <div class="warning-message">
      <div class="warning-icon">
        <v-icon name="warning" />
      </div>
      <div class="warning-content">
        <h3>Security Warning</h3>
        <p>When injecting custom scripts or HTML:</p>
        <ul>
          <li>Only use code from trusted sources</li>
          <li>Malicious code can compromise your Directus instance</li>
          <li>Unauthorized scripts may expose sensitive data</li>
          <li>Improper HTML can break your admin interface</li>
        </ul>
      </div>
    </div>

    <!-- Usage Instructions Section -->
    <div class="usage-section">
      <div class="usage-content">
        <h3>
          <v-icon name="help_outline" class="icon" />
          Usage Instructions
        </h3>

        <!-- Custom Pages Instructions -->
        <div class="usage-item">
          <h4>Custom Pages</h4>
          <ul>
            <li>The extension will automatically create a <code>public/page</code> directory in your Directus root folder upon first installation.</li>
            <li>An initial <code>index.html</code> file will be created in the page directory.</li>
            <li>Access your custom pages via <code>/custompage/view</code> endpoint.</li>
            <!-- New Rule: Describe the .disable file for access restriction -->
            <li>Access restriction for custom pages is managed via a <code>.disable</code> file within the <code>public/page</code> directory. If this file exists, access is denied.</li>
            <li>Access static resources via <code>/custompage/static/fileName.ext</code>  (where fileName.ext is the name of the static resource file to be accessed).</li>
          </ul>
        </div>

        <!-- Custom Scripts Instructions -->
        <div class="usage-item">
          <h4>Custom Scripts</h4>
          <ul>
            <li>Access custom JavaScript scripts via <code>/customjs/scripts</code> endpoint.</li>
            <li>The endpoint returns a JSON object containing scripts for both <code>head</code> and <code>body</code> sections.</li>
            <li>Scripts are automatically filtered based on user permissions (admin vs non-admin).</li>
            <li>Admin user scripts take priority when available.</li>
          </ul>
        </div>

        <!-- New Rule: Describe Settings Storage -->
        <div class="usage-item">
          <h4>Extension Settings</h4>
          <ul>
            <li>Automatically creates a JSON field <code>ext_custom_scripts_page_settings</code> in the <code>directus_settings</code> collection to store adminScript, appScript content, and access permissions.</li>
          </ul>
        </div>

        <!-- Security Configuration Instructions -->
        <div class="usage-item">
          <h4>Security Configuration</h4>
          <ul>
            <li>To execute custom scripts, add this to your environment variables:</li>
            <li><code>CONTENT_SECURITY_POLICY_DIRECTIVES__SCRIPT_SRC="'self' 'unsafe-inline' 'unsafe-eval'"</code></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Toggle Control Area -->
    <div class="toggle-grid">
      <div class="toggle-item">
        <h4>Admin Script</h4>
        <div class="custom-switch" @click="toggleAdminScript">
          <div class="switch-track" :class="{ active: adminScriptActive }">
            <div class="switch-thumb"></div>
          </div>
          <span>{{ adminScriptActive ? 'ON' : 'OFF' }}</span>
        </div>
      </div>

      <div class="toggle-item">
        <h4>App Script</h4>
        <div class="custom-switch" @click="toggleAppScript">
          <div class="switch-track" :class="{ active: appScriptActive }">
            <div class="switch-thumb"></div>
          </div>
          <span>{{ appScriptActive ? 'ON' : 'OFF' }}</span>
        </div>
      </div>

      <div class="toggle-item">
        <h4>Custom HTML</h4>
        <div class="custom-switch" @click="toggleCustomHtml">
          <div class="switch-track" :class="{ active: customHtmlActive }">
            <div class="switch-thumb"></div>
          </div>
          <span>{{ customHtmlActive ? 'ON' : 'OFF' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, computed, onMounted } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { useI18n } from 'vue-i18n';

export default {
  setup() {
    const { t } = useI18n();
    const api = useApi();

    // Reactive state
    const adminScriptActive = ref(false);
    const appScriptActive = ref(false);
    const customHtmlActive = ref(false);
    const isLoading = ref(false);

    // Computed properties
    const hasAdminChanges = computed(() => adminScriptActive.value !== originalAdminValue.value);
    const hasAppChanges = computed(() => appScriptActive.value !== originalAppValue.value);
    const hasCustomHtmlChanges = computed(() => customHtmlActive.value !== originalCustomHtmlValue.value);

    // Original values for comparison
    const originalAdminValue = ref(null);
    const originalAppValue = ref(null);
    const originalCustomHtmlValue = ref(null);

    // Methods
    async function loadSettings() {
      try {
        isLoading.value = true;
        const response = await api.get('/settings');
        // Get custom page status
        const pageVisible = await api.post('/custompage/setting/status')
        const settings = response.data.data;
        const pageStatus = pageVisible.data.data.visible;
        if (settings.ext_custom_scripts_page_settings) {
          const savedSettings = settings.ext_custom_scripts_page_settings;
          
          adminScriptActive.value = savedSettings.adminScript || false;
          appScriptActive.value = savedSettings.appScript || false;
          customHtmlActive.value = pageVisible.data.data.visible || false;
          
          originalAdminValue.value = savedSettings.adminScript;
          originalAppValue.value = savedSettings.appScript;
          originalCustomHtmlValue.value = pageVisible.data.data.visible;
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        isLoading.value = false;
      }
    }

    async function toggleAdminScript() {
      adminScriptActive.value = !adminScriptActive.value;
      await saveSetting('adminScript', adminScriptActive.value);
    }

    async function toggleAppScript() {
      appScriptActive.value = !appScriptActive.value;
      await saveSetting('appScript', appScriptActive.value);
    }

    async function toggleCustomHtml() {
      customHtmlActive.value = !customHtmlActive.value;
      await saveSetting('customPage', customHtmlActive.value);
    }

    async function saveSetting(key, value) {
      try {
        // Get current settings first
        const response = await api.get('/settings');
        const currentSettings = response.data.data;
        let settings = {};

        if (currentSettings.ext_custom_scripts_page_settings) {
          settings = currentSettings.ext_custom_scripts_page_settings;
        }

        // Update the specific setting
        settings[key] = value;
        // Upadte custom page status
        if (key === 'customPage') {
          await api.post('/custompage/setting/disable', {
            visible: value
          });
        }
        // Save back to Directus
        await api.patch('/settings', {
          ext_custom_scripts_page_settings: JSON.stringify(settings)
        });

        // Update original values after successful save
        if (key === 'adminScript') originalAdminValue.value = value;
        if (key === 'appScript') originalAppValue.value = value;
        if (key === 'customPage') originalCustomHtmlValue.value = value;
      } catch (error) {
        console.error(`Failed to save ${key}:`, error);
        // Revert the toggle if save fails
        if (key === 'adminScript') adminScriptActive.value = !value;
        if (key === 'appScript') appScriptActive.value = !value;
        if (key === 'customPage') customHtmlActive.value = !value;
      }
    }

    // Lifecycle hook
    onMounted(() => {
      loadSettings();
    });

    return {
      t,
      adminScriptActive,
      appScriptActive,
      customHtmlActive,
      isLoading,
      hasAdminChanges,
      hasAppChanges,
      hasCustomHtmlChanges,
      toggleAdminScript,
      toggleAppScript,
      toggleCustomHtml
    };
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;

  .welcome-message {
    text-align: center;
    margin: 2rem 0;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--foreground-subdued);
    }
  }

  .warning-message {
    display: flex;
    background-color: var(--warning-10);
    border: 1px solid var(--warning-25);
    border-radius: var(--border-radius);
    padding: 1rem;
    margin-bottom: 2rem;

    .warning-icon {
      margin-right: 1rem;
      color: var(--warning);
    }

    .warning-content {
      h3 {
        color: var(--warning);
        margin-bottom: 0.5rem;
      }

      ul {
        margin-top: 0.5rem;
        padding-left: 1.5rem;

        li {
          margin-bottom: 0.25rem;
          color: var(--foreground-subdued);
        }
      }
    }
  }

  .usage-section .icon {
    color: var(--primary);
  }

  .usage-content {
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 20px;
    margin-top: 15px;
  }

  .usage-item {
    margin-bottom: 20px;
  }

  .usage-item h4 {
    color: var(--primary);
    margin-bottom: 10px;
    font-size: 16px;
  }

  .usage-item ul {
    margin-left: 20px;
    color: #555;
  }

  .usage-item li {
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .usage-item code {
    background-color: #e8e8e8;
    padding: 2px 5px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }

  .usage-section {
    margin-bottom: 2rem;

    h3 {
      margin-bottom: 1rem;
    }

    .usage-content {
      min-height: 100px;
      border: 1px dashed var(--border-normal);
      border-radius: var(--border-radius);
      padding: 1rem;
    }
  }

  .toggle-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;

    .toggle-item {
      background: var(--background-subdued);
      border-radius: var(--border-radius);
      padding: 1rem;
      text-align: center;

      h4 {
        margin-bottom: 1rem;
      }

      .custom-switch {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .switch-track {
          width: 50px;
          height: 24px;
          background-color: var(--danger);
          border-radius: 12px;
          position: relative;
          transition: background-color 0.2s;
          margin-right: 0.5rem;

          &.active {
            background-color: var(--success);

            .switch-thumb {
              transform: translateX(26px);
              background-color: white;

            }
          }

          .switch-thumb {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.2s;
          }
        }
      }
    }
  }
}
</style>
