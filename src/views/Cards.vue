<template>
  <ul
    :aria-label="t('cards')"
    class="px-3 pbe-6 overflow-y-auto grid content-start gap-y-3 gap-x-2 grid-cols-[repeat(auto-fill,minmax(--spacing(40),1fr))]"
  >
    <CardItem v-for="c in cards" :key="c.id" :card="c" />
  </ul>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useCardsStore } from '@/stores/cards'

import CardItem from '@/components/Cards/CardItem.vue'

const { t } = useI18n({ useScope: 'global' })

const { cards } = storeToRefs(useCardsStore())
</script>
