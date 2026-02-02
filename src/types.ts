import type { SupportedBarcodeFormat } from './utils/code'

export type StoredImage = {
  path: string
  width: number
  height: number
}

export type Card = {
  id: string
  displayName: string
  color: string
  format: SupportedBarcodeFormat
  rawValue: string
  logo?: StoredImage | null | undefined
}
