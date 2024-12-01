<template>
    <ScrollArea class="size-full">
        <ul :aria-label="t('cards')" class="p-3 pb-6 overflow-hidden grid gap-y-3 gap-x-2 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]">
            <CardItem v-for="c in cards" :key="c.id" :card="c" />
            <Button variant="outline" class="justify-self-stretch aspect-[2] h-auto" :aria-label="t('add_card')" @click="addDialog = true">
                <Plus class="!size-5 rounded-full p-3 box-content bg-muted text-muted-foreground" />
            </Button>
        </ul>
    </ScrollArea>
    <AddDialog v-model:open="addDialog" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { Plus } from 'lucide-vue-next';
import { useCardsStore } from '@/stores/cards';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

import CardItem from '@/components/Cards/CardItem.vue';
import AddDialog from '@/components/Cards/AddDialog.vue';

const { t } = useI18n({ useScope: 'global' });

const { cards } = storeToRefs(useCardsStore());

const addDialog = ref(false);
</script>
