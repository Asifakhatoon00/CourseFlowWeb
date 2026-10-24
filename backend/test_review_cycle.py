import urllib.request
import json

def post(url, payload):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())

def get(url):
    with urllib.request.urlopen(url) as res:
        return json.loads(res.read())

curr_id = "univ-presidency-curriculum-2023-2027"

# 1. Fetch current units of CSE2007
curr = get(f"http://127.0.0.1:8000/api/curriculum/{curr_id}")
cse2007 = next((c for s in curr["semesters"] for c in s["courses"] if c["code"] == "CSE2007"), None)
print("Initial course status:", cse2007["review_status"])

# 2. Faculty edits Module 4: adds randomized algorithms and submits for review
units = cse2007["units"]
if units and len(units) >= 4:
    units[3]["topics"].append("Randomized Algorithms & Monte Carlo Methods in Distributed Consensus")

update_res = post("http://127.0.0.1:8000/api/courses/update-modules", {
    "curriculum_id": curr_id,
    "course_code": "CSE2007",
    "units": units,
    "faculty_revision_notes": "Added modern randomized algorithms and distributed consensus per industry AICTE suggestions.",
    "submit_for_review": True
})
print("Update result message:", update_res["message"])
print("New status:", update_res["course"]["review_status"])

# 3. HOD checks review queue
queue = get(f"http://127.0.0.1:8000/api/curriculum/{curr_id}/review-queue")
print("Pending courses in HOD queue:", len(queue["pending_courses"]), [c["code"] for c in queue["pending_courses"]])

# 4. HOD approves course
review_res = post("http://127.0.0.1:8000/api/courses/review", {
    "curriculum_id": curr_id,
    "course_code": "CSE2007",
    "action": "approve",
    "comments": "Approved. Excellent modernization with randomized algorithms."
})
print("Review action result:", review_res["action"], "Final status:", review_res["course"]["review_status"])
print("ALL REVIEW WORKFLOW ENDPOINTS WORKING!")
