<template>
    <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema" :initial-values="model">
        <Dialog v-model:open="open">
            <DialogTrigger as-child>
                <Button variant="secondary">
                    <Pencil class="size-4" />
                    <span v-t="'edit_card'"></span>
                </Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle><span v-t="'edit_card'"></span></DialogTitle>
                </DialogHeader>
                <form :id="formId" @submit="handleSubmit($event, onSubmit)">
                    <FormField v-slot="{ componentField }" name="displayName">
                        <FormItem>
                            <FormLabel><span v-t="'display_name'"></span></FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="color">
                        <FormItem>
                            <FormLabel><span v-t="'color'"></span></FormLabel>
                            <FormControl>
                                <Input type="color" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="image">
                        <FormItem>
                            <FormLabel><span v-t="'image'"></span></FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>
                <DialogFooter>
                    <Button type="submit" :form="formId"> Save changes </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue';
import * as z from 'zod';
import { Pencil } from 'lucide-vue-next';
import { toTypedSchema } from '@vee-validate/zod';
import type { Card } from '@/types';
import { dataURLtoBlob, deleteFile, storeFile } from '@/utils/file';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const model = defineModel<Card>({ required: true });

const open = ref(false);

const zodSchema = z.object({
    displayName: z.string().min(2).max(50),
    color: z.string(),
    image: z.string().optional(),
});

const formSchema = toTypedSchema(zodSchema);

async function onSubmit({ displayName, color, image }: z.infer<typeof zodSchema>) {
    if (model.value.image) await deleteFile(model.value.image);

    const imageId = !image ? undefined : await dataURLtoBlob(image).then(storeFile);

    model.value = { ...model.value, displayName, color, image: imageId };

    open.value = false;
}

const formId = useId();
</script>
