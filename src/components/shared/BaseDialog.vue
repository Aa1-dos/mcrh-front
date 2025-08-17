<template>
    <v-dialog :model-value="moodelValue" @update:model-value="$emit('update:modelValue', $event)"
        :max-width="maxWidth ?? 400">
        <v-card>
            <v-card-title class="text-h5">
                <slot name="title" />
            </v-card-title>

            <v-card-text>
                <slot name="content" />
            </v-card-text>

            <v-card-actions>
                <slot name="actions" />
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
const { moodelValue, maxWidth } = defineProps<{
    moodelValue: boolean;
    maxWidth?: string | number;
}>();
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
    font-size: 1.25rem;
}
</style>