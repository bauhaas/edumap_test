<script setup lang="ts">
defineProps<{ label: string, icon: string, active?: boolean, count?: number, chevron?: boolean }>()
</script>

<template>
  <button
    type="button"
    class="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition duration-200 ease-in-quad"
    :class="active
      ? 'border-transparent bg-linear-to-r from-pink-medium to-orange-medium text-invert-primary shadow-xs hover:opacity-90'
      : 'border-border-light-default bg-surface-light text-primary hover:border-border-light-active'"
    :aria-pressed="active"
  >
    <Icon :name="icon" class="size-4" :class="active ? 'text-invert-secondary' : 'text-icon-subtle-default'" />
    {{ label }}
    <span
      v-if="count"
      class="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-light px-1.5 text-xs font-semibold text-primary"
    >{{ count }}</span>
    <Icon v-if="chevron" name="lucide:chevron-down" class="size-4 opacity-60" />
  </button>
</template>
