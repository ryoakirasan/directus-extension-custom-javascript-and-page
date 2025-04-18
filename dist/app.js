import { resolveComponent, openBlock, createBlock, withCtx, createElementBlock, Fragment, renderList, createVNode, createCommentVNode, ref, computed, onMounted, createElementVNode, createTextVNode, watch, createStaticVNode, normalizeClass, toDisplayString, createSlots, resolveDynamicComponent, normalizeStyle } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$5 = {
    name: 'PageNavigation',
    inheritAttrs: false,
    props: {
      current: {
        type: String,
        default: null,
      },
      pages: {
        type: Array,
        default: [],
      },
    },
  };

function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_icon = resolveComponent("v-icon");
  const _component_v_list_item_icon = resolveComponent("v-list-item-icon");
  const _component_v_text_overflow = resolveComponent("v-text-overflow");
  const _component_v_list_item_content = resolveComponent("v-list-item-content");
  const _component_v_list_item = resolveComponent("v-list-item");
  const _component_v_list = resolveComponent("v-list");

  return ($props.pages)
    ? (openBlock(), createBlock(_component_v_list, {
        key: 0,
        nav: ""
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.pages, (navItem) => {
            return (openBlock(), createBlock(_component_v_list_item, {
              key: navItem.to,
              active: navItem.uri == $props.current,
              to: navItem.to
            }, {
              default: withCtx(() => [
                createVNode(_component_v_list_item_icon, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_icon, {
                      name: navItem.icon,
                      color: navItem.color
                    }, null, 8 /* PROPS */, ["name", "color"])
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1024 /* DYNAMIC_SLOTS */),
                createVNode(_component_v_list_item_content, null, {
                  default: withCtx(() => [
                    createVNode(_component_v_text_overflow, {
                      text: navItem.label
                    }, null, 8 /* PROPS */, ["text"])
                  ]),
                  _: 2 /* DYNAMIC */
                }, 1024 /* DYNAMIC_SLOTS */)
              ]),
              _: 2 /* DYNAMIC */
            }, 1032 /* PROPS, DYNAMIC_SLOTS */, ["active", "to"]))
          }), 128 /* KEYED_FRAGMENT */))
        ]),
        _: 1 /* STABLE */
      }))
    : createCommentVNode("v-if", true)
}
var PageNavigation = /*#__PURE__*/_export_sfc(_sfc_main$5, [['render',_sfc_render$5],['__file',"navigation.vue"]]);

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css$4 = ".cus-script-content {\n  margin: 0 auto; }\n  .cus-script-content .cus-script-edit {\n    margin-bottom: 2rem; }\n  .cus-script-content .cus-script-title {\n    font-weight: bold;\n    font-size: larger;\n    margin-bottom: 0.5rem; }\n  .cus-script-content .v-input.textarea {\n    font-family: monospace;\n    font-size: 14px; }\n  .cus-script-content .cus-save-button {\n    margin-top: 20px;\n    text-align: right; }\n";
n(css$4,{});

const _sfc_main$4 = {
    props: {
        banner: {
            type: String,
            default: ''
        }
    },
    setup() {
        const { t } = useI18n();
        const api = useApi();

        const scriptsData = ref({
            head: '',
            body: ''
        });
        const originalData = ref(null);
        const saving = ref(false);

        const hasChanges = computed(() => {
            if (!originalData.value) return false;
            return (
                scriptsData.value.head !== originalData.value.head ||
                scriptsData.value.body !== originalData.value.body
            );
        });

        async function loadScripts() {
            try {
                const response = await api.get('/settings');
                const settings = response.data.data;

                if (settings.ext_custom_scripts_page_settings) {
                    const scripts = settings.ext_custom_scripts_page_settings;
                    originalData.value = scripts.isAdmin;
                    scriptsData.value = {
                        head: scripts.isAdmin.head,
                        body: scripts.isAdmin.body
                    };
                }
            } catch (error) {
                console.error('Failed to load scripts:', error);
            }
        }

        async function saveScripts() {
            saving.value = true;
            try {
                // Get current settings first
                const response = await api.get('/settings');
                const currentSettings = response.data.data;
                let scripts = {};

                if (currentSettings.ext_custom_scripts_page_settings) {
                    scripts = currentSettings.ext_custom_scripts_page_settings;
                }

                // Update the admin scripts
                scripts.isAdmin = {
                    head: scriptsData.value.head,
                    body: scriptsData.value.body
                };

                // Save back to Directus
                await api.patch('/settings', {
                    ext_custom_scripts_page_settings: JSON.stringify(scripts)
                });

                // Update original data to reflect the saved state
                originalData.value = { ...scriptsData.value };

                // Optionally show success notification here
                // notify.success('Scripts saved successfully');
            } catch (error) {
                console.error('Failed to save scripts:', error);
                // Optionally show error notification here
                // notify.error('Failed to save scripts');
            } finally {
                saving.value = false;
            }
        }

        onMounted(() => {
            loadScripts();
        });

        return {
            t,
            scriptsData,
            saving,
            hasChanges,
            saveScripts
        };
    }
};

