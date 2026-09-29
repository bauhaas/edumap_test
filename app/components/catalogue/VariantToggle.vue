<script setup lang="ts">
import { plural } from '~/utils/text'

const props = defineProps<{ shown: number, total: number }>()
const emit = defineEmits<{ open: [] }>()

const label = computed(() => {
  const totalLabel = plural(props.total, 'variante')
  return props.shown === props.total ? totalLabel : `${props.shown}/${totalLabel}`
})
</script>

<template>
  <button
    type="button"
    aria-haspopup="dialog"
    :disabled="shown === 0"
    class="group inline-flex h-8 items-center gap-1.5 rounded-full bg-actions-secondary px-3 text-xs font-semibold text-primary transition hover:bg-actions-secondary-hover disabled:cursor-default disabled:opacity-50 disabled:hover:bg-actions-secondary"
    @click.stop="emit('open')"
  >
    <Icon name="lucide:layers" class="size-3.5 text-icon-subtle-default" />
    {{ label }}
    <Icon name="lucide:arrow-up-right" class="size-3.5 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </button>
</template>
