import urllib.request
import json

def post(url, payload):
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())

def get(url):
    with urllib.request.urlopen(url) as res:
        return json.loads(res.read())

try:
    # 1. Login Admin
    admin_login = post('http://127.0.0.1:8000/api/auth/login', {'email': 'dean.socse@presidencyuniversity.in', 'password': 'admin123'})
    print("1. Admin Login:", admin_login['user']['name'], f"({admin_login['user']['role']})")

    # 2. Login HOD
    hod_login = post('http://127.0.0.1:8000/api/auth/login', {'email': 'hod.cse@presidencyuniversity.in', 'password': 'hod123'})
    print("2. HOD Login:", hod_login['user']['name'], f"({hod_login['user']['role']})")

    # 3. Login Faculty
    fac_login = post('http://127.0.0.1:8000/api/auth/login', {'email': 'faculty.daa@presidencyuniversity.in', 'password': 'faculty123'})
    print("3. Faculty Login:", fac_login['user']['name'], "Assigned courses:", fac_login['user']['assigned_courses'])

    # 4. Get Staff list
    staff = get('http://127.0.0.1:8000/api/staff/univ-presidency-01')
    print("4. Staff members found:", len(staff['staff']))

    # 5. AI suggestions for CSE2007 (Design & Analysis of Algorithms)
    suggestions = get('http://127.0.0.1:8000/api/courses/univ-presidency-curriculum-2023-2027/CSE2007/ai-suggestions')
    print("5. AI Suggestions for CSE2007:")
    print("   Obsolete warnings:", len(suggestions['obsolete_topics']))
    print("   Industry additions:", len(suggestions['industry_additions']))
    print("   Sample addition:", suggestions['industry_additions'][0]['topic'])

    print("\nSUCCESS: All backend authentication & AI endpoints verified!")
except Exception as e:
    import traceback
    traceback.print_exc()
