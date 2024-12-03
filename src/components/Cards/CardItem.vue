<template>
    <li :aria-labelledby="labelId">
        <RouterLink class="grid grid-rows-[auto_auto] gap-0 items-stretch" :to="{ name: 'card', params: { id: card.id } }">
            <div class="relative rounded-lg p-2 aspect-[2]">
                <img v-if="imgUrl" :src="imgUrl" class="size-full" />
                <template v-else>
                    <div class="bg-white opacity-30 absolute left-0 right-0 top-[20%] h-[20%]"></div>
                    <component :is="Icon" class="text-white opacity-50 absolute bottom-3 right-4 h-[30%] w-auto" />
                </template>
            </div>
            <span :id="labelId" class="text-center font-semibold truncate text-sm">{{ card.displayName }}</span>
        </RouterLink>
    </li>
</template>

<script setup lang="ts">
import { computed, type DeepReadonly, useId } from 'vue';
import { QrCode, Barcode } from 'lucide-vue-next';
import type { Card } from '@/types';
import { getCodeType } from '@/utils/code';
import { useStoredFile } from '@/composables/useStoredFile';

const props = defineProps<{
    card: DeepReadonly<Card>;
}>();

const Icon = computed(() => (getCodeType(props.card.format) === 'qr' ? QrCode : Barcode));

const labelId = useId();

const { url: imgUrl } = useStoredFile(computed(() => props.card.image));
</script>

<style scoped>
li > a > div:first-child {
    background-color: v-bind('card.color');
}
</style>
