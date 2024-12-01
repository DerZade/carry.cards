<template>
    <Form v-if="scanResult" v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
        <Dialog v-model:open="isOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle><span v-t="'add_card'"></span></DialogTitle>
                </DialogHeader>
                <RenderedCode :format="scanResult.format" :rawValue="scanResult.rawValue" />
                <form :id="formId" @submit="handleSubmit($event, submit)">
                    <FormField v-slot="{ componentField }" name="displayName">
                        <FormItem>
                            <FormLabel><span v-t="'display_name'"></span></FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>
                <DialogFooter>
                    <Button variant="secondary" @click="scanResult = null">
                        <ScanSearch class="size-4" />
                        <span v-t="'try_again'"></span>
                    </Button>
                    <Button type="submit" :form="formId">
                        <Plus class="size-4" />
                        <span v-t="'add'"></span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
    <GrantCameraAccessDialog v-else-if="!permission" v-model:open="isOpen" :constraints @granted="open" />
    <ScanDialog
        v-else
        v-model:open="isOpen"
        :constraints
        @submit="
            scanResult = $event;
            nextTick(() => {
                isOpen = true;
            });
        "
    />
</template>

<script setup lang="ts">
import { nextTick, ref, useId } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, ScanSearch } from 'lucide-vue-next';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useCardsStore } from '@/stores/cards';
import { randomColor } from '@/utils/colors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTitle, DialogHeader, DialogFooter, DialogContent } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import GrantCameraAccessDialog from './AddDialog/GrantCameraAccessDialog.vue';
import ScanDialog from './AddDialog/ScanDialog.vue';
import RenderedCode from '../RenderedCode.vue';

const isOpen = ref(false);
const permission = ref(false);

async function open() {
    const { state } = await navigator.permissions.query({ name: 'camera' as PermissionName });

    permission.value = state === 'granted';
    isOpen.value = true;
}

defineExpose({ open });

const constraints: MediaStreamConstraints = { video: { facingMode: 'environment' } };

const scanResult = ref<DetectedBarcode | null>(null);

const router = useRouter();
const cardsStore = useCardsStore();

function submit({ displayName }: { displayName: string }) {
    if (!scanResult.value) return;

    const id = crypto.randomUUID();

    cardsStore.addCard({
        id,
        color: randomColor(),
        displayName,
        rawValue: scanResult.value.rawValue,
        format: scanResult.value.format,
    });

    router.replace({ name: 'card', params: { id } });
}

const formId = useId();

const formSchema = toTypedSchema(
    z.object({
        displayName: z.string().min(2).max(128),
    }),
);
</script>
