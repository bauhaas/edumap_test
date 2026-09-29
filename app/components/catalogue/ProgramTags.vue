<script setup lang="ts">
defineProps<{ tags: ProgramTag[] }>()
</script>

<template>
  <ul class="flex flex-wrap gap-1.5">
    <li
      v-for="tag in tags"
      :key="tag.axis"
      class="inline-flex h-6 items-center gap-1 rounded-full bg-surface-light-accented px-2.5 text-xs font-medium text-secondary"
    >
      <Icon :name="AXIS_ICONS[tag.axis]" class="size-3 text-icon-subtle-default" />
      {{ tag.label }}
    </li>
  </ul>
</template>
