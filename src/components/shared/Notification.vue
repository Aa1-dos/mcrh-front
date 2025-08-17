<template>
    <v-snackbar :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" :color="color"
        :bg-color="color" :text-color="'white'" transition="scale-transition" location="top right" :timeout="3000">
        {{ message }}
        <template v-slot:actions>
            <v-btn icon="mdi-close" @click="emit('update:modelValue', false)" variant="text" />
        </template>
    </v-snackbar>
</template>
<script setup lang="ts">
const { modelValue, message, color } = defineProps<{
    modelValue: boolean;
    message: string;
    color: string;
}>();

const emit = defineEmits(['update:modelValue']);
</script>


<style scoped>
.v-snackbar {
    z-index: 9999;
}
</style>