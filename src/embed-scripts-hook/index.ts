import { defineHook } from "@directus/extensions-sdk";

const script = `
let isExecuting = false;
let isInitialized = false;
let lastHref = window.location.href;
let cachedScriptContent = null; // 缓存远程脚本内容
let lastMutationTime = 0; // 记录上一次变动的时间
const DEBOUNCE_TIME = 300; // 防抖时间（单位：毫秒）
// 请求并缓存远程脚本
function loadRemoteScript() {
    if (cachedScriptContent&&cachedScriptContent!=='') {
        return Promise.resolve(cachedScriptContent); // 如果已缓存，直接返回
    }

    return fetch('/customjs/scripts')
        .then(response => response.text())
        .then(scriptContent => {
            if (scriptContent === '') {
                return null; // 如果脚本内容为空，返回null
            }
            cachedScriptContent = JSON.parse(scriptContent); // 缓存脚本内容
            return JSON.parse(scriptContent);
        })
        .catch(error => {
            console.error('Error loading remote script:', error);
            throw error;
        });
}

// 动态插入脚本，head类型插入到head标签最后面，body类型插入到body中
function insertScript() {
    if (!cachedScriptContent||cachedScriptContent==='') {
        return; // 如果没有缓存的脚本内容，直接返回
    }
    const loadingTypes = ['head', 'body'];
    
    loadingTypes.forEach(loadingType => {
        const scriptElement = document.getElementById('custom-embed-' + loadingType);
        if (scriptElement) {
            scriptElement.remove(); // 删除现有的script元素
        }

        const newScriptElement = document.createElement('script');
        newScriptElement.id = 'custom-embed-' + loadingType;
        const script = cachedScriptContent[loadingType];
        
        // 增加判断：只有当脚本内容不为空且不为空字符串时才执行插入操作
        if (!script || script.trim() === '') {
            return;
        }
        
        newScriptElement.innerHTML = script; // 插入缓存的脚本内容
        
        if (loadingType === 'head') {
            // 插入到head标签的最后面
            document.head.appendChild(newScriptElement);
        } else {
            // 插入到body中
            document.body.appendChild(newScriptElement);
        }
    });
}


// 执行控制机制
async function safeExecute() {
    if (isExecuting) return; // 如果正在执行，直接返回
    isExecuting = true;

    try {
        await loadRemoteScript();
        insertScript(); // 动态插入缓存的脚本
        isInitialized = true;
    } catch (error) {
        console.error('Error during script execution:', error);
    } finally {
        setTimeout(() => {
            isExecuting = false; // 执行完成后重置标志
        }, 100);
    }
}

// 监听路由变化
function handleRouteChange() {
    const currentHref = window.location.href;
    if (currentHref !== lastHref) {
        lastHref = currentHref;
        safeExecute();
    }
}

// 1. 监听history.pushState/replaceState
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function (...args) {
    originalPushState.apply(history, args);
    handleRouteChange();
};

history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    handleRouteChange();
};

// 2. 监听popstate事件（浏览器的前进/后退）
window.addEventListener('popstate', handleRouteChange);

// 3. 监听#app子树变化
function observeAppDivChanges() {
    const targetNode = document.getElementById('app');

    if (!targetNode) {
        console.error("未找到id为app的元素");
        return;
    }

    const config = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
    };

    const observer = new MutationObserver((mutationsList) => {
        const currentTime = Date.now();
        if (currentTime - lastMutationTime < DEBOUNCE_TIME) {
            return; // 如果距离上一次变动时间小于防抖时间，直接返回
        }

        lastMutationTime = currentTime; // 记录当前变动时间

        const hasRelevantChange = mutationsList.some(mutation => {
            return mutation.type === 'childList';
        });

        if (hasRelevantChange && isInitialized) {
            safeExecute();
        }
    });

    observer.observe(targetNode, config);
}

// 初始执行（仅一次）
if (!isInitialized) {
    safeExecute();
}

// 页面加载完成后调用监听方法
window.onload = function () {
    observeAppDivChanges();
    // observeDynamicElements();
};

`;

export default defineHook(({ filter, action, embed }, { services }) => {
  embed(
    "head",
    `
    <script>
    ${script}
    </script>
    <script id="custom-embed-header"></script>
    `
  );
  embed(
    "body",
    `
    <script id="custom-embed-body"></script>
    `
  );
  const { collectionsService, FieldsService } = services;

  filter("settings.read", (items: any, meta, context) => {
    const accountability = context.accountability;
    items = items.map((item: any) => {
      // disable ext-custom-scripts-page module,user not admin
      if (accountability?.admin != true) {
        item.module_bar = item.module_bar?.map((module: any) => {
          if (module.id === "ext-custom-scripts-page") {
            module.enabled = false;
          }
          return module;
        });
      }
      const fieldsService = new FieldsService({
        schema: context.schema,
        accountability: accountability,
      });
      if (item?.ext_custom_scripts_page_settings == undefined||item?.ext_custom_scripts_page_settings == null) {
        fieldsService.createField('directus_settings', {
            "field": "ext_custom_scripts_page_settings",
            "type": "json",
            "meta": {
                "special": [
                    "cast-json"
                ],
                "interface": "input-code",
                "options": {
                    "template": ""
                },
                "display": null,
                "display_options": null,
                "readonly": false,
                "hidden": true,
                "sort": 8,
                "width": "full",
                "translations": null,
                "note": null,
                "conditions": null,
                "required": false,
                "group": null,
                "validation": null,
                "validation_message": null
            },
            "schema": {
                "data_type": "json",
                "default_value": JSON.stringify(
                    {
                        "adminScript": false,
                        "appScript": false,
                        "isAdmin": {
                            "head": "console.log('head admin')",
                            "body": "console.log('body admin')"
                        },
                        "notAdmin": {
                            "head": "console.log('head not admin')",
                            "body": "console.log('body not admin')"
                        }
                    }
                ),
                "generation_expression": null,
                "max_length": null,
                "numeric_precision": null,
                "numeric_scale": null,
                "is_generated": false,
                "is_nullable": true,
                "is_unique": false,
                "is_indexed": false,
                "is_primary_key": false,
                "has_auto_increment": false,
                "foreign_key_schema": null,
                "foreign_key_table": null,
                "foreign_key_column": null,
                "comment": null
            }
        });
      }
      return item;
    });

    return items;
  });
});
