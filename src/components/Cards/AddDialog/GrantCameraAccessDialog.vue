<template>
    <Dialog v-model:open="open">
        <DialogContent>
            <DialogHeader>
                <DialogTitle><span v-t="'grant_camera_access.title'"></span></DialogTitle>
            </DialogHeader>
            <div>
                <p v-t="'grant_camera_access.description'"></p>
                <p class="mt-5 text-xs" v-t="'grant_camera_access.disclaimer'"></p>
            </div>
            <DialogFooter>
                <DialogClose as-child>
                    <Button variant="secondary" :disabled="loading">
                        <span v-t="'grant_camera_access.not_now'"></span>
                    </Button>
                </DialogClose>
                <Button type="submit" :disabled="loading" @click="askForPermission">
                    <Loader2 v-if="loading" class="size-4 animate-spin" />
                    <Camera v-else class="size-4" />
                    <span v-t="'grant_camera_access.grant'"></span>
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Camera, Loader2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';

const props = defineProps<{ constraints: MediaStreamConstraints }>();

const emit = defineEmits<{
    granted: [];
}>();

const open = defineModel<boolean>('open', { type: Boolean, required: true });

const { t } = useI18n({ useScope: 'global' });

const loading = ref(false);

const { toast } = useToast();

async function askForPermission() {
    loading.value = true;

    try {
        const stream = await navigator.mediaDevices.getUserMedia(props.constraints);
        stream.getTracks().forEach(track => track.stop());
        emit('granted');
    } catch {
        toast({
            variant: 'destructive',
            title: t('grant_camera_access.error.title'),
            description: t('grant_camera_access.error.description'),
        });
    } finally {
        loading.value = false;
    }
}
</script>