const _hoisted_1$4 = { class: "cus-script-content" };
const _hoisted_2$4 = { class: "cus-script-edit" };
const _hoisted_3$4 = { class: "cus-script-edit" };
const _hoisted_4$4 = { class: "cus-save-button" };

function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_textarea = resolveComponent("v-textarea");
  const _component_v_button = resolveComponent("v-button");

  return (openBlock(), createElementBlock("div", _hoisted_1$4, [
    createCommentVNode(" Head Script Textarea "),
    createElementVNode("div", _hoisted_2$4, [
      _cache[2] || (_cache[2] = createElementVNode("span", { class: "cus-script-title" }, "Head Script", -1 /* HOISTED */)),
      createElementVNode("div", null, [
        createVNode(_component_v_textarea, {
          modelValue: $setup.scriptsData.head,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($setup.scriptsData.head) = $event)),
          "full-width": true,
          trim: true,
          placeholder: "Enter head script",
          nullable: false
        }, null, 8 /* PROPS */, ["modelValue"])
      ])
    ]),
    createCommentVNode(" Body Script Textarea "),
    createElementVNode("div", _hoisted_3$4, [
      _cache[4] || (_cache[4] = createElementVNode("span", { class: "cus-script-title" }, "Body Script", -1 /* HOISTED */)),
      createElementVNode("div", null, [
        createVNode(_component_v_textarea, {
          modelValue: $setup.scriptsData.body,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($setup.scriptsData.body) = $event)),
          "full-width": true,
          trim: true,
          placeholder: "Enter body script",
          nullable: false
        }, null, 8 /* PROPS */, ["modelValue"])
      ]),
      createCommentVNode(" Save Button "),
      createElementVNode("div", _hoisted_4$4, [
        createVNode(_component_v_button, {
          onClick: $setup.saveScripts,
          disabled: !$setup.hasChanges,
          loading: $setup.saving,
          small: true,
          rounded: false,
          outlined: false,
          icon: false,
          autofocus: false
        }, {
          default: withCtx(() => _cache[3] || (_cache[3] = [
            createTextVNode(" Save ")
          ])),
          _: 1 /* STABLE */
        }, 8 /* PROPS */, ["onClick", "disabled", "loading"])
      ])
    ])
  ]))
}
var AdminScripts = /*#__PURE__*/_export_sfc(_sfc_main$4, [['render',_sfc_render$4],['__file',"admin-scripts.vue"]]);

var css$3 = ".cus-script-content {\n  margin: 0 auto; }\n  .cus-script-content .cus-script-edit {\n    margin-bottom: 2rem; }\n  .cus-script-content .cus-script-title {\n    font-weight: bold;\n    font-size: larger;\n    margin-bottom: 0.5rem; }\n  .cus-script-content .v-input.textarea {\n    font-family: monospace;\n    font-size: 14px; }\n  .cus-script-content .cus-save-button {\n    margin-top: 20px;\n    text-align: right; }\n";
n(css$3,{});

const _sfc_main$3 = {
    props: {
        banner: {
            type: String,
            default: ''
        }
    },
    setup() {
        const { t } = useI18n();
        const api = useApi();

        const scriptsData = ref({
            head: '',
            body: ''
        });
        const originalData = ref(null);
        const saving = ref(false);

        const hasChanges = computed(() => {
            if (!originalData.value) return false;
            return (
                scriptsData.value.head !== originalData.value.head ||
                scriptsData.value.body !== originalData.value.body
            );
        });

        async function loadScripts() {
            try {
                const response = await api.get('/settings');
                const settings = response.data.data;

                if (settings.ext_custom_scripts_page_settings) {
                    const scripts = settings.ext_custom_scripts_page_settings;
                    originalData.value = scripts.notAdmin;
                    scriptsData.value = {
                        head: scripts.notAdmin.head,
                        body: scripts.notAdmin.body
                    };
                }
            } catch (error) {
                console.error('Failed to load scripts:', error);
            }
        }

        async function saveScripts() {
            saving.value = true;
            try {
                // Get current settings first
                const response = await api.get('/settings');
                const currentSettings = response.data.data;
                let scripts = {};

                if (currentSettings.ext_custom_scripts_page_settings) {
                    scripts = currentSettings.ext_custom_scripts_page_settings;
                }

                // Update the admin scripts
                scripts.notAdmin = {
                    head: scriptsData.value.head,
                    body: scriptsData.value.body
                };

                // Save back to Directus
                await api.patch('/settings', {
                    ext_custom_scripts_page_settings: JSON.stringify(scripts)
                });

                // Update original data to reflect the saved state
                originalData.value = { ...scriptsData.value };

                // Optionally show success notification here
                // notify.success('Scripts saved successfully');
            } catch (error) {
                console.error('Failed to save scripts:', error);
                // Optionally show error notification here
                // notify.error('Failed to save scripts');
            } finally {
                saving.value = false;
            }
        }

        onMounted(() => {
            loadScripts();
        });

        return {
            t,
            scriptsData,
            saving,
            hasChanges,
            saveScripts
        };
    }
};

