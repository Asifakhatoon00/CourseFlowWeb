import json

with open("backend/data/presidency_curriculum_cache.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Semesters:", len(data["semesters"]))
total = 0
fallback = 0
real = 0

for sem in data["semesters"]:
    print(f"\n=== Semester {sem['semester_number']} ({len(sem['courses'])} courses) ===")
    for c in sem["courses"]:
        total += 1
        units = c.get("units", [])
        is_fb = any("Foundations of" in u.get("title", "") for u in units)
        if is_fb:
            fallback += 1
            print(f"  [FALLBACK] {c['code']}: {c['title']} (Units: {len(units)})")
        else:
            real += 1
            sample_unit = units[0]["title"] if units else "NO_UNITS"
            print(f"  [REAL] {c['code']}: {c['title']} ({len(units)} units, First: '{sample_unit}')")

print(f"\nSUMMARY: Total={total}, Real={real}, Fallback={fallback}")
