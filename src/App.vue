<template>
    <div class="grid grid-rows-[auto_1fr] overflow-hidden size-full">
        <nav class="grid items-center gap-2 p-2 grid-cols-[theme(size.9)_1fr_theme(size.9)]">
            <Button v-if="route.meta['showBack']" variant="ghost" size="icon" @click="router.back()">
                <ChevronLeft class="size-4" />
            </Button>
            <h1 v-if="title || route.meta['title']" class="col-start-2 truncate text-lg text-center">
                <span v-if="title">{{ title }}</span>
                <span v-else v-t="route.meta['title']"></span>
            </h1>
            <Button v-if="route.meta['showSettings']" variant="ghost" size="icon" class="col-start-3">
                <Settings class="size-4" />
            </Button>
        </nav>
        <main class="self-stretch overflow-hidden">
            <RouterView @update:title="title = $event" />
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { ChevronLeft, Settings } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';

const route = useRoute();

const title = ref<string>();
watch(route, () => {
    title.value = undefined;
});

const router = useRouter();
</script>

<style>
html,
body,
#app {
    inline-size: 100dvi;
    block-size: 100dvb;
    overflow: hidden;
}
</style>
