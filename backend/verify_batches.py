import urllib.request
import json

url = "http://127.0.0.1:8000/api/universities/univ-presidency-01/batches"
req = urllib.request.urlopen(url)
data = json.loads(req.read().decode("utf-8"))

print("University:", data["university_name"])
print("Active Batch:", data["active_batch"])
print("Total Batches Available:", len(data["batches"]))
for b in data["batches"]:
    print(f"  • Batch {b['batch']}: {b['title']} ({b['total_credits']} Credits, {b['courses_count']} Courses, ID: {b['curriculum_id']})")
