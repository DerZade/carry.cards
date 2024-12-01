<template>
    <ul :aria-label="t('cards')"></ul>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'global' });
</script>
