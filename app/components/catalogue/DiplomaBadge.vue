<script setup lang="ts">
defineProps<{ diploma: string }>()
</script>

<template>
  <span class="inline-flex rounded-full bg-linear-to-r from-pink-medium to-orange-medium px-2.5 py-0.5 text-xs font-semibold text-invert-primary shadow-xs">
    {{ diploma }}
  </span>
</template>
