export type BarcodeType = 'qr' | 'bar'

export function getCodeType(format: SupportedBarcodeFormat): BarcodeType {
  return [
    'aztec',
    'data_matrix',
    'maxi_code',
    'micro_qr_code',
    'qr_code',
    'rm_qr_code',
    'matrix_codes',
  ].includes(format)
    ? 'qr'
    : 'bar'
}

export const FORMATS = {
  aztec: { bcid: 'azteccode', square: true },
  code_128: { bcid: 'code128', square: false },
  code_39: { bcid: 'code39', square: false },
  code_93: { bcid: 'code93', square: false },
  codabar: { bcid: 'rationalizedCodabar', square: false },
  data_matrix: { bcid: 'datamatrix', square: true },
  ean_13: { bcid: 'ean13', square: false },
  ean_8: { bcid: 'ean8', square: false },
  itf: { bcid: 'itf14', square: false },
  pdf417: { bcid: 'pdf417', square: false },
  qr_code: { bcid: 'qrcode', square: true },
  upc_a: { bcid: 'upca', square: false },
  upc_e: { bcid: 'upce', square: false },
} as const satisfies Partial<Record<BarcodeFormat, { bcid: string; square: boolean }>>

export type SupportedBarcodeFormat = keyof typeof FORMATS

export const SUPPORTED_FORMATS = Object.keys(FORMATS) as SupportedBarcodeFormat[]

export function isSupportedFormat(format: BarcodeFormat): format is SupportedBarcodeFormat {
  return format in FORMATS
}

export type SupportedDetectedBarcode = DetectedBarcode & { format: SupportedBarcodeFormat }
