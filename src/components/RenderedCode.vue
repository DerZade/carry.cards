<template>
  <figure
    class="bg-white text-black overflow-hidden grid grid-rows-[1fr_auto] justify-items-center gap-[5%] p-[2%]"
  >
    <p
      v-if="unsupportedFormat"
      class="grid place-content-center font-bold font-italic text-destructive"
    >
      {{ t('unsupported_format') }}
    </p>
    <img
      v-else
      :src="blobURL"
      class="overflow-hidden object-contain object-center place-self-stretch self-stretch px-[5%]"
    />
    <figcaption class="font-mono text-center text-xl">{{ rawValue }}</figcaption>
  </figure>
</template>

<script lang="ts" setup>
import { onScopeDispose, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { writeBarcode } from 'zxing-wasm/writer'

const { format, rawValue } = defineProps<{
  format: BarcodeFormat
  rawValue: string
}>()

const { t } = useI18n({ useScope: 'global' })

const blobURL = ref<string>()

const blob = ref<Blob | null>(null)

watch(blob, (blob) => {
  if (blobURL.value) URL.revokeObjectURL(blobURL.value)

  blobURL.value = blob ? URL.createObjectURL(blob) : undefined
})

onScopeDispose(() => {
  if (blobURL.value) URL.revokeObjectURL(blobURL.value)
})

const unsupportedFormat = ref(false)

async function render() {
  // TODO: Support more formats
  if (
    format === 'unknown' ||
    format === 'any' ||
    format === 'databar' ||
    format === 'databar_expanded' ||
    format === 'databar_limited' ||
    format === 'dx_film_edge' ||
    format === 'maxi_code' ||
    format === 'micro_qr_code' ||
    format === 'rm_qr_code' ||
    format === 'linear_codes' ||
    format === 'matrix_codes'
  ) {
    unsupportedFormat.value = true
    return
  }

  const { image } = await writeBarcode(rawValue, {
    format: MAP[format],
    sizeHint: 1024,
    withQuietZones: false,
    withHRT: false,
  })

  unsupportedFormat.value = false
  blob.value = image
}

const MAP = {
  aztec: 'Aztec',
  code_128: 'Code128',
  code_39: 'Code39',
  code_93: 'Code93',
  codabar: 'Codabar',
  databar: 'DataBar',
  databar_expanded: 'DataBarExpanded',
  databar_limited: 'DataBarLimited',
  data_matrix: 'DataMatrix',
  dx_film_edge: 'DXFilmEdge',
  ean_13: 'EAN-13',
  ean_8: 'EAN-8',
  itf: 'ITF',
  maxi_code: 'MaxiCode',
  micro_qr_code: 'MicroQRCode',
  pdf417: 'PDF417',
  qr_code: 'QRCode',
  rm_qr_code: 'rMQRCode',
  upc_a: 'UPC-A',
  upc_e: 'UPC-E',
  linear_codes: 'Linear-Codes',
  matrix_codes: 'Matrix-Codes',
} as const

watch(() => format, render)
watch(() => rawValue, render)
render()
</script>
