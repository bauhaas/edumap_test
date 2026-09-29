<script setup lang="ts">
import { paginationRange } from '~/utils/pagination'

const props = defineProps<{ totalPages: number }>()
const page = defineModel<number>({ required: true })

const range = computed(() => paginationRange(page.value, props.totalPages))

function go(target: number) {
  page.value = Math.min(Math.max(1, target), props.totalPages)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination" class="flex justify-center pt-2">
    <div class="flex items-center gap-1">
      <button
        type="button"
        aria-label="Page précédente"
        :disabled="page === 1"
        class="flex size-9 items-center justify-center rounded-full transition hover:bg-actions-secondary disabled:pointer-events-none disabled:opacity-30"
        @click="go(page - 1)"
      >
        <Icon name="lucide:chevron-left" class="size-4" />
      </button>

      <template v-for="(n, i) in range" :key="n ?? `gap-${i}`">
        <span v-if="n === null" class="w-6 text-center text-sm text-tertiary">…</span>
        <button
          v-else
          type="button"
          :aria-current="n === page ? 'page' : undefined"
          class="flex size-9 items-center justify-center rounded-full text-sm font-medium tabular-nums transition"
          :class="n === page ? 'bg-actions-primary text-invert-primary' : 'hover:bg-actions-secondary'"
          @click="go(n)"
        >
          {{ n }}
        </button>
      </template>

      <button
        type="button"
        aria-label="Page suivante"
        :disabled="page === totalPages"
        class="flex size-9 items-center justify-center rounded-full transition hover:bg-actions-secondary disabled:pointer-events-none disabled:opacity-30"
        @click="go(page + 1)"
      >
        <Icon name="lucide:chevron-right" class="size-4" />
      </button>
    </div>
  </nav>
</template>
