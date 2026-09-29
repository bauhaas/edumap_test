<script setup lang="ts">
defineProps<{ results: ProgramResult[] }>()
</script>

<template>
  <div class="overflow-x-auto rounded-md border border-border-light-default bg-surface-light shadow-xs">
    <table class="w-full min-w-[860px] text-left text-sm">
      <thead class="border-b border-border-light-default text-xs font-semibold tracking-wide text-tertiary uppercase">
        <tr>
          <th scope="col" class="w-32 px-5 py-3.5">Diplôme</th>
          <th scope="col" class="px-5 py-3.5">Formation</th>
          <th scope="col" class="px-5 py-3.5">École</th>
          <th scope="col" class="px-5 py-3.5">Ville</th>
          <th scope="col" class="px-5 py-3.5">Variantes</th>
          <th scope="col" class="w-14 px-5 py-3.5"><span class="sr-only">Favori</span></th>
        </tr>
      </thead>
      <tbody>
        <CatalogueResultsTableRow
          v-for="result in results"
          :key="result.group.generic.id"
          :result="result"
        />
      </tbody>
    </table>
  </div>
</template>
