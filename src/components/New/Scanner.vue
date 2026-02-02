<template>
  <div class="relative overflow-hidden">
    <video
      autobuffer
      autoplay
      playsinline
      muted
      loop
      ref="video"
      class="absolute inset-0 size-full object-cover object-center"
      @canplay="updateCanvasSize"
    ></video>
    <canvas
      ref="canvas"
      class="absolute inset-0 size-full object-cover object-center"
      :width
      :height
    ></canvas>
    <div class="absolute pb-2 px-2 inset-inline-0 flex justify-center block-end-0">
      <button v-if="barcodeState" class="btn-brand bg-brand" @click="submit">
        <component :is="codeType === 'qr' ? ScanQrCode : ScanBarcode" class="size-4" />
        <span>{{ t('new.add_code') }}</span>
      </button>
      <button v-else disabled class="btn-brand pointer-events-none">
        <ScanSearch class="size-4" />
        <span>{{ t('new.no_code_detected') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useRafFn, useUserMedia } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import 'barcode-detector/side-effects'
import { ScanQrCode, ScanBarcode, ScanSearch } from 'lucide-vue-next'

import { getCodeType, isSupportedFormat, type SupportedDetectedBarcode } from '@/utils/code'
import type { Point2D } from 'barcode-detector'

const { constraints } = defineProps<{ constraints: MediaStreamConstraints }>()

const emit = defineEmits<{
  submit: [SupportedDetectedBarcode]
}>()

const { t } = useI18n({ useScope: 'global' })

async function getOptimalCamera() {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter((device) => device.kind === 'videoinput')

  // Look for labels like "back", "main", or "wide"
  // Avoid "ultra wide" unless you specifically need macro
  const backCameras = videoDevices.filter((d) => d.label.toLowerCase().includes('back'))

  // Most devices list the primary 'Wide' camera first or with a '0' index
  const optimal =
    backCameras.find(
      (d) => d.label.toLowerCase().includes('wide') && !d.label.toLowerCase().includes('ultra'),
    ) || backCameras[0]

  return optimal ? optimal.deviceId : null
}

const deviceID = ref<string | null>(null)
getOptimalCamera().then((id) => {
  deviceID.value = id
})

const actualConstraints = computed<MediaStreamConstraints>(() => {
  if (deviceID.value) {
    return {
      video: {
        ...(typeof constraints.video === 'object' ? constraints.video : {}),
        deviceId: { exact: deviceID.value },
      },
    }
  }
  return constraints
})

const videoEl = useTemplateRef('video')
const { stream } = useUserMedia({ constraints: actualConstraints, enabled: true })

function setStream() {
  if (!videoEl.value) return
  if (!stream.value) return

  videoEl.value.srcObject = stream.value
  videoEl.value.play()
}

watch(videoEl, setStream)
watch(stream, setStream)
setStream()

const width = ref(0)
const height = ref(0)

function updateCanvasSize() {
  if (!videoEl.value) return

  width.value = videoEl.value.videoWidth
  height.value = videoEl.value.videoHeight
}

const detector = new BarcodeDetector()

const canvasEl = useTemplateRef('canvas')
const context = computed(() => canvasEl.value?.getContext('2d'))

type Coord = {
  x: number
  y: number
}

type BarcodeState = {
  barcode: SupportedDetectedBarcode
  lastSeen: number
}

const barcodeState = ref<BarcodeState | null>(null)

const codeType = computed(() => {
  const code = barcodeState.value?.barcode
  if (!code) return 'qr'

  return getCodeType(code.format)
})

const MAX_NOT_SEEN_FOR = 500 // ms
const codeToKey = (code: SupportedDetectedBarcode) => `${code.format}:${code.rawValue}`

useRafFn(
  async ({ timestamp }) => {
    if (!videoEl.value) return
    if (videoEl.value.readyState === 0) return

    const detectedBarcodes = await detector
      .detect(videoEl.value)
      .then((codes) =>
        codes.filter((code): code is SupportedDetectedBarcode => isSupportedFormat(code.format)),
      )

    if (detectedBarcodes.length === 0) {
      // No barcodes detected - remove current if it's been too long
      if (barcodeState.value !== null) {
        if (timestamp - barcodeState.value.lastSeen >= MAX_NOT_SEEN_FOR) {
          barcodeState.value = null
        }
      }
      return
    }

    // If we have a current barcode, check if it's still visible
    if (barcodeState.value) {
      const currentKey = codeToKey(barcodeState.value.barcode)
      const stillVisible = detectedBarcodes.find((code) => codeToKey(code) === currentKey)

      if (stillVisible) {
        // Current barcode still visible - keep tracking it
        barcodeState.value = { barcode: stillVisible, lastSeen: timestamp }
      } else if (timestamp - barcodeState.value.lastSeen < MAX_NOT_SEEN_FOR) {
        // Current barcode not visible but within threshold - keep it
        return
      }
    }

    // No current barcode or current barcode lost - pick the biggest one
    barcodeState.value = { barcode: getBiggestBarcode(detectedBarcodes), lastSeen: timestamp }
  },
  { fpsLimit: 20 },
)

function getBiggestBarcode(codes: SupportedDetectedBarcode[]): SupportedDetectedBarcode {
  return codes.reduce((biggest, current) => {
    const biggestArea = calculateArea(biggest.cornerPoints)
    const currentArea = calculateArea(current.cornerPoints)
    return currentArea > biggestArea ? current : biggest
  })
}

function calculateArea(points: [Point2D, Point2D, Point2D, Point2D]): number {
  // Calculate area using shoelace formula
  let area = 0
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length
    const a = points[i]!
    const b = points[j]!
    area += a.x * b.y
    area -= b.x * a.y
  }
  return Math.abs(area / 2)
}

watch(barcodeState, (val) => {
  function linearInterpolate(a: Coord, b: Coord, length: number): [number, number] {
    const lineLength = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)

    return [a.x + ((b.x - a.x) / lineLength) * length, a.y + ((b.y - a.y) / lineLength) * length]
  }

  if (!context.value) return

  const ctx = context.value

  ctx.clearRect(0, 0, width.value, height.value)

  if (!val) return

  const [p0, p1, p2, p3] = val.barcode.cornerPoints

  const factor = window.devicePixelRatio || 1

  const corners: [Coord, Coord, Coord][] = [
    [p3, p0, p1],
    [p0, p1, p2],
    [p1, p2, p3],
    [p2, p3, p0],
  ]

  for (const [p1, p2, p3] of corners) {
    ctx.beginPath()
    ctx.moveTo(...linearInterpolate(p2, p1, 10 * factor))
    ctx.lineTo(...linearInterpolate(p2, p1, 5 * factor))

    ctx.bezierCurveTo(p2.x, p2.y, p2.x, p2.y, ...linearInterpolate(p2, p3, 5 * factor))

    ctx.lineTo(...linearInterpolate(p2, p3, 10 * factor))
    ctx.strokeStyle = '#ded421'
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 10
    ctx.lineWidth = 1.5 * factor
    ctx.stroke()
  }
})

function submit() {
  const code = barcodeState.value?.barcode
  if (!code) return

  emit('submit', code)
}
</script>
