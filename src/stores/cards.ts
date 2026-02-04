import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { Card } from '@/types'
import { deleteFile } from '@/utils/storage'

export const useCardsStore = defineStore('cards', () => {
  const cards = useLocalStorage<Card[]>('cards', [], { deep: true })

  function addCard(card: Card) {
    cards.value.push(card)
  }

  async function deleteCard({ id }: Pick<Card, 'id'>) {
    const card = cards.value.find((c) => c.id === id)

    // Clean up logo file if it exists
    if (card?.logo?.path) {
      try {
        await deleteFile(card.logo.path)
      } catch (error) {
        console.error('Failed to delete logo file:', error)
      }
    }

    cards.value = cards.value.filter((card) => card.id !== id)
  }

  async function updateCard(card: Card) {
    const index = cards.value.findIndex((c) => c.id === card.id)
    const oldCard = cards.value[index]

    // Clean up old logo if it's being replaced or removed
    if (oldCard?.logo?.path && oldCard.logo.path !== card.logo?.path) {
      try {
        await deleteFile(oldCard.logo.path)
      } catch (error) {
        console.error('Failed to delete old logo file:', error)
      }
    }

    cards.value.splice(index, 1, card)
  }

  return { cards: cards, addCard, deleteCard, updateCard }
})
