<template>
    <div class="grid grid-rows-[auto_1fr] overflow-hidden size-full">
        <nav class="grid items-center gap-2 p-2 grid-cols-[theme(size.9)_1fr_theme(size.9)]">
            <Button v-if="route.meta['showBack']" variant="ghost" size="icon" @click="router.push({ name: 'cards', params: {} })">
                <ChevronLeft class="size-4" />
            </Button>
            <h1 v-if="title || route.meta['title']" class="col-start-2 truncate text-lg text-center">
                <span v-if="title">{{ title }}</span>
                <span v-else v-t="route.meta['title']"></span>
            </h1>
            <Button v-if="route.meta['showSettings']" variant="ghost" size="icon" class="col-start-3" @click="openSettings">
                <Settings class="size-4" />
            </Button>
        </nav>
        <main class="self-stretch overflow-hidden">
            <RouterView @update:title="title = $event" />
        </main>
    </div>
    <Toaster />
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { ChevronLeft, Settings, Smile, WifiOff } from 'lucide-vue-next';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { Button } from '@/components/ui/button';
import { Toaster, useToast, ToastAction } from '@/components/ui/toast';

const route = useRoute();

const title = ref<string>();
watch(route, () => {
    title.value = undefined;
});

const router = useRouter();

const { toast } = useToast();

const { t } = useI18n({ useScope: 'global' });

function openSettings() {
    toast({
        title: t('coming_soon'),
        action: h(Smile),
    });
}

const { updateServiceWorker } = useRegisterSW({
    immediate: true,
    onOfflineReady() {
        toast({
            title: t('ready_to_work_offline'),
            action: h(WifiOff),
            duration: 5000,
        });
    },
    onNeedRefresh() {
        toast({
            title: t('new_version_available'),
            action: h(
                ToastAction,
                {
                    altText: t('update_now'),
                    onClick: () => {
                        updateServiceWorker();
                    },
                },
                {
                    default: () => t('update_now'),
                },
            ),
        });
    },
});
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