const _hoisted_1$3 = { class: "cus-script-content" };
const _hoisted_2$3 = { class: "cus-script-edit" };
const _hoisted_3$3 = { class: "cus-script-edit" };
const _hoisted_4$3 = { class: "cus-save-button" };

function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_textarea = resolveComponent("v-textarea");
  const _component_v_button = resolveComponent("v-button");

  return (openBlock(), createElementBlock("div", _hoisted_1$3, [
    createCommentVNode(" Head Script Textarea "),
    createElementVNode("div", _hoisted_2$3, [
      _cache[2] || (_cache[2] = createElementVNode("span", { class: "cus-script-title" }, "Head Script", -1 /* HOISTED */)),
      createElementVNode("div", null, [
        createVNode(_component_v_textarea, {
          modelValue: $setup.scriptsData.head,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($setup.scriptsData.head) = $event)),
          "full-width": true,
          trim: true,
          placeholder: "Enter head script",
          nullable: false
        }, null, 8 /* PROPS */, ["modelValue"])
      ])
    ]),
    createCommentVNode(" Body Script Textarea "),
    createElementVNode("div", _hoisted_3$3, [
      _cache[4] || (_cache[4] = createElementVNode("span", { class: "cus-script-title" }, "Body Script", -1 /* HOISTED */)),
      createElementVNode("div", null, [
        createVNode(_component_v_textarea, {
          modelValue: $setup.scriptsData.body,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($setup.scriptsData.body) = $event)),
          "full-width": true,
          trim: true,
          placeholder: "Enter body script",
          nullable: false
        }, null, 8 /* PROPS */, ["modelValue"])
      ]),
      createCommentVNode(" Save Button "),
      createElementVNode("div", _hoisted_4$3, [
        createVNode(_component_v_button, {
          onClick: $setup.saveScripts,
          disabled: !$setup.hasChanges,
          loading: $setup.saving,
          small: true,
          rounded: false,
          outlined: false,
          icon: false,
          autofocus: false
        }, {
          default: withCtx(() => _cache[3] || (_cache[3] = [
            createTextVNode(" Save ")
          ])),
          _: 1 /* STABLE */
        }, 8 /* PROPS */, ["onClick", "disabled", "loading"])
      ])
    ])
  ]))
}
var AppScripts = /*#__PURE__*/_export_sfc(_sfc_main$3, [['render',_sfc_render$3],['__file',"app-scripts.vue"]]);

var css$2 = ".cus-script-content {\n  margin: 0 auto;\n  height: calc(100vh - 150px);\n  display: flex;\n  flex-direction: column; }\n  .cus-script-content .cus-script-row {\n    display: flex;\n    flex: 1; }\n  .cus-script-content .cus-script-edit {\n    width: 30%;\n    padding: 1rem;\n    box-sizing: border-box;\n    display: flex;\n    flex-direction: column; }\n  .cus-script-content .cus-script-preview {\n    width: 70%;\n    padding: 1rem;\n    box-sizing: border-box; }\n  .cus-script-content .cus-script-title {\n    font-weight: bold;\n    font-size: larger;\n    margin-bottom: 0.5rem;\n    display: block; }\n  .cus-script-content .v-textarea {\n    font-family: monospace;\n    font-size: 14px;\n    flex: 1; }\n  .cus-script-content .cus-script-preview-iframe {\n    width: 100%;\n    height: 100%;\n    border: 1px solid #ccc;\n    box-sizing: border-box; }\n  .cus-script-content .cus-save-button {\n    margin-top: 20px;\n    text-align: right; }\n";
n(css$2,{});

