<template>
    <div v-if="card" class="p-2 grid gap-2">
        <RenderedCode :format="card.format" :rawValue="card.rawValue" />
        <EditCard :modelValue="card" @update:modelValue="onEditSubmit" />
        <Button variant="secondary" @click="showPhotos">
            <Camera class="size-4" />
            <span v-t="'photos'"></span>
        </Button>
        <DeleteCard :card="card" />
    </div>
</template>

<script setup lang="ts">
import { computed, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { Camera, Smile } from 'lucide-vue-next';

import { useCardsStore } from '@/stores/cards';
import type { Card } from '@/types';

import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

import RenderedCode from '@/components/RenderedCode.vue';
import DeleteCard from '@/components/Card/DeleteCard.vue';
import EditCard from '@/components/Card/EditCard.vue';

const props = defineProps<{
    id: string;
}>();

const emit = defineEmits<{
    'update:title': [string];
}>();

const store = useCardsStore();
const { cards } = storeToRefs(store);

const card = computed(() => cards.value.find(card => card.id === props.id));

watch(
    card,
    val => {
        if (!val) return;

        emit('update:title', val.displayName);
    },
    { immediate: true },
);

const { toast } = useToast();

const { t } = useI18n({ useScope: 'global' });

function showPhotos() {
    toast({
        title: t('coming_soon'),
        action: h(Smile),
    });
}

function onEditSubmit(value: Card) {
    store.updateCard(value);
}
</script>
