<script lang="ts">
  import type { Toast } from '../../types'

  interface Props {
    toasts: Toast[]
  }

  let { toasts }: Props = $props()
</script>

<div 
  class="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none"
  role="region"
  aria-label="Notifications"
  aria-live="polite"
>
  {#each toasts as toast (toast.id)}
    <div 
      class="bg-black/80 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-down"
      role="status"
    >
      <i class={toast.icon} aria-hidden="true"></i>
      <span class="text-sm font-medium">{toast.message}</span>
    </div>
  {/each}
</div>

<style>
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-down {
    animation: slide-down 0.2s ease-out;
  }
</style>