import { getFile } from '@/utils/file';
import { useObjectUrl } from '@vueuse/core';
import { isRef, ref, unref, watch, type MaybeRef } from 'vue';

export function useStoredFile(id: MaybeRef<string | undefined>) {
    const blob = ref<Blob | null>(null);

    async function update() {
        const val = unref(id);

        if (val === undefined) {
            blob.value = null;
            return;
        }

        blob.value = (await getFile(val)) ?? null;
    }

    update();

    if (isRef(id)) watch(id, update);

    const url = useObjectUrl(blob);

    return { blob, url };
}
