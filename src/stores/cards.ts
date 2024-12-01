import { readonly } from 'vue';
import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import type { Card } from '@/types';

export const useCardsStore = defineStore('cards', () => {
    const cards = useLocalStorage<Card[]>('cards', [], { deep: true });

    function addCard(card: Card) {
        cards.value.push(card);
    }

    function deleteCard({ id }: Pick<Card, 'id'>) {
        cards.value = cards.value.filter(card => card.id !== id);
    }

    function updateCard(card: Card) {
        const index = cards.value.findIndex(c => c.id === card.id);

        cards.value.splice(index, 1, card);
    }

    return { cards: readonly(cards), addCard, deleteCard, updateCard };
});
