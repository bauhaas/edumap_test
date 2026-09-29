<script setup lang="ts">
defineProps<{ label: string, count?: number, disabled?: boolean }>()
const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <label
    class="group flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 transition hover:bg-surface-light-accented"
    :class="{ 'cursor-not-allowed opacity-40': disabled && !checked }"
  >
    <input
      v-model="checked"
      type="checkbox"
      :disabled="disabled && !checked"
      class="peer sr-only"
    >
    <span
      class="flex size-5 shrink-0 items-center justify-center rounded-xs border transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-actions-primary"
      :class="checked ? 'border-actions-primary bg-actions-primary text-invert-primary' : 'border-border-light-active bg-surface-light'"
    >
      <Icon v-if="checked" name="lucide:check" class="size-3.5" />
    </span>
    <span class="flex-1 text-sm text-primary">{{ label }}</span>
    <span v-if="count !== undefined" class="text-xs tabular-nums text-tertiary">{{ count }}</span>
  </label>
</template>
