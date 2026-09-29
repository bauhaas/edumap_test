import type { ProgramResult, SortKey, SortState } from './programs'
import { collator } from './text'

const SORT_COMPARATORS: Record<SortKey, (a: ProgramResult, b: ProgramResult) => number> = {
  field: (a, b) => collator.compare(a.group.generic.field, b.group.generic.field),
  city: (a, b) => collator.compare(a.group.generic.city, b.group.generic.city),
  variants: (a, b) => a.group.variants.length - b.group.variants.length,
  diploma: (a, b) => collator.compare(a.group.generic.diploma, b.group.generic.diploma),
}

export function sortResults(results: ProgramResult[], sort: SortState): ProgramResult[] {
  const compare = SORT_COMPARATORS[sort.key]
  const sign = sort.direction === 'asc' ? 1 : -1
  return [...results].sort((a, b) =>
    sign * compare(a, b) || collator.compare(a.group.generic.title, b.group.generic.title))
}
