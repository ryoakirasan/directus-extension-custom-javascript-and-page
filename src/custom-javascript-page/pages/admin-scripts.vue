<template>
    <div class="cus-script-content">
        <!-- Head Script Textarea -->
        <div class="cus-script-edit">
            <span class="cus-script-title">Head Script</span>
            <div>
                <v-textarea v-model="scriptsData.head" :full-width="true" :trim="true" placeholder="Enter head script"
                    :nullable="false" />
            </div>
        </div>
        <!-- Body Script Textarea -->
        <div class="cus-script-edit">
            <span class="cus-script-title">Body Script</span>
            <div>
                <v-textarea v-model="scriptsData.body" :full-width="true" :trim="true" placeholder="Enter body script"
                    :nullable="false" />
            </div>
            <!-- Save Button -->
            <div class="cus-save-button">
                <v-button @click="saveScripts" :disabled="!hasChanges" :loading="saving" :small="true" :rounded="false"
                    :outlined="false" :icon="false" :autofocus="false">
                    Save
                </v-button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { useI18n } from 'vue-i18n';

export default {
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
</script>

<style lang="scss">
.cus-script-content {
    margin: 0 auto;

    .cus-script-edit {
        margin-bottom: 2rem;
    }

    .cus-script-title {
        font-weight: bold;
        font-size: larger;
        margin-bottom: 0.5rem;
    }

    .v-input.textarea {
        font-family: monospace;
        font-size: 14px;
    }

    .cus-save-button {
        margin-top: 20px;
        text-align: right;
    }
}
</style>
