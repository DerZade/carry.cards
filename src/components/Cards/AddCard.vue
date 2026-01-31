<template>
  <RouterLink
    to="/new"
    :aria-label="t('add_card')"
    class="aspect-(--card-aspect-ratio) grid rounded-lg border-2 border-dashed border-foreground/70 opacity-60 hover:opacity-100 focus-visible:opacity-100 active:opacity-100 justify-center items-center p-2 cursor-pointer outline-none"
  >
    <Plus />
  </RouterLink>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>
