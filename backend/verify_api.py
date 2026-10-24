import urllib.request
import json

url = "http://127.0.0.1:8000/api/curriculum/univ-presidency-curriculum-2023-2027"
req = urllib.request.urlopen(url)
data = json.loads(req.read().decode("utf-8"))

all_c = {c["code"]: c for s in data["semesters"] for c in s["courses"]}

keys = ["ENG2001", "CSE2001", "CSE3155", "CSE2285", "CSE2506", "CSE2286", "CSE2067", "CSE2514"]
for k in keys:
    if k in all_c:
        c = all_c[k]
        print(f"[{k}] {c['title']}: {len(c['units'])} Units, {len(c['course_outcomes'])} COs, {len(c['textbooks'])} Books")
        for u in c["units"]:
            print(f"    - Module {u['unit_number']} ({u['hours']}h): {u['title']} ({len(u['topics'])} topics)")
    else:
        print(f"[{k}] NOT FOUND!")
