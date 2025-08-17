/**
 * A composable function that provides notification functionality.
 *
 * @remarks
 * This composable needs to be used in conjunction with the Notification component.
 * The notification component must be mounted in the template using the 'notification' ref.
 *
 * @example
 * ```vue
 * <template>
 *   <Notification ref="notification" />
 * </template>
 *
 * <script setup lang="ts">
 * import { useNotification } from '@/composables/notification';
 *
 * const { showSuccess, showError } = useNotification();
 *
 * // Show success notification
 * showSuccess('Operation completed successfully');
 *
 * // Show error notification
 * showError('An error occurred');
 * </script>
 * ```
 *
 * @returns An object containing:
 * - state: A ref containing the notification state
 * - showSuccess: Function to display a success notification
 * - showError: Function to display an error notification
 */
import { reactive } from 'vue';

interface NotificationState {
    show: boolean; 
    message: string; 
    color: string;
}

// État global pour les notifications
const state = reactive<NotificationState>({
    show: false,
    message: '',
    color: 'success'
});

export function useNotification() {
    const showNotification = (message: string, type: 'success' | 'error') => {
        state.message = message;
        state.color = type;
        state.show = true;
    };

    return {
        state,
        showSuccess: (message: string) => showNotification(message, 'success'),
        showError: (message: string) => showNotification(message, 'error')
    };
}