const _sfc_main$2 = {
    setup() {
        const { t } = useI18n();
        const api = useApi();

        // Reactive reference for the HTML content.
        const htmlContent = ref('');
        // Reactive reference to store the original HTML content for change detection.
        const originalContent = ref('');
        // Reactive reference to indicate whether the content is being saved.
        const saving = ref(false);
        // Reactive reference for the iframe element, allowing access to it.
        const previewFrame = ref(null);

        // Computed property to check if there are any changes in the HTML content.
        const hasChanges = computed(() => {
            return htmlContent.value !== originalContent.value;
        });

        // Computed property to generate the preview content.
        const previewContent = computed(() => {
            return htmlContent.value;
        });

        // Function to load the HTML content from the API.
        async function loadContent() {
            try {
                // Fetch HTML content from the extension endpoint.
                const response = await api.get('/custompage/setting/get');
                htmlContent.value = response.data || '';
                originalContent.value = response.data || '';
            } catch (error) {
                console.error('Failed to load HTML content:', error);
                // If loading fails, initialize with an empty string.
                htmlContent.value = '';
                originalContent.value = '';
            }
        }

        // Function to save the HTML content via the API.
        async function saveContent() {
            saving.value = true;
            try {
                // Post HTML content to the extension endpoint for saving.
                await api.post('/custompage/setting/save', {
                    page: htmlContent.value,
                });

                // Update the original content to reflect the saved state.
                originalContent.value = htmlContent.value;

                // Add a success notification here if needed.
                // notify.success('Content saved successfully');
            } catch (error) {
                console.error('Failed to save content:', error);
                // Add an error notification here if needed.
                // notify.error('Failed to save content');
            } finally {
                saving.value = false;
            }
        }

        // Watch the htmlContent for changes and automatically refresh the preview.
        watch(htmlContent, () => {
            // Add throttling logic here to avoid frequent updates if needed.
            // For example: use setTimeout to delay the update.
            // setTimeout(() => {
            //   updatePreview();
            // }, 500);
            updatePreview();
        });

        // Function to update the content of the preview iframe.
        function updatePreview() {
            if (previewFrame.value) ;
        }

        // Lifecycle hook that is called when the component is mounted.
        onMounted(() => {
            loadContent();
        });

        return {
            t,
            htmlContent,
            saving,
            hasChanges,
            saveContent,
            previewContent, // Expose the preview content
            previewFrame, // Expose the iframe reference
        };
    },
};

const _hoisted_1$2 = { class: "cus-script-content" };
const _hoisted_2$2 = { class: "cus-script-row" };
const _hoisted_3$2 = { class: "cus-script-edit" };
const _hoisted_4$2 = { class: "cus-save-button" };
const _hoisted_5$1 = { class: "cus-script-preview" };
const _hoisted_6$1 = ["srcdoc"];

function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_textarea = resolveComponent("v-textarea");
  const _component_v_button = resolveComponent("v-button");

  return (openBlock(), createElementBlock("div", _hoisted_1$2, [
    createElementVNode("div", _hoisted_2$2, [
      createCommentVNode(" HTML Content Editor "),
      createElementVNode("div", _hoisted_3$2, [
        _cache[2] || (_cache[2] = createElementVNode("span", { class: "cus-script-title" }, "HTML Content", -1 /* HOISTED */)),
        createVNode(_component_v_textarea, {
          modelValue: $setup.htmlContent,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($setup.htmlContent) = $event)),
          "full-width": true,
          trim: false,
          placeholder: "Enter HTML content",
          nullable: false
        }, null, 8 /* PROPS */, ["modelValue"]),
        createCommentVNode(" Action Buttons "),
        createElementVNode("div", _hoisted_4$2, [
          createVNode(_component_v_button, {
            onClick: $setup.saveContent,
            disabled: !$setup.hasChanges,
            loading: $setup.saving,
            small: true,
            rounded: false,
            outlined: false,
            icon: false
          }, {
            default: withCtx(() => _cache[1] || (_cache[1] = [
              createTextVNode(" Save ")
            ])),
            _: 1 /* STABLE */
          }, 8 /* PROPS */, ["onClick", "disabled", "loading"])
        ])
      ]),
      createCommentVNode(" Preview Area "),
      createElementVNode("div", _hoisted_5$1, [
        _cache[3] || (_cache[3] = createElementVNode("span", { class: "cus-script-title" }, "Preview", -1 /* HOISTED */)),
        createElementVNode("iframe", {
          ref: "previewFrame",
          class: "cus-script-preview-iframe",
          srcdoc: $setup.previewContent
        }, null, 8 /* PROPS */, _hoisted_6$1)
      ])
    ])
  ]))
}
var CustomPage = /*#__PURE__*/_export_sfc(_sfc_main$2, [['render',_sfc_render$2],['__file',"custom-page.vue"]]);

