#!/usr/bin/env python3
"""Clean the raw catalogue export (edu_program.csv + edu_school.csv) into public/data/programs-cleaned.json.

Usage: python3 scripts/clean_catalogue.py
"""
from __future__ import annotations

import csv
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parent.parent
PROGRAMS_CSV = ROOT / "edu_program.csv"
SCHOOLS_CSV = ROOT / "edu_school.csv"
OUTPUT = ROOT / "public" / "data" / "programs-cleaned.json"

AXES_ORDER = ("language", "apprenticeship", "track", "school_id")

LANGUAGE_ALIASES = {
    "en": "en", "english": "en", "anglais": "en",
    "es": "es", "spanish": "es", "espagnol": "es",
    "it": "it", "italian": "it", "italien": "it",
    "fr": "fr", "french": "fr", "français": "fr",
}
LANGUAGE_LABELS = {"en": "Anglais", "es": "Espagnol", "it": "Italien", "fr": "Français"}
TRUE_VALUES = {"1", "true", "oui", "yes", "vrai"}
FALSE_VALUES = {"0", "false", "non", "no", "faux"}
TRACK_ALIASES = {"red-team": "red team", "redteam": "red team", "red_team": "red team"}
FIELD_FIXES = {"Data": "Data Science", "Hôtellerie": "Management Hôtelier"}

Program = Dict[str, Any]
School = Dict[str, Any]

report: Dict[str, List[str]] = defaultdict(list)


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", value)).strip()


