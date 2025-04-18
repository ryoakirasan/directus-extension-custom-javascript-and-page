<template>
    <private-view :title="page_title">
        <template v-if="breadcrumb" #headline>
            <v-breadcrumb :items="breadcrumb" />
        </template>

        <template #navigation>
            <page-navigation :current="page" :pages="all_pages" />
        </template>

        <div class="lp-container">
            <component :is="currentComponent" v-if="currentComponent" :banner="page_banner" />

            <div class="lp-cards" v-if="page_cards && isHomeView">
                <div class="lp-card" v-for="card in page_cards.filter(item => (item.uri != page))" :key="card.uri"
                    :style="`background-color: ${card.color}`" @click="change_page(card.to)">
                    <v-icon :name="card.icon" />
                    <span class="lp-card-title">{{ card.label }}</span>
                </div>
            </div>
        </div>
    </private-view>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { useApi } from '@directus/extensions-sdk';
import { useRouter } from 'vue-router';
import PageNavigation from './components/navigation.vue';
import useDirectusToken from './use-directus-token.js';
import AdminScripts from './pages/admin-scripts.vue';
import AppScripts from './pages/app-scripts.vue';
import CustomPage from './pages/custom-page.vue';

import HomePage from './pages/home.vue';

export default {
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
        const api = useApi();
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
</script>

<style lang="scss">
.lp-container {
    padding: var(--content-padding);
    padding-top: 0;
    width: 100%;

    &>div {
        margin-bottom: var(--content-padding);
    }
}

.lp-banner {
    border-radius: var(--border-radius);
    overflow: hidden;

    img {
        display: block;
        width: 100%;
    }
}

.lp-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: var(--input-padding);
    row-gap: var(--input-padding);

    .lp-card {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: var(--border-radius);
        padding: var(--input-padding);
        color: white;

        .v-icon {
            width: 100%;
            height: 50px;
            margin-bottom: 6px;

            i {
                font-size: 50px;
                color: white;
            }
        }

        .lp-card-title {
            display: block;
            font-weight: bold;
            font-size: 1.4em;
            line-height: 1.2;
        }
    }
}
</style>