var css$1 = ".home-page[data-v-e6710a8f] {\n  max-width: 1200px;\n  margin: 0 auto; }\n\n.home-page .welcome-message[data-v-e6710a8f] {\n  text-align: center;\n  margin: 2rem 0; }\n\n.home-page .welcome-message h2[data-v-e6710a8f] {\n  font-size: 1.5rem;\n  margin-bottom: 0.5rem; }\n\n.home-page .welcome-message p[data-v-e6710a8f] {\n  color: var(--foreground-subdued); }\n\n.home-page .warning-message[data-v-e6710a8f] {\n  display: flex;\n  background-color: var(--warning-10);\n  border: 1px solid var(--warning-25);\n  border-radius: var(--border-radius);\n  padding: 1rem;\n  margin-bottom: 2rem; }\n\n.home-page .warning-message .warning-icon[data-v-e6710a8f] {\n  margin-right: 1rem;\n  color: var(--warning); }\n\n.home-page .warning-message .warning-content h3[data-v-e6710a8f] {\n  color: var(--warning);\n  margin-bottom: 0.5rem; }\n\n.home-page .warning-message .warning-content ul[data-v-e6710a8f] {\n  margin-top: 0.5rem;\n  padding-left: 1.5rem; }\n\n.home-page .warning-message .warning-content ul li[data-v-e6710a8f] {\n  margin-bottom: 0.25rem;\n  color: var(--foreground-subdued); }\n\n.home-page .usage-section .icon[data-v-e6710a8f] {\n  color: var(--primary); }\n\n.home-page .usage-content[data-v-e6710a8f] {\n  background-color: #f8f8f8;\n  border-radius: 8px;\n  padding: 20px;\n  margin-top: 15px; }\n\n.home-page .usage-item[data-v-e6710a8f] {\n  margin-bottom: 20px; }\n\n.home-page .usage-item h4[data-v-e6710a8f] {\n  color: var(--primary);\n  margin-bottom: 10px;\n  font-size: 16px; }\n\n.home-page .usage-item ul[data-v-e6710a8f] {\n  margin-left: 20px;\n  color: #555; }\n\n.home-page .usage-item li[data-v-e6710a8f] {\n  margin-bottom: 8px;\n  line-height: 1.5; }\n\n.home-page .usage-item code[data-v-e6710a8f] {\n  background-color: #e8e8e8;\n  padding: 2px 5px;\n  border-radius: 3px;\n  font-family: monospace;\n  font-size: 0.9em; }\n\n.home-page .usage-section[data-v-e6710a8f] {\n  margin-bottom: 2rem; }\n\n.home-page .usage-section h3[data-v-e6710a8f] {\n  margin-bottom: 1rem; }\n\n.home-page .usage-section .usage-content[data-v-e6710a8f] {\n  min-height: 100px;\n  border: 1px dashed var(--border-normal);\n  border-radius: var(--border-radius);\n  padding: 1rem; }\n\n.home-page .toggle-grid[data-v-e6710a8f] {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem; }\n\n.home-page .toggle-grid .toggle-item[data-v-e6710a8f] {\n  background: var(--background-subdued);\n  border-radius: var(--border-radius);\n  padding: 1rem;\n  text-align: center; }\n\n.home-page .toggle-grid .toggle-item h4[data-v-e6710a8f] {\n  margin-bottom: 1rem; }\n\n.home-page .toggle-grid .toggle-item .custom-switch[data-v-e6710a8f] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer; }\n\n.home-page .toggle-grid .toggle-item .custom-switch .switch-track[data-v-e6710a8f] {\n  width: 50px;\n  height: 24px;\n  background-color: var(--danger);\n  border-radius: 12px;\n  position: relative;\n  transition: background-color 0.2s;\n  margin-right: 0.5rem; }\n\n.home-page .toggle-grid .toggle-item .custom-switch .switch-track.active[data-v-e6710a8f] {\n  background-color: var(--success); }\n\n.home-page .toggle-grid .toggle-item .custom-switch .switch-track.active .switch-thumb[data-v-e6710a8f] {\n  transform: translateX(26px);\n  background-color: white; }\n\n.home-page .toggle-grid .toggle-item .custom-switch .switch-track .switch-thumb[data-v-e6710a8f] {\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 20px;\n  height: 20px;\n  background-color: white;\n  border-radius: 50%;\n  transition: transform 0.2s; }\n";
n(css$1,{});

