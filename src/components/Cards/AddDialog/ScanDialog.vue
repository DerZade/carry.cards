<template>
    <Dialog v-model:open="open">
        <DialogContent class="p-0 border-none rounded-md">
            <div style="position: relative">
                <video ref="video" class="rounded-md" @canplay="updateCanvasSize"></video>
                <canvas ref="canvas" style="position: absolute; inset: 0; inline-size: 100%; block-size: 100%" :width :height></canvas>
                <div
                    style="
                        position: absolute;
                        inset-inline: 0;
                        inset-block-end: 0;
                        display: flex;
                        justify-content: center;
                        padding-block: 0.5rem;
                    "
                >
                    <Button v-if="barcodes.length" class="bg-brand hover:bg-brand/90" @click="submit">
                        <component :is="codeType === 'qr' ? ScanQrCode : ScanBarcode" class="size-4" />
                        <span v-t="'add'"></span>
                    </Button>
                    <Button v-else disabled class="bg-brand">
                        <ScanSearch class="size-4" />
                        <span v-t="'no_code_detected'"></span>
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, onScopeDispose, ref, toRef, unref, useTemplateRef, watch } from 'vue';
import { useUserMedia } from '@vueuse/core';
import 'barcode-detector/side-effects';
import { ScanQrCode, ScanBarcode, ScanSearch } from 'lucide-vue-next';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getCodeType } from '@/utils/code';

const open = defineModel<boolean>('open', { type: Boolean, required: true });

const props = defineProps<{ constraints: MediaStreamConstraints }>();

const emit = defineEmits<{
    submit: [DetectedBarcode];
}>();

const videoEl = useTemplateRef('video');
const { stream } = useUserMedia({
    constraints: toRef(props, 'constraints'),
    enabled: open,
});

function setStream() {
    if (!videoEl.value) return;
    if (!stream.value) return;

    videoEl.value.srcObject = stream.value;
    videoEl.value.play();
}

watch(videoEl, setStream);
watch(stream, setStream);
setStream();

const width = ref(0);
const height = ref(0);

function updateCanvasSize() {
    if (!videoEl.value) return;

    width.value = videoEl.value.videoWidth;
    height.value = videoEl.value.videoHeight;
}

const detector = new BarcodeDetector();

const canvasEl = useTemplateRef('canvas');
const context = computed(() => canvasEl.value?.getContext('2d'));

type Coord = {
    x: number;
    y: number;
};

const ab = new AbortController();
onScopeDispose(() => ab.abort());
detect();

const barcodes = ref<DetectedBarcode[]>([]);

const codeType = computed(() => {
    const code = barcodes.value[0];
    if (!code) return 'qr';

    return getCodeType(code.format);
});

async function detect() {
    try {
        if (!videoEl.value) return;
        if (videoEl.value.readyState === 0) return;

        barcodes.value = await detector.detect(videoEl.value);
    } finally {
        if (ab.signal.aborted) return;
        requestAnimationFrame(() => detect());
    }
}

watch(barcodes, val => {
    function linearInterpolate(a: Coord, b: Coord, length: number): [number, number] {
        const lineLength = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);

        return [a.x + ((b.x - a.x) / lineLength) * length, a.y + ((b.y - a.y) / lineLength) * length];
    }

    if (!context.value) return;

    const ctx = context.value;

    ctx.clearRect(0, 0, width.value, height.value);

    for (const barcode of val) {
        const [p0, p1, p2, p3] = barcode.cornerPoints;

        const corners: [Coord, Coord, Coord][] = [
            [p3, p0, p1],
            [p0, p1, p2],
            [p1, p2, p3],
            [p2, p3, p0],
        ];

        for (const [p1, p2, p3] of corners) {
            ctx.beginPath();
            ctx.moveTo(...linearInterpolate(p2, p1, 20));
            ctx.lineTo(...linearInterpolate(p2, p1, 10));

            ctx.bezierCurveTo(p2.x, p2.y, p2.x, p2.y, ...linearInterpolate(p2, p3, 10));

            ctx.lineTo(...linearInterpolate(p2, p3, 20));
            ctx.strokeStyle = 'hsl(57 74% 50%)';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 10;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }
});

function submit() {
    const firstCode = unref(barcodes.value[0]);
    if (firstCode === undefined) return;

    emit('submit', firstCode);
}
</script>