def read_csv(path: Path) -> List[Dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as f:
        return [{k: clean_text(v or "") for k, v in row.items()} for row in csv.DictReader(f)]


def id_num(program_id: str) -> int:
    return int(re.sub(r"\D", "", program_id) or 0)


def axes_key(variants: Optional[dict]) -> str:
    return json.dumps(variants or {}, sort_keys=True, ensure_ascii=False)


def log(step: str, item: str) -> None:
    report[step].append(item)


# --- Step 1: same program_id repeated with cosmetic differences ---------------------------------

def title_quality(row: Dict[str, str]) -> tuple:
    title, short = row["title"], row["short_title"]
    accents = sum(1 for c in title + short if ord(c) > 127)
    return (title != title.upper(), short != short.upper(), " - " not in short, accents, len(short))


def dedupe_same_id(rows: List[Dict[str, str]]) -> List[Dict[str, str]]:
    groups: Dict[str, List[Dict[str, str]]] = defaultdict(list)
    for row in rows:
        groups[row["program_id"]].append(row)
    kept = []
    structural = ("parent_program_id", "variants", "school_id", "diploma", "field", "city")
    for pid, group in groups.items():
        if len(group) > 1:
            log("1_same_id_duplicates_removed", pid)
            if len({tuple(r[k] for k in structural) for r in group}) > 1:
                log("1_same_id_structural_conflict", pid)
        kept.append(max(group, key=title_quality))
    return kept


# --- Step 2: messy variant values -----------------------------------------------------------------

def to_bool(value: Any) -> Optional[bool]:
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    text = str(value).strip().lower()
    if text in TRUE_VALUES:
        return True
    if text in FALSE_VALUES:
        return False
    return None


def normalize_variants(raw: str, pid: str) -> Optional[dict]:
    if not raw:
        return None
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        log("2_invalid_variants_json", pid)
        return None
    if not isinstance(data, dict):
        log("2_invalid_variants_json", pid)
        return None

    out: Dict[str, Any] = {}
    for key, value in data.items():
        key = clean_text(str(key)).lower()
        if key == "language":
            text = clean_text(str(value)).lower()
            if text not in LANGUAGE_ALIASES:
                log("2_unknown_language", f"{pid}:{value}")
            out[key] = LANGUAGE_ALIASES.get(text, text)
        elif key == "apprenticeship":
            flag = to_bool(value)
            if flag is None:
                log("2_unknown_apprenticeship", f"{pid}:{value}")
                continue
            out[key] = flag
        elif key == "track":
            text = clean_text(str(value)).lower()
            out[key] = TRACK_ALIASES.get(text, text)
        elif key == "school_id":
            out[key] = clean_text(str(value)).upper()
        else:
            log("2_unknown_axis", f"{pid}:{key}")
            out[key] = value

    if out != data:
        log("2_variants_normalized", pid)
    return {k: out[k] for k in sorted(out, key=lambda k: (AXES_ORDER + (k,)).index(k))}


def to_program(row: Dict[str, str]) -> Program:
    pid = row["program_id"]
    field = row["field"]
    if field in FIELD_FIXES:
        log("8_field_typo_fixed", f"{pid}:{field}")
        field = FIELD_FIXES[field]
    return {
        "program_id": pid,
        "parent_program_id": row["parent_program_id"] or None,
        "short_title": row["short_title"],
        "title": row["title"],
        "variants": normalize_variants(row["variants"], pid),
        "school_id": row["school_id"],
        "diploma": row["diploma"],
        "field": field,
        "city": row["city"],
        "school_ref_valid": True,
        "merged_from": [],
    }


# --- Step 3: duplicate campuses in edu_school -----------------------------------------------------

def merge_schools(rows: List[Dict[str, str]]) -> tuple:
    schools: Dict[str, School] = {
        r["school_id"]: {**r, "parent_school_id": r["parent_school_id"] or None, "merged_from": []} for r in rows
    }
    alias: Dict[str, str] = {}
    for sid, school in schools.items():
        parent = schools.get(school["parent_school_id"] or "")
        if parent and parent["city"] == school["city"]:
            alias[sid] = parent["school_id"]
            parent["merged_from"].append(sid)
            log("3_duplicate_campus_merged", f"{sid}->{parent['school_id']}")
    for sid in alias:
        del schools[sid]
    return schools, alias


def remap_schools(programs: Dict[str, Program], alias: Dict[str, str]) -> None:
    for p in programs.values():
        if p["school_id"] in alias:
            p["school_id"] = alias[p["school_id"]]
            log("3_program_school_remapped", p["program_id"])
        variants = p["variants"] or {}
        if variants.get("school_id") in alias:
            variants["school_id"] = alias[variants["school_id"]]
            log("3_campus_axis_remapped", p["program_id"])


# --- Step 4: inconsistent locations --------------------------------------------------------------

def fix_locations(programs: Dict[str, Program], schools: Dict[str, School]) -> None:
    campus_by_brand_city = {}
    for sid, s in schools.items():
        campus_by_brand_city[(s["parent_school_id"] or sid, s["city"])] = sid

    for p in programs.values():
        pid = p["program_id"]
        campus = (p["variants"] or {}).get("school_id")
        if campus in schools:
            if p["school_id"] != campus or p["city"] != schools[campus]["city"]:
                p["school_id"], p["city"] = campus, schools[campus]["city"]
                log("4_campus_variant_relocated", pid)
            continue

        school = schools.get(p["school_id"])
        if not school or school["city"] == p["city"]:
            continue
        brand = school["parent_school_id"] or p["school_id"]
        target = campus_by_brand_city.get((brand, p["city"]))
        if target:
            log("4_moved_to_brand_campus", f"{pid}:{p['school_id']}->{target}")
            p["school_id"] = target
        else:
            log("4_location_unresolved", f"{pid}:{p['school_id']}({school['city']})!={p['city']}")


# --- Step 5: no-op campus axis --------------------------------------------------------------------

def drop_noop_campus(programs: Dict[str, Program]) -> None:
    for p in programs.values():
        parent = programs.get(p["parent_program_id"] or "")
        variants = p["variants"] or {}
        if parent and variants.get("school_id") == parent["school_id"]:
            del variants["school_id"]
            log("5_noop_campus_axis_removed", p["program_id"])


# --- Step 6: duplicates under different program_ids -----------------------------------------------

def merge_into(programs: Dict[str, Program], keep: Program, drop: Program, step: str) -> None:
    keep["merged_from"] = sorted(set(keep["merged_from"] + [drop["program_id"]] + drop["merged_from"]), key=id_num)
    for child in programs.values():
        if child["parent_program_id"] == drop["program_id"]:
            child["parent_program_id"] = keep["program_id"]
            log("6_children_reattached", child["program_id"])
    del programs[drop["program_id"]]
    log(step, f"{drop['program_id']}->{keep['program_id']}")


def dedupe_cross_id(programs: Dict[str, Program]) -> None:
    generics: Dict[tuple, List[Program]] = defaultdict(list)
    for p in programs.values():
        if not p["parent_program_id"]:
            generics[(p["school_id"], p["diploma"], p["field"], axes_key(p["variants"]))].append(p)
    for group in generics.values():
        keep, *drops = sorted(group, key=lambda p: id_num(p["program_id"]))
        for drop in drops:
            merge_into(programs, keep, drop, "6_generic_duplicates_merged")

    for p in list(programs.values()):
        if p["parent_program_id"] and not p["variants"]:
            merge_into(programs, programs[p["parent_program_id"]], p, "6_axisless_variant_merged_into_parent")

    variants: Dict[tuple, List[Program]] = defaultdict(list)
    for p in programs.values():
        if p["parent_program_id"]:
            variants[(p["parent_program_id"], axes_key(p["variants"]))].append(p)
    for group in variants.values():
        keep, *drops = sorted(group, key=lambda p: id_num(p["program_id"]))
        for drop in drops:
            merge_into(programs, keep, drop, "6_variant_duplicates_merged")


# --- Step 7: broken references --------------------------------------------------------------------

def fix_references(programs: Dict[str, Program], schools: Dict[str, School]) -> None:
    for p in programs.values():
        if p["parent_program_id"] and p["parent_program_id"] not in programs:
            log("7_orphan_promoted_to_generic", f"{p['program_id']}(parent {p['parent_program_id']})")
            p["parent_program_id"] = None
        campus = (p["variants"] or {}).get("school_id")
        if p["school_id"] not in schools or (campus and campus not in schools):
            p["school_ref_valid"] = False
            log("7_unknown_school_flagged", f"{p['program_id']}:{p['school_id']}")


# --- Step 9: titles rebuilt from structured data --------------------------------------------------

def track_label(track: str) -> str:
    return " ".join("-".join(part[:1].upper() + part[1:] for part in word.split("-")) for word in track.split(" "))


def rebuild_titles(programs: Dict[str, Program], schools: Dict[str, School]) -> None:
    for p in programs.values():
        long_labels, short_labels = [], []
        for key, value in (p["variants"] or {}).items():
            if key == "language":
                long_labels.append(LANGUAGE_LABELS.get(value, value.upper()))
                short_labels.append(value.upper())
            elif key == "apprenticeship":
                label = "Alternance" if value else "Initiale"
                long_labels.append(label)
                short_labels.append(label)
            elif key == "track":
                long_labels.append(track_label(value))
                short_labels.append(track_label(value))
            elif key == "school_id":
                city = schools[value]["city"] if value in schools else p["city"]
                long_labels.append(f"Campus {city}")
                short_labels.append(city)
            else:
                long_labels.append(str(value))
                short_labels.append(str(value))

        base = f"{p['diploma']} {p['field']}"
        title = f"{base} — {', '.join(long_labels)}" if long_labels else base
        short_title = f"{base} — {' / '.join(short_labels)}" if short_labels else base
        if (title, short_title) != (p["title"], p["short_title"]):
            log("9_titles_rebuilt", p["program_id"])
        p["title"], p["short_title"] = title, short_title


def sanity_checks(programs: Dict[str, Program]) -> None:
    for p in programs.values():
        parent = programs.get(p["parent_program_id"] or "")
        if p["parent_program_id"] and not parent:
            log("check_broken_parent", p["program_id"])
        if parent and parent["parent_program_id"]:
            log("check_parent_is_variant", p["program_id"])
        if parent and not (p["variants"] or {}).get("school_id") and parent["school_id"] != p["school_id"]:
            log("check_variant_school_mismatch", p["program_id"])


def main() -> None:
    raw_programs = read_csv(PROGRAMS_CSV)
    raw_schools = read_csv(SCHOOLS_CSV)

    rows = dedupe_same_id(raw_programs)
    programs = {p["program_id"]: p for p in map(to_program, rows)}
    schools, alias = merge_schools(raw_schools)
    remap_schools(programs, alias)
    fix_references(programs, schools)
    fix_locations(programs, schools)
    drop_noop_campus(programs)
    dedupe_cross_id(programs)
    rebuild_titles(programs, schools)
    sanity_checks(programs)

    ordered = sorted(programs.values(), key=lambda p: id_num(p["program_id"]))
    for p in ordered:
        p["variants"] = p["variants"] or None

    stats = {
        "raw_program_rows": len(raw_programs),
        "raw_schools": len(raw_schools),
        "programs": len(ordered),
        "generics": sum(1 for p in ordered if not p["parent_program_id"]),
        "variants": sum(1 for p in ordered if p["parent_program_id"]),
        "schools": len(schools),
        "invalid_school_refs": sum(1 for p in ordered if not p["school_ref_valid"]),
    }
    output = {
        "stats": stats,
        "report": {step: {"count": len(items), "items": items} for step, items in sorted(report.items())},
        "schools": sorted(schools.values(), key=lambda s: id_num(s["school_id"])),
        "programs": ordered,
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Wrote {OUTPUT.relative_to(ROOT)}")
    for key, value in stats.items():
        print(f"  {key:<22} {value}")
    print("Report:")
    for step, items in sorted(report.items()):
        print(f"  {step:<42} {len(items)}")


if __name__ == "__main__":
    main()
