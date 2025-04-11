import { defineHook } from "@directus/extensions-sdk";

const script = `
/**
 * @file This script dynamically loads and executes remote scripts based on route changes and DOM mutations.
 * @author [Your Name]
 * @version 1.0.0
 */

let isExecuting = false; // Flag to prevent concurrent executions
let isInitialized = false; // Flag to indicate if the script has been initialized
let lastHref = window.location.href; // Store the last visited URL
let cachedScriptContent = null; // Cache for storing the remote script content
let lastMutationTime = 0; // Timestamp of the last DOM mutation
const DEBOUNCE_TIME = 300; // Debounce time in milliseconds to prevent rapid executions

/**
 * Fetches the remote script from the specified endpoint and caches it.
 * @returns {Promise<object|null>} A promise that resolves with the parsed JSON content of the script, or null if the script content is empty.
 * @throws {Error} If there is an error during the fetch operation.
 */
function loadRemoteScript() {
    if (cachedScriptContent && cachedScriptContent !== '') {
        return Promise.resolve(cachedScriptContent); // Return cached content if available
    }

    return fetch('/customjs/scripts')
        .then(response => response.text())
        .then(scriptContent => {
            if (scriptContent === '') {
                return null; // Return null if the script content is empty
            }
            cachedScriptContent = JSON.parse(scriptContent); // Cache the script content
            return JSON.parse(scriptContent);
        })
        .catch(error => {
            console.error('Error loading remote script:', error);
            throw error;
        });
}

/**
 * Inserts the cached script into the DOM, either in the head or body.
 * The script is inserted based on the 'head' and 'body' keys in the cached script content.
 */
function insertScript() {
    if (!cachedScriptContent || cachedScriptContent === '') {
        return; // Do nothing if there is no cached script content
    }
    const loadingTypes = ['head', 'body'];
    
    loadingTypes.forEach(loadingType => {
        const scriptElement = document.getElementById('custom-embed-' + loadingType);
        if (scriptElement) {
            scriptElement.remove(); // Remove existing script element
        }

        const newScriptElement = document.createElement('script');
        newScriptElement.id = 'custom-embed-' + loadingType;
        const script = cachedScriptContent[loadingType];
        
        // Check if the script content is not null and not an empty string before inserting
        if (!script || script.trim() === '') {
            return;
        }
        
        newScriptElement.innerHTML = script; // Insert the cached script content
        
        if (loadingType === 'head') {
            // Insert into the end of the head tag
            document.head.appendChild(newScriptElement);
        } else {
            // Insert into the body
            document.body.appendChild(newScriptElement);
        }
    });
}


/**
 * Executes the script loading and insertion process in a safe manner, preventing concurrent executions.
 * Uses a flag 'isExecuting' to ensure that only one execution runs at a time.
 */
async function safeExecute() {
    if (isExecuting) return; // Prevent concurrent executions
    isExecuting = true;

    try {
        await loadRemoteScript();
        insertScript(); // Dynamically insert the cached script
        isInitialized = true;
    } catch (error) {
        console.error('Error during script execution:', error);
    } finally {
        setTimeout(() => {
            isExecuting = false; // Reset the execution flag after a short delay
        }, 100);
    }
}

/**
 * Handles route changes by comparing the current URL with the last visited URL.
 * If the URLs are different, it triggers the 'safeExecute' function.
 */
function handleRouteChange() {
    const currentHref = window.location.href;
    if (currentHref !== lastHref) {
        lastHref = currentHref;
        safeExecute();
    }
}

// 1. Listen for history.pushState/replaceState events
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

/**
 * Overrides the original 'history.pushState' function to trigger route change handling.
 */
history.pushState = function (...args) {
    originalPushState.apply(history, args);
    handleRouteChange();
};

/**
 * Overrides the original 'history.replaceState' function to trigger route change handling.
 */
history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    handleRouteChange();
};

// 2. Listen for popstate events (browser back/forward navigation)
window.addEventListener('popstate', handleRouteChange);

/**
 * Observes changes to the '#app' subtree and triggers script execution when relevant changes occur.
 */
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
            return; // Debounce: ignore mutations that occur too quickly
        }

        lastMutationTime = currentTime; // Update the last mutation time

        const hasRelevantChange = mutationsList.some(mutation => {
            return mutation.type === 'childList';
        });

        if (hasRelevantChange && isInitialized) {
            safeExecute();
        }
    });

    observer.observe(targetNode, config);
}

// Initial execution (only once)
if (!isInitialized) {
    safeExecute();
}

// Call the listener method after the page is loaded
window.onload = function () {
    observeAppDivChanges();
    // observeDynamicElements();
};

`;
const fieldAttr = {
  field: "ext_custom_scripts_page_settings",
  type: "json",
  meta: {
    special: ["cast-json"],
    interface: "input-code",
    options: {
      template: "",
    },
    display: null,
    display_options: null,
    readonly: false,
    hidden: true,
    sort: 8,
    width: "full",
    translations: null,
    note: null,
    conditions: null,
    required: false,
    group: null,
    validation: null,
    validation_message: null,
  },
  schema: {
    data_type: "json",
    default_value: JSON.stringify({
      adminScript: false,
      appScript: false,
      isAdmin: {
        head: "console.log('head admin')",
        body: "console.log('body admin')",
      },
      notAdmin: {
        head: "console.log('head not admin')",
        body: "console.log('body not admin')",
      },
    }),
    generation_expression: null,
    max_length: null,
    numeric_precision: null,
    numeric_scale: null,
    is_generated: false,
    is_nullable: true,
    is_unique: false,
    is_indexed: false,
    is_primary_key: false,
    has_auto_increment: false,
    foreign_key_schema: null,
    foreign_key_table: null,
    foreign_key_column: null,
    comment: null,
  },
};
export default defineHook(({ filter, action, embed }, { services }) => {
  // Define a hook using the defineHook function. This hook receives filter, action, and embed functions, and a services object as arguments
  embed(
    "head",
    `
    <script>
    ${script} // Embed the script variable content directly into the head
    </script>
    <script id="custom-embed-header"></script>
    `
  );
  embed(
    "body",
    `
    <script id="custom-embed-body"></script>
    `
  ); // Embed an empty script tag into the body of the Directus application
  let fieldCreated = false;
  const { collectionsService, FieldsService } = services;

  filter("settings.read", (items: any, meta, context) => {
    // Apply a filter to the "settings.read" event. This filter allows modifying the settings items before they are read
    const accountability = context.accountability; // Get the accountability object from the context
    items = items.map((item: any) => {
      // Iterate over each item in the settings
      // disable ext-custom-scripts-page module,user not admin
      if (accountability?.admin != true) {
        item.module_bar = item.module_bar?.map((module: any) => {
          if (module.id === "ext-custom-scripts-page") {
            // Check if the module ID is "ext-custom-scripts-page"
            module.enabled = false; // Disable the module if the user is not an admin
          }
          return module;
        });
      }
      const fieldsService = new FieldsService({
        schema: context.schema,
        accountability: accountability, // Pass the accountability object
      });
      if (fieldCreated) {
        return item;
      }
      fieldsService
        .readOne("directus_settings", "ext_custom_scripts_page_settings")
        .then()
        .catch(() => {
          try {
            fieldsService.createField("directus_settings", fieldAttr);
            fieldCreated = true;
          } catch (error) {
            console.error("Field creation error:", error);
            fieldCreated = true;
          }
        });
      return item;
    });

    return items;
  });
});
