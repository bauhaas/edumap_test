import {
  APPRENTICESHIP_LABELS,
  DEFAULT_LANGUAGE,
  LANGUAGE_LABELS,
} from './programs'
import type {
  Catalogue,
  CatalogueFile,
  Program,
  ProgramGroup,
  ProgramTag,
  RawProgram,
  RawSchool,
} from './programs'
import { normalizeText } from './text'

function formatTrack(track: string): string {
  return track.replace(/(^|[\s-])(\p{L})/gu, (_, sep: string, char: string) => sep + char.toUpperCase())
}

function enrichProgram(raw: RawProgram, schools: Map<string, RawSchool>): Program {
  const school = schools.get(raw.school_id)
  const brand = school ? schools.get(school.parent_school_id ?? school.school_id) ?? school : undefined
  const axes = raw.variants ?? {}
  const language = axes.language ?? DEFAULT_LANGUAGE
  const languageLabel = LANGUAGE_LABELS[language] ?? language.toUpperCase()
  const modality = axes.apprenticeship === true ? 'apprenticeship' : 'initial'
  const track = axes.track ?? null
  const trackLabel = track ? formatTrack(track) : null
  const schoolName = school?.short_title ?? 'École non référencée'
  const brandName = brand?.short_title ?? schoolName

  const tags: ProgramTag[] = []
  if (axes.language) tags.push({ axis: 'language', label: languageLabel })
  if (axes.apprenticeship !== undefined) tags.push({ axis: 'apprenticeship', label: APPRENTICESHIP_LABELS[modality] })
  if (trackLabel) tags.push({ axis: 'track', label: trackLabel })
  if (axes.school_id) tags.push({ axis: 'campus', label: `Campus ${schools.get(axes.school_id)?.city ?? raw.city}` })

  return {
    id: raw.program_id,
    parentId: raw.parent_program_id,
    title: raw.title,
    shortTitle: raw.short_title,
    diploma: raw.diploma,
    field: raw.field,
    city: raw.city,
    schoolId: raw.school_id,
    schoolName,
    brandId: brand?.school_id ?? null,
    brandName,
    schoolRefValid: raw.school_ref_valid,
    language,
    languageLabel,
    modality,
    track,
    trackLabel,
    tags,
    searchText: normalizeText([
      raw.title,
      raw.short_title,
      raw.city,
      schoolName,
      brandName,
      languageLabel,
      trackLabel ?? '',
      modality === 'apprenticeship' ? 'alternance apprentissage' : '',
    ].join(' ')),
  }
}

const byTitle = (a: Program, b: Program) => a.title.localeCompare(b.title, 'fr')

export function buildCatalogue(file: CatalogueFile): Catalogue {
  const schools = new Map(file.schools.map(s => [s.school_id, s]))
  const programs = file.programs.map(program => enrichProgram(program, schools))
  const groups = new Map<string, ProgramGroup>()

  for (const program of programs) {
    if (!program.parentId) groups.set(program.id, { generic: program, variants: [] })
  }
  for (const program of programs) {
    if (!program.parentId) continue
    const parent = groups.get(program.parentId)
    if (parent) parent.variants.push(program)
    else groups.set(program.id, { generic: program, variants: [] })
  }

  const sorted = [...groups.values()].sort((a, b) => byTitle(a.generic, b.generic))
  sorted.forEach(group => group.variants.sort(byTitle))
  return { groups: sorted, programCount: programs.length }
}
