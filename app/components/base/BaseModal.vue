<script setup lang="ts">
const props = defineProps<{ title: string, icon?: string, description?: string, wide?: boolean }>()
const open = defineModel<boolean>('open', { required: true })

const dialog = ref<HTMLDialogElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const titleId = useId()
const descriptionId = useId()
let previousFocus: HTMLElement | null = null

function close() {
  dialog.value?.close()
  open.value = false
}

function onNativeClose() {
  open.value = false
  previousFocus?.focus()
  previousFocus = null
}

watch(open, async (isOpen) => {
  if (isOpen) {
    previousFocus = document.activeElement as HTMLElement | null
    await nextTick()
    dialog.value?.showModal()
    panel.value?.focus()
  }
  else if (dialog.value?.open) {
    dialog.value.close()
  }
})

</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-in-quad"
      leave-active-class="transition duration-150 ease-in-quad"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <dialog
        ref="dialog"
        v-if="open"
        class="app-modal m-0 fixed inset-0 z-50 flex h-screen max-h-none w-screen max-w-none items-end justify-center border-0 bg-transparent p-0 sm:items-center sm:p-6"
        @click.self="close"
        @cancel.prevent="close"
        @close="onNativeClose"
      >
        <div
          ref="panel"
          :aria-labelledby="titleId"
          :aria-describedby="props.description ? descriptionId : undefined"
          tabindex="-1"
          class="flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-lg bg-surface-light shadow-s outline-none sm:rounded-lg"
          :class="props.wide ? 'sm:max-w-2xl' : 'sm:max-w-md'"
        >
          <header class="flex items-center gap-3 border-b border-border-light-default px-6 py-4">
            <Icon v-if="props.icon" :name="props.icon" class="size-5 shrink-0 text-icon-subtle-default" />
            <div class="min-w-0 flex-1">
              <h2 :id="titleId" class="text-lg font-semibold">{{ props.title }}</h2>
              <p v-if="props.description" :id="descriptionId" class="truncate text-sm text-tertiary">{{ props.description }}</p>
            </div>
            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-full text-icon-subtle-default transition hover:bg-actions-secondary"
              aria-label="Fermer"
              @click="close"
            >
              <Icon name="lucide:x" class="size-4" />
            </button>
          </header>

          <div class="flex-1 overflow-y-auto px-3 py-3">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="flex items-center gap-3 border-t border-border-light-default px-6 py-4">
            <slot name="footer" />
          </footer>
        </div>
      </dialog>
    </Transition>
  </Teleport>
</template>
