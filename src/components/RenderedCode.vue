<template>
    <figure class="p-6 px-12 bg-white text-black rounded-md overflow-hidden">
        <p
            v-if="unsupportedFormat"
            class="aspect-[4] grid place-content-center font-bold font-italic text-destructive"
            v-t="'unsupported_format'"
        ></p>
        <img v-else class="aspect-[4]" :src="blobURL" />
        <figcaption class="font-mono text-center text-xl">{{ props.rawValue }}</figcaption>
    </figure>
</template>

<script lang="ts" setup>
import { onScopeDispose, ref, toRef, watch } from 'vue';
import { writeBarcodeToImageFile } from 'zxing-wasm/writer';

const props = defineProps<{
    format: BarcodeFormat;
    rawValue: string;
}>();

const blobURL = ref<string>();

const blob = ref<Blob | null>(null);

watch(blob, blob => {
    if (blobURL.value) URL.revokeObjectURL(blobURL.value);

    blobURL.value = blob ? URL.createObjectURL(blob) : undefined;
});

onScopeDispose(() => {
    if (blobURL.value) URL.revokeObjectURL(blobURL.value);
});

const unsupportedFormat = ref(false);

async function render() {
    // TODO: Support more formats
    if (
        props.format === 'unknown' ||
        props.format === 'databar' ||
        props.format === 'databar_expanded' ||
        props.format === 'databar_limited' ||
        props.format === 'dx_film_edge' ||
        props.format === 'maxi_code' ||
        props.format === 'micro_qr_code' ||
        props.format === 'rm_qr_code' ||
        props.format === 'linear_codes' ||
        props.format === 'matrix_codes'
    ) {
        unsupportedFormat.value = true;
        return;
    }

    const { image } = await writeBarcodeToImageFile(props.rawValue, {
        format: MAP[props.format],
        margin: 0,
        width: 1024,
        height: 256,
    });

    unsupportedFormat.value = false;
    blob.value = image;
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
} as const;

watch(toRef(props, 'format'), render);
watch(toRef(props, 'rawValue'), render);
render();
</script>
