<template>
  <RouterLink
    to="/new"
    :aria-label="t('add_card')"
    class="aspect-(--card-aspect-ratio) grid rounded-lg border-2 border-dashed text-foreground-muted border-current hover:text-foreground focus-visible:text-foreground active:text-foreground place-content-center cursor-pointer outline-none transition-colors"
  >
    <Plus />
  </RouterLink>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>
