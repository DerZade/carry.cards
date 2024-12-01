<template>
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Trash2 } from 'lucide-vue-next';

import { useCardsStore } from '@/stores/cards';

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
import type { Card } from '@/types';

const props = defineProps<{
    card: Card;
}>();

const store = useCardsStore();
const router = useRouter();

function deleteCard() {
    store.deleteCard(props.card);
    router.replace({ name: 'cards', params: {} });
}
</script>
