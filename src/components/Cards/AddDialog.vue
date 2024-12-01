<template>
    <Form v-if="scanResult" v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
        <Dialog v-model:open="open">
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
    <GrantCameraAccessDialog v-else-if="permission !== 'granted'" v-model:open="open" :constraints />
    <ScanDialog
        v-else
        v-model:open="open"
        :constraints
        @submit="
            scanResult = $event;
            nextTick(() => {
                open = true;
            });
        "
    />
</template>

<script setup lang="ts">
import { nextTick, ref, useId } from 'vue';
import { useRouter } from 'vue-router';
import { usePermission } from '@vueuse/core';
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

const open = defineModel<boolean>('open', { type: Boolean, required: true });

const permission = usePermission('camera');

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