const _sfc_main$1 = {
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
        const pageVisible = await api.post('/custompage/setting/status');
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

const _hoisted_1$1 = { class: "home-page" };
const _hoisted_2$1 = { class: "warning-message" };
const _hoisted_3$1 = { class: "warning-icon" };
const _hoisted_4$1 = { class: "usage-section" };
const _hoisted_5 = { class: "usage-content" };
const _hoisted_6 = { class: "toggle-grid" };
const _hoisted_7 = { class: "toggle-item" };
const _hoisted_8 = { class: "toggle-item" };
const _hoisted_9 = { class: "toggle-item" };

function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_icon = resolveComponent("v-icon");

  return (openBlock(), createElementBlock("div", _hoisted_1$1, [
    createCommentVNode(" Welcome Message "),
    _cache[15] || (_cache[15] = createElementVNode("div", { class: "welcome-message" }, [
      createElementVNode("h2", null, "Welcome to Custom Scripts & Pages")
    ], -1 /* HOISTED */)),
    createCommentVNode(" Security Warning Message "),
    createElementVNode("div", _hoisted_2$1, [
      createElementVNode("div", _hoisted_3$1, [
        createVNode(_component_v_icon, { name: "warning" })
      ]),
      _cache[3] || (_cache[3] = createElementVNode("div", { class: "warning-content" }, [
        createElementVNode("h3", null, "Security Warning"),
        createElementVNode("p", null, "When injecting custom scripts or HTML:"),
        createElementVNode("ul", null, [
          createElementVNode("li", null, "Only use code from trusted sources"),
          createElementVNode("li", null, "Malicious code can compromise your Directus instance"),
          createElementVNode("li", null, "Unauthorized scripts may expose sensitive data"),
          createElementVNode("li", null, "Improper HTML can break your admin interface")
        ])
      ], -1 /* HOISTED */))
    ]),
    createCommentVNode(" Usage Instructions Section "),
    createElementVNode("div", _hoisted_4$1, [
      createElementVNode("div", _hoisted_5, [
        createElementVNode("h3", null, [
          createVNode(_component_v_icon, {
            name: "help_outline",
            class: "icon"
          }),
          _cache[4] || (_cache[4] = createTextVNode(" Usage Instructions "))
        ]),
        createCommentVNode(" Custom Pages Instructions "),
        _cache[5] || (_cache[5] = createStaticVNode("<div class=\"usage-item\" data-v-e6710a8f><h4 data-v-e6710a8f>Custom Pages</h4><ul data-v-e6710a8f><li data-v-e6710a8f>The extension will automatically create a <code data-v-e6710a8f>public/page</code> directory in your Directus root folder upon first installation.</li><li data-v-e6710a8f>An initial <code data-v-e6710a8f>index.html</code> file will be created in the page directory.</li><li data-v-e6710a8f>Access your custom pages via <code data-v-e6710a8f>/custompage/view</code> endpoint.</li><!-- New Rule: Describe the .disable file for access restriction --><li data-v-e6710a8f>Access restriction for custom pages is managed via a <code data-v-e6710a8f>.disable</code> file within the <code data-v-e6710a8f>public/page</code> directory. If this file exists, access is denied.</li><li data-v-e6710a8f>Access static resources via <code data-v-e6710a8f>/custompage/static/fileName.ext</code> (where fileName.ext is the name of the static resource file to be accessed).</li></ul></div>", 1)),
        createCommentVNode(" Custom Scripts Instructions "),
        _cache[6] || (_cache[6] = createStaticVNode("<div class=\"usage-item\" data-v-e6710a8f><h4 data-v-e6710a8f>Custom Scripts</h4><ul data-v-e6710a8f><li data-v-e6710a8f>Access custom JavaScript scripts via <code data-v-e6710a8f>/customjs/scripts</code> endpoint.</li><li data-v-e6710a8f>The endpoint returns a JSON object containing scripts for both <code data-v-e6710a8f>head</code> and <code data-v-e6710a8f>body</code> sections.</li><li data-v-e6710a8f>Scripts are automatically filtered based on user permissions (admin vs non-admin).</li><li data-v-e6710a8f>Admin user scripts take priority when available.</li></ul></div>", 1)),
        createCommentVNode(" New Rule: Describe Settings Storage "),
        _cache[7] || (_cache[7] = createElementVNode("div", { class: "usage-item" }, [
          createElementVNode("h4", null, "Extension Settings"),
          createElementVNode("ul", null, [
            createElementVNode("li", null, [
              createTextVNode("Automatically creates a JSON field "),
              createElementVNode("code", null, "ext_custom_scripts_page_settings"),
              createTextVNode(" in the "),
              createElementVNode("code", null, "directus_settings"),
              createTextVNode(" collection to store adminScript, appScript content, and access permissions.")
            ])
          ])
        ], -1 /* HOISTED */)),
        createCommentVNode(" Security Configuration Instructions "),
        _cache[8] || (_cache[8] = createElementVNode("div", { class: "usage-item" }, [
          createElementVNode("h4", null, "Security Configuration"),
          createElementVNode("ul", null, [
            createElementVNode("li", null, "To execute custom scripts, add this to your environment variables:"),
            createElementVNode("li", null, [
              createElementVNode("code", null, "CONTENT_SECURITY_POLICY_DIRECTIVES__SCRIPT_SRC=\"'self' 'unsafe-inline' 'unsafe-eval'\"")
            ])
          ])
        ], -1 /* HOISTED */))
      ])
    ]),
    createCommentVNode(" Toggle Control Area "),
    createElementVNode("div", _hoisted_6, [
      createElementVNode("div", _hoisted_7, [
        _cache[10] || (_cache[10] = createElementVNode("h4", null, "Admin Script", -1 /* HOISTED */)),
        createElementVNode("div", {
          class: "custom-switch",
          onClick: _cache[0] || (_cache[0] = (...args) => ($setup.toggleAdminScript && $setup.toggleAdminScript(...args)))
        }, [
          createElementVNode("div", {
            class: normalizeClass(["switch-track", { active: $setup.adminScriptActive }])
          }, _cache[9] || (_cache[9] = [
            createElementVNode("div", { class: "switch-thumb" }, null, -1 /* HOISTED */)
          ]), 2 /* CLASS */),
          createElementVNode("span", null, toDisplayString($setup.adminScriptActive ? 'ON' : 'OFF'), 1 /* TEXT */)
        ])
      ]),
      createElementVNode("div", _hoisted_8, [
        _cache[12] || (_cache[12] = createElementVNode("h4", null, "App Script", -1 /* HOISTED */)),
        createElementVNode("div", {
          class: "custom-switch",
          onClick: _cache[1] || (_cache[1] = (...args) => ($setup.toggleAppScript && $setup.toggleAppScript(...args)))
        }, [
          createElementVNode("div", {
            class: normalizeClass(["switch-track", { active: $setup.appScriptActive }])
          }, _cache[11] || (_cache[11] = [
            createElementVNode("div", { class: "switch-thumb" }, null, -1 /* HOISTED */)
          ]), 2 /* CLASS */),
          createElementVNode("span", null, toDisplayString($setup.appScriptActive ? 'ON' : 'OFF'), 1 /* TEXT */)
        ])
      ]),
      createElementVNode("div", _hoisted_9, [
        _cache[14] || (_cache[14] = createElementVNode("h4", null, "Custom HTML", -1 /* HOISTED */)),
        createElementVNode("div", {
          class: "custom-switch",
          onClick: _cache[2] || (_cache[2] = (...args) => ($setup.toggleCustomHtml && $setup.toggleCustomHtml(...args)))
        }, [
          createElementVNode("div", {
            class: normalizeClass(["switch-track", { active: $setup.customHtmlActive }])
          }, _cache[13] || (_cache[13] = [
            createElementVNode("div", { class: "switch-thumb" }, null, -1 /* HOISTED */)
          ]), 2 /* CLASS */),
          createElementVNode("span", null, toDisplayString($setup.customHtmlActive ? 'ON' : 'OFF'), 1 /* TEXT */)
        ])
      ])
    ])
  ]))
}
var HomePage = /*#__PURE__*/_export_sfc(_sfc_main$1, [['render',_sfc_render$1],['__scopeId',"data-v-e6710a8f"],['__file',"home.vue"]]);

