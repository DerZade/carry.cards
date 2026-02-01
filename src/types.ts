export type StoredImage = {
  path: string
  width: number
  height: number
}

export type Card = {
  id: string
  displayName: string
  color: string
  format: BarcodeFormat
  rawValue: string
  logo?: StoredImage | null | undefined
}
