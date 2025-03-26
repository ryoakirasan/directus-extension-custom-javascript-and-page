<template>
    <div class="cus-script-content">
        <div class="cus-script-row">
            <!-- HTML Content Editor -->
            <div class="cus-script-edit">
                <span class="cus-script-title">HTML Content</span>
                <v-textarea v-model="htmlContent" :full-width="true" :trim="false" placeholder="Enter HTML content"
                    :nullable="false" />
                <!-- Action Buttons -->
                <div class="cus-save-button">
                    <v-button @click="saveContent" :disabled="!hasChanges" :loading="saving" :small="true"
                        :rounded="false" :outlined="false" :icon="false">
                        Save
                    </v-button>
                </div>
            </div>

            <!-- Preview Area -->
            <div class="cus-script-preview">
                <span class="cus-script-title">Preview</span>
                <iframe ref="previewFrame" class="cus-script-preview-iframe" :srcdoc="previewContent"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { useI18n } from 'vue-i18n';

export default {
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
            if (previewFrame.value) {
                // No need to manually set innerHTML because :srcdoc is used.
                // previewFrame.value.contentDocument.body.innerHTML = htmlContent.value;
            }
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
</script>


<style lang="scss">
.cus-script-content {
    margin: 0 auto;
    height: calc(100vh - 150px);
    display: flex;
    flex-direction: column;

    .cus-script-row {
        display: flex;
        flex: 1;
    }

    .cus-script-edit {
        width: 30%;
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .cus-script-preview {
        width: 70%;
        padding: 1rem;
        box-sizing: border-box;
    }

    .cus-script-title {
        font-weight: bold;
        font-size: larger;
        margin-bottom: 0.5rem;
        display: block;
    }

    .v-textarea {
        font-family: monospace;
        font-size: 14px;
        flex: 1;
    }

    .cus-script-preview-iframe {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }

    .cus-save-button {
        margin-top: 20px;
        text-align: right;
    }
}
</style>