var css = ".lp-container {\n  padding: var(--content-padding);\n  padding-top: 0;\n  width: 100%; }\n  .lp-container > div {\n    margin-bottom: var(--content-padding); }\n\n.lp-banner {\n  border-radius: var(--border-radius);\n  overflow: hidden; }\n  .lp-banner img {\n    display: block;\n    width: 100%; }\n\n.lp-cards {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  column-gap: var(--input-padding);\n  row-gap: var(--input-padding); }\n  .lp-cards .lp-card {\n    display: flex;\n    flex-wrap: wrap;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    border-radius: var(--border-radius);\n    padding: var(--input-padding);\n    color: white; }\n    .lp-cards .lp-card .v-icon {\n      width: 100%;\n      height: 50px;\n      margin-bottom: 6px; }\n      .lp-cards .lp-card .v-icon i {\n        font-size: 50px;\n        color: white; }\n    .lp-cards .lp-card .lp-card-title {\n      display: block;\n      font-weight: bold;\n      font-size: 1.4em;\n      line-height: 1.2; }\n";
n(css,{});

const _sfc_main = {
    components: {
        PageNavigation,
        AdminScripts,
        AppScripts,
        CustomPage,
        HomePage // Add this
    },
    props: {
        page: {
            type: String,
            default: 'home',
        },
    },
    setup(props) {
        const router = useRouter();
        useApi();
        // const { addTokenToURL } = useDirectusToken(api);

        const page_title = ref('');
        const page_banner = ref('');
        const page_cards = ref([]);
        const breadcrumb = ref([{ name: 'Custom Scripts', to: "" }]);
        const all_pages = ref([]);

        const currentComponent = computed(() => {
            switch (props.page) {
                case 'admin-scripts': return 'AdminScripts';
                case 'app-scripts': return 'AppScripts';
                case 'custom-pages': return 'CustomPage';
                case 'home': return 'HomePage';
                default: return 'HomePage';
            }
        });

        const isHomeView = computed(() => props.page === 'home');

        fetch_all_pages();
        render_page(props.page);

        watch(
            () => props.page,
            () => render_page(props.page)
        );

        function change_page(to) {
            router.push(to);
        }

        function render_page(page) {
            if (page === null) {
                page_title.value = '500: Internal Server Error';
                breadcrumb.value.splice(1, 1);
                page_banner.value = '';
            } else {
                switch (page) {
                    case 'admin-scripts':
                        page_title.value = 'Custom Admin Scripts';
                        break;
                    case 'app-scripts':
                        page_title.value = 'Custom App Scripts';
                        break;
                    case 'custom-pages':
                        page_title.value = 'Custom Public Page';
                        break;
                    case 'home':
                        page_title.value = 'Home';
                        break;
                    default:
                        page_title.value = '404: Not Found';
                }

                if (page === 'home') {
                    breadcrumb.value.splice(1, 1);
                } else {
                    breadcrumb.value[1] = {
                        name: page_title.value,
                        to: `/ext-custom-scripts-page/${page}`,
                    };
                }
            }
        }

        function fetch_all_pages() {
            all_pages.value = [
                {
                    label: 'Home',
                    uri: 'home',
                    to: '/ext-custom-scripts-page/home',
                    icon: 'home',
                    color: '#10c96a',
                },
                {
                    label: 'Admin Script',
                    uri: 'admin-scripts',
                    to: '/ext-custom-scripts-page/admin-scripts',
                    icon: 'settings_accessibility',
                    color: '#10b6c9',
                },
                {
                    label: 'App Script',
                    uri: 'app-scripts',
                    to: '/ext-custom-scripts-page/app-scripts',
                    icon: 'terminal',
                    color: '#107cc9',
                },
                {
                    label: 'Custom Page',
                    uri: 'custom-pages',
                    to: '/ext-custom-scripts-page/custom-pages',
                    icon: 'html',
                    color: '#8510c9',
                },
            ];
        }


        return {
            page_title,
            page_banner,
            page_cards,
            breadcrumb,
            all_pages,
            change_page,
            currentComponent,
            isHomeView
        };
    },
};

