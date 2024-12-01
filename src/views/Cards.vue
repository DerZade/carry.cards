<template>
    <ScrollArea class="size-full">
        <ul :aria-label="t('cards')" class="p-3 pb-6 overflow-hidden grid gap-y-3 gap-x-2 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]">
            <CardItem v-for="c in cards" :key="c.id" :card="c" />
        </ul>
    </ScrollArea>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useCardsStore } from '@/stores/cards';
import { ScrollArea } from '@/components/ui/scroll-area';

import CardItem from '@/components/Cards/CardItem.vue';

const { t } = useI18n({ useScope: 'global' });

const { cards } = storeToRefs(useCardsStore());
</script>
