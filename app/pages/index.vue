<template>
  <main class="mx-auto max-w-5xl p-8">
    <h1 class="flex items-center gap-2 text-heading-lg font-semibold tracking-sm">
      <Icon name="lucide:graduation-cap" class="size-8" />
      Edumapper
    </h1>
    <p class="mt-2 text-tertiary">Nuxt 4 + Tailwind v4 + @nuxt/icon</p>

    <div class="mt-6 flex gap-3">
      <button class="rounded-full bg-actions-primary px-4 py-2 text-sm font-medium text-invert-primary transition hover:bg-actions-primary-hover">
        Primary
      </button>
      <button class="rounded-full bg-actions-secondary px-4 py-2 text-sm font-medium transition hover:bg-actions-secondary-hover">
        Secondary
      </button>
    </div>

    <div class="mt-6 rounded-md border border-border-light-default bg-surface-light p-4 shadow-xs">
      Card on surface-light
    </div>
  </main>
</template>