const _hoisted_1 = { class: "lp-container" };
const _hoisted_2 = {
  key: 1,
  class: "lp-cards"
};
const _hoisted_3 = ["onClick"];
const _hoisted_4 = { class: "lp-card-title" };

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_breadcrumb = resolveComponent("v-breadcrumb");
  const _component_page_navigation = resolveComponent("page-navigation");
  const _component_v_icon = resolveComponent("v-icon");
  const _component_private_view = resolveComponent("private-view");

  return (openBlock(), createBlock(_component_private_view, { title: $setup.page_title }, createSlots({
    navigation: withCtx(() => [
      createVNode(_component_page_navigation, {
        current: $props.page,
        pages: $setup.all_pages
      }, null, 8 /* PROPS */, ["current", "pages"])
    ]),
    default: withCtx(() => [
      createElementVNode("div", _hoisted_1, [
        ($setup.currentComponent)
          ? (openBlock(), createBlock(resolveDynamicComponent($setup.currentComponent), {
              key: 0,
              banner: $setup.page_banner
            }, null, 8 /* PROPS */, ["banner"]))
          : createCommentVNode("v-if", true),
        ($setup.page_cards && $setup.isHomeView)
          ? (openBlock(), createElementBlock("div", _hoisted_2, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($setup.page_cards.filter(item => (item.uri != $props.page)), (card) => {
                return (openBlock(), createElementBlock("div", {
                  class: "lp-card",
                  key: card.uri,
                  style: normalizeStyle(`background-color: ${card.color}`),
                  onClick: $event => ($setup.change_page(card.to))
                }, [
                  createVNode(_component_v_icon, {
                    name: card.icon
                  }, null, 8 /* PROPS */, ["name"]),
                  createElementVNode("span", _hoisted_4, toDisplayString(card.label), 1 /* TEXT */)
                ], 12 /* STYLE, PROPS */, _hoisted_3))
              }), 128 /* KEYED_FRAGMENT */))
            ]))
          : createCommentVNode("v-if", true)
      ])
    ]),
    _: 2 /* DYNAMIC */
  }, [
    ($setup.breadcrumb)
      ? {
          name: "headline",
          fn: withCtx(() => [
            createVNode(_component_v_breadcrumb, { items: $setup.breadcrumb }, null, 8 /* PROPS */, ["items"])
          ]),
          key: "0"
        }
      : undefined
  ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["title"]))
}
var ModuleComponent = /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__file',"module.vue"]]);

var e0 = {
  id: "ext-custom-scripts-page",
  // root URI
  name: "Custom Scripts&Page",
  icon: "handyman",
  routes: [
    {
      path: "",
      redirect: "/ext-custom-scripts-page/home"
      // Add this redirect
    },
    {
      path: ":page",
      component: ModuleComponent,
      props: (route) => ({
        page: route.params.page || "home"
      })
    }
  ]
};

const interfaces = [];const displays = [];const layouts = [];const modules = [e0];const panels = [];const themes = [];const operations = [];

export { displays, interfaces, layouts, modules, operations, panels, themes };
