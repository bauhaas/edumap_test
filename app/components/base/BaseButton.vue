<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  icon?: string
  type?: 'button' | 'submit'
}>(), { variant: 'secondary', size: 'md', type: 'button' })
</script>

<template>
  <button
    :type="type"
    class="inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium transition duration-200 ease-in-quad focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-actions-primary disabled:cursor-not-allowed disabled:opacity-40"
    :class="[
      size === 'sm' ? 'h-8 px-3 text-sm' : 'h-11 px-5 text-sm',
      {
        'bg-actions-primary text-invert-primary hover:bg-actions-primary-hover': variant === 'primary',
        'bg-actions-secondary text-primary hover:bg-actions-secondary-hover': variant === 'secondary',
        'text-secondary hover:bg-actions-secondary': variant === 'ghost',
      },
    ]"
  >
    <Icon v-if="icon" :name="icon" class="size-4" />
    <slot />
  </button>
</template>
