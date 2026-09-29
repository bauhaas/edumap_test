import { FILTER_DEFINITIONS, FILTER_KEYS } from './programs'
import type { FilterKey, FilterOption, FilterState, MatchContext, Program, ProgramGroup, ProgramResult } from './programs'
import { collator } from './text'

export function emptyFilters(): FilterState {
  return Object.fromEntries(FILTER_KEYS.map(key => [key, []])) as unknown as FilterState
}

function programMatches(program: Program, ctx: MatchContext, skip?: FilterKey): boolean {
  if (ctx.favorites && !ctx.favorites.has(program.id)) return false
  for (const key of FILTER_KEYS) {
    const selected = ctx.filters[key]
    if (key === skip || !selected.length) continue
    const value = FILTER_DEFINITIONS[key].getValue(program)
    if (value === null || !selected.includes(value)) return false
  }
  return ctx.tokens.every(token => program.searchText.includes(token))
}

function matchGroup(group: ProgramGroup, ctx: MatchContext): ProgramResult | null {
  const variants = group.variants.filter(v => programMatches(v, ctx))
  if (!variants.length && !programMatches(group.generic, ctx)) return null
  return { group, variants }
}

export function filterGroups(groups: ProgramGroup[], ctx: MatchContext): ProgramResult[] {
  const results: ProgramResult[] = []
  for (const group of groups) {
    const result = matchGroup(group, ctx)
    if (result) results.push(result)
  }
  return results
}

export function countResults(groups: ProgramGroup[], ctx: MatchContext): number {
  return groups.reduce((n, g) => n + ([g.generic, ...g.variants].some(p => programMatches(p, ctx)) ? 1 : 0), 0)
}

// Counts ignore the facet's own selection so sibling options keep a meaningful count.
export function facetOptions(groups: ProgramGroup[], ctx: MatchContext, key: FilterKey): FilterOption[] {
  const definition = FILTER_DEFINITIONS[key]
  const options = new Map<string, FilterOption>()

  for (const group of groups) {
    const counted = new Set<string>()
    for (const program of [group.generic, ...group.variants]) {
      const value = definition.getValue(program)
      if (value === null) continue
      let option = options.get(value)
      if (!option) {
        option = { value, label: definition.getLabel(program), count: 0 }
        options.set(value, option)
      }
      if (!counted.has(value) && programMatches(program, ctx, key)) {
        counted.add(value)
        option.count++
      }
    }
  }

  const list = [...options.values()]
  return definition.sortOptions ? list.sort((a, b) => collator.compare(a.label, b.label)) : list
}
