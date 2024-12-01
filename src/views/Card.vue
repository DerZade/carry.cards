<template>
    <div v-if="card" class="p-2 grid gap-2">
        <RenderedCode :format="card.format" :rawValue="card.rawValue" />
        <Button variant="secondary" @click="editCard">
            <Pencil class="size-4" />
            <span v-t="'edit_card'"></span>
        </Button>
        <Button variant="secondary" @click="showPhotos">
            <Camera class="size-4" />
            <span v-t="'photos'"></span>
        </Button>
        <AlertDialog>
            <AlertDialogTrigger as-child>
                <Button variant="destructive">
                    <Trash2 class="size-4" />
                    <span v-t="'delete_card'"></span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle><span v-t="{ path: 'delete_card_title', args: { name: card.displayName } }"></span></AlertDialogTitle>
                    <AlertDialogDescription>
                        <span v-t="{ path: 'delete_card_message', args: { name: card.displayName } }"></span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel><span v-t="'cancel'"></span></AlertDialogCancel>
                    <AlertDialogAction @click="deleteCard"><span v-t="'delete_card'"></span></AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<script setup lang="ts">
import { computed, watch, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Pencil, Trash2, Camera, Smile } from 'lucide-vue-next';

import { useCardsStore } from '@/stores/cards';

import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import RenderedCode from '@/components/RenderedCode.vue';

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

const router = useRouter();

function deleteCard() {
    if (!card.value) return;

    store.deleteCard(card.value);
    router.replace({ name: 'cards', params: {} });
}

const { toast } = useToast();

const { t } = useI18n({ useScope: 'global' });

function showPhotos() {
    toast({
        title: t('coming_soon'),
        action: h(Smile),
    });
}

function editCard() {
    toast({
        title: t('coming_soon'),
        action: h(Smile),
    });
}
</script>
