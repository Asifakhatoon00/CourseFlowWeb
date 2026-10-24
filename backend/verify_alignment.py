import urllib.request
import json

url = "http://127.0.0.1:8000/api/curriculum/univ-presidency-curriculum-2023-2027/semantic-alignment"
req = urllib.request.urlopen(url)
matches = json.loads(req.read().decode("utf-8"))

print(f"Total Semantic Matches: {len(matches)}")
for m in matches[:12]:
    print(f"{m['university_course_code']} ({m['university_course_title']}) <===> {m['aicte_matched_code']} ({m['aicte_matched_title']})")
    print(f"   Symmetry Score: {m['symmetry_score']}% | Status: {m['status']}")
    print(f"   Shared Core Topics: {', '.join(m.get('shared_core_topics', [])[:6])}")
    print()
