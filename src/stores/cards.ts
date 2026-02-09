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

    // Clean up physical card images if they exist
    if (card?.frontImage?.path) {
      try {
        await deleteFile(card.frontImage.path)
      } catch (error) {
        console.error('Failed to delete front image file:', error)
      }
    }

    if (card?.backImage?.path) {
      try {
        await deleteFile(card.backImage.path)
      } catch (error) {
        console.error('Failed to delete back image file:', error)
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

    // Clean up old front image if it's being replaced or removed
    if (oldCard?.frontImage?.path && oldCard.frontImage.path !== card.frontImage?.path) {
      try {
        await deleteFile(oldCard.frontImage.path)
      } catch (error) {
        console.error('Failed to delete old front image file:', error)
      }
    }

    // Clean up old back image if it's being replaced or removed
    if (oldCard?.backImage?.path && oldCard.backImage.path !== card.backImage?.path) {
      try {
        await deleteFile(oldCard.backImage.path)
      } catch (error) {
        console.error('Failed to delete old back image file:', error)
      }
    }

    cards.value.splice(index, 1, card)
  }

  return { cards: cards, addCard, deleteCard, updateCard }
})
