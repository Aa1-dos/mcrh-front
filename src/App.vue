<template>
  <Notification v-model="state.show" :color="state.color" :message="state.message" />
  <RouterView />
</template>

<script setup lang="ts">
import { useNotification } from "@/composables/useNotification";
import Notification from "@/components/shared/Notification.vue";
//import { useRouter } from 'vue-router'; 


const { state } = useNotification();
/* const router = useRouter(); */
</script>
