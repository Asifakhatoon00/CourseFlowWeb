import urllib.request
import json

def post_json(url, payload):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())

def get_json(url):
    with urllib.request.urlopen(url) as res:
        return json.loads(res.read())

try:
    # 1. Switch to 2024-2028
    data = post_json("http://127.0.0.1:8000/api/universities/univ-presidency-01/set-active-batch", {"batch": "2024-2028"})
    print("Switch to 2024-2028 status:", data.get("status"))
    print("Active batch:", data.get("active_batch"))
    print("Curriculum title:", data.get("curriculum", {}).get("title"))
    print("Sem 1 courses:", [c["code"] for c in data.get("curriculum", {}).get("semesters", [])[0].get("courses", [])])

    # 2. Switch back to 2023-2027
    data2 = post_json("http://127.0.0.1:8000/api/universities/univ-presidency-01/set-active-batch", {"batch": "2023-2027"})
    print("\nSwitch to 2023-2027 status:", data2.get("status"))
    print("Active batch:", data2.get("active_batch"))
    print("Curriculum title:", data2.get("curriculum", {}).get("title"))
    print("Sem 1 courses:", [c["code"] for c in data2.get("curriculum", {}).get("semesters", [])[0].get("courses", [])])

    # 3. Check all batches
    batch_res = get_json("http://127.0.0.1:8000/api/universities/univ-presidency-01/batches")
    batches = batch_res.get("batches", [])
    print("\nAll batches available:")
    for b in batches:
        print(f" - Batch {b['batch']}: {b['title']} ({b['total_credits']} Cr, {b['courses_count']} courses)")

except Exception as e:
    print("Error:", e)
