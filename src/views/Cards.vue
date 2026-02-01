<template>
  <ul
    ref="listEl"
    :aria-label="t('cards')"
    class="px-3 pbe-6 overflow-y-auto grid content-start gap-y-3 gap-x-2 grid-cols-[repeat(auto-fill,minmax(--spacing(40),1fr))]"
  >
    <CardItem v-for="c in cards" :key="c.id" :card="c" />
    <AddCard />
  </ul>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSortable } from '@vueuse/integrations/useSortable'
import { useTemplateRef } from 'vue'
import { useCardsStore } from '@/stores/cards'

import CardItem from '@/components/Cards/CardItem.vue'
import AddCard from '@/components/Cards/AddCard.vue'

const { t } = useI18n({ useScope: 'global' })

const { cards } = storeToRefs(useCardsStore())

const listEl = useTemplateRef('listEl')
useSortable(listEl, cards, { animation: 150, delay: 500 })
</script>
