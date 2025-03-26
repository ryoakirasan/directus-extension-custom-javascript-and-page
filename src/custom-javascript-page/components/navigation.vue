<template>
    <v-list nav v-if="pages">
      <v-list-item v-for="navItem in pages" :key="navItem.to" :active="navItem.uri == current" :to="navItem.to">
        <v-list-item-icon><v-icon :name="navItem.icon" :color="navItem.color" /></v-list-item-icon>
        <v-list-item-content>
          <v-text-overflow :text="navItem.label" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </template>
  
  <script>
  export default {
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
  }
  </script>
  