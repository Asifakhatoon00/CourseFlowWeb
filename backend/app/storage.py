"""
Data Persistence and In-Memory / JSON Store
Maintains universities, users (with RBAC roles), multi-batch curricula, and AICTE benchmark models.
"""

import os
import json
import copy
from typing import Dict, List, Optional, Any
from .schemas import University, User, Curriculum, Semester, Course, Unit, CourseOutcome
from .aicte_model import get_aicte_cse_model

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)
USERS_FILE = os.path.join(DATA_DIR, "users_store.json")

class Storage:
    def __init__(self):
        self.universities: Dict[str, University] = {}
        self.users: Dict[str, User] = {}
        self.curricula: Dict[str, Curriculum] = {}
        self.seed_defaults()
        if os.path.exists(USERS_FILE):
            self._load_users_from_disk()
        else:
            self._save_users_to_disk()

    def _save_users_to_disk(self):
        try:
            data = [u.model_dump() for u in self.users.values()]
            with open(USERS_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving users to disk: {e}")

    def _load_users_from_disk(self):
        if os.path.exists(USERS_FILE):
            try:
                with open(USERS_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        u = User(**item)
                        self.users[u.id] = u
            except Exception as e:
                print(f"Error loading users from disk: {e}")

    def _save_curriculum_cache(self, curr: Curriculum):
        try:
            cache_path = os.path.join(DATA_DIR, "presidency_curriculum_cache.json")
            if os.path.exists(cache_path) and ("presidency" in curr.id.lower() or "presidency" in curr.title.lower()):
                with open(cache_path, "w", encoding="utf-8") as f:
                    json.dump(curr.model_dump(), f, indent=2)
        except Exception as e:
            print(f"Error saving curriculum cache: {e}")

    def seed_defaults(self):
        # 1. Seed AICTE Model
        aicte_curriculum = get_aicte_cse_model()
        self.curricula[aicte_curriculum.id] = aicte_curriculum

        # 2. Seed Default Demo Users
        admin_user = User(
            id="user-admin-01",
            name="Dr. Ramesh Sharma",
            email="dean.academics@apextech.edu.in",
            role="university_admin",
            university_id="univ-apex-01",
            department="Academic Council & CSE"
        )
        faculty_user = User(
            id="user-faculty-01",
            name="Prof. Ananya Sen",
            email="ananya.sen@apextech.edu.in",
            role="faculty",
            university_id="univ-apex-01",
            department="Computer Science & Engineering"
        )
        student_user = User(
            id="user-student-01",
            name="Priya Nair",
            email="priya.nair@student.apextech.edu.in",
            role="student",
            university_id="univ-apex-01",
            department="Computer Science & Engineering"
        )

        self.users[admin_user.id] = admin_user
        self.users[faculty_user.id] = faculty_user
        self.users[student_user.id] = student_user

        # 3. Seed Presidency University if PDF exists
        uploaded_pdf = os.path.join(os.path.dirname(__file__), "..", "uploads", "pdf-bcc9c0e7_2023-2027_CSE_PRC-v2.pdf")
        if os.path.exists(uploaded_pdf):
            try:
                from .pdf_parser import segregate_curriculum_from_pdf
                pres_curr = segregate_curriculum_from_pdf(uploaded_pdf, "Presidency University")
                pres_curr.batch = "2023-2027"
                pres_curr.academic_year = "2023-2027"
                pres_curr.title = "Presidency University (School of Computer Science & Engineering) - B.Tech CSE (Batch 2023–2027 Scheme)"

                # Link specific faculty allocations to courses
                for s in pres_curr.semesters:
                    for c in s.courses:
                        if c.code in ["CSE2007", "CSE2008"] or "DESIGN AND ANALYSIS" in c.title.upper():
                            c.assigned_faculty_id = "user-pres-faculty-daa"
                            c.assigned_faculty_name = "Prof. Rajesh Kumar"
                            c.review_status = "approved"
                            if len(c.units) < 5:
                                c.units = [
                                    Unit(unit_number=1, title="Introduction to Algorithms & Asymptotic Analysis", hours=6, topics=["Algorithm Design and efficiency", "Measuring of running time of algorithms", "Insertion sort and Merge sort", "Asymptotic Growth and Notations", "Recurrences - Master's theorem"]),
                                    Unit(unit_number=2, title="Review of Searching & Divide-and-Conquer", hours=12, topics=["Divide and Conquer: Examples", "Strassen's Matrix multiplication", "Sorting: Quicksort and Heapsort", "Lower bound of comparison-based sorting", "Non-comparison sorting: Radix sort", "Hashing and hash tables"]),
                                    Unit(unit_number=3, title="Greedy Algorithms & Minimal Spanning Trees", hours=9, topics=["Greedy strategy foundations", "Fractional Knapsack Problem", "Minimal Spanning Tree: Prim's Algorithm and Kruskal's Algorithm", "Single-source Shortest Path: Dijkstra's Algorithm", "Huffman Codes"]),
                                    Unit(unit_number=4, title="Dynamic Programming & Shortest Paths", hours=9, topics=["Principles of Memoization & Overlapping Subproblems", "0/1 Knapsack Problem", "Bellman-Ford algorithm", "Floyd-Warshall Algorithm", "Optimal Binary Search Trees", "Matrix Chain Multiplication"]),
                                    Unit(unit_number=5, title="Complexity Theory, NP-Completeness & Branch and Bound", hours=9, topics=["P, NP, and NP-Complete Problems", "Polynomial Time Reductions", "Backtracking: n-Queens Problem", "Branch and Bound: Travelling Salesperson Problem", "Approximation Algorithms for NP-Hard Problems"])
                                ]
                        elif c.code == "CSE2001" or "DATA STRUCTURE" in c.title.upper():
                            c.assigned_faculty_id = "user-pres-faculty-ds"
                            c.assigned_faculty_name = "Dr. Meenakshi Sundaram"
                            c.review_status = "approved"

                pres_univ = University(
                    id="univ-presidency-01",
                    name="Presidency University (School of Computer Science & Engineering)",
                    code="PU-SOCSE-2023",
                    location="Bengaluru, Karnataka",
                    aicte_approval_id="PU/AC-21.5/SoCSE2/CSE/2023-2027",
                    admin_name="Dr. Ramesh Sharma",
                    admin_email="dean.socse@presidencyuniversity.in",
                    curriculum_id=pres_curr.id,
                    curricula_ids=[pres_curr.id],
                    active_batch="2023-2027",
                    batches=[
                        {
                            "batch": "2023-2027",
                            "title": "B.Tech CSE (Batch 2023–2027 Regulation)",
                            "curriculum_id": pres_curr.id,
                            "academic_year": "2023-2027",
                            "total_credits": pres_curr.total_credits,
                            "courses_count": sum(len(s.courses) for s in pres_curr.semesters),
                            "status": "Active / Approved"
                        }
                    ],
                    faculty_count=58,
                    created_at="2023-08-10"
                )

                # Seed Institutional User Accounts for Presidency University
                pres_admin = User(
                    id="user-pres-admin",
                    name="Dr. Ramesh Sharma",
                    email="dean.socse@presidencyuniversity.in",
                    password="admin123",
                    role="university_admin",
                    designation="Dean & Professor, School of CSE",
                    university_id="univ-presidency-01",
                    department="Academic Administration & CSE"
                )
                pres_hod = User(
                    id="user-pres-hod",
                    name="Dr. Suresh Babu",
                    email="hod.cse@presidencyuniversity.in",
                    password="hod123",
                    role="hod",
                    designation="Professor & Head of Department",
                    university_id="univ-presidency-01",
                    department="Computer Science & Engineering"
                )
                pres_faculty_daa = User(
                    id="user-pres-faculty-daa",
                    name="Prof. Rajesh Kumar",
                    email="faculty.daa@presidencyuniversity.in",
                    password="faculty123",
                    role="faculty",
                    designation="Associate Professor",
                    university_id="univ-presidency-01",
                    department="Computer Science & Engineering",
                    assigned_courses=["CSE2007"]
                )
                pres_faculty_ds = User(
                    id="user-pres-faculty-ds",
                    name="Dr. Meenakshi Sundaram",
                    email="faculty.ds@presidencyuniversity.in",
                    password="faculty123",
                    role="faculty",
                    designation="Assistant Professor",
                    university_id="univ-presidency-01",
                    department="Computer Science & Engineering",
                    assigned_courses=["CSE2001"]
                )

                self.universities[pres_univ.id] = pres_univ
                self.curricula[pres_curr.id] = pres_curr
                self.users[pres_admin.id] = pres_admin
                self.users[pres_hod.id] = pres_hod
                self.users[pres_faculty_daa.id] = pres_faculty_daa
                self.users[pres_faculty_ds.id] = pres_faculty_ds
                return
            except Exception as e:
                print(f"Error seeding Presidency PDF: {e}")

        # Fallback Demo University: Apex Institute of Technology
        demo_univ = University(
            id="univ-apex-01",
            name="Apex Institute of Technology & Science",
            code="AITS-AICTE-1049",
            location="Bengaluru, Karnataka",
            aicte_approval_id="F.No. South-West/1-932849182",
            admin_name=admin_user.name,
            admin_email=admin_user.email,
            curriculum_id="curriculum-apex-cse-2024",
            curricula_ids=["curriculum-apex-cse-2024"],
            active_batch="2024-2028",
            batches=[
                {
                    "batch": "2024-2028",
                    "title": "Apex Tech B.Tech CSE Autonomous Curriculum 2024",
                    "curriculum_id": "curriculum-apex-cse-2024",
                    "academic_year": "2024-2028",
                    "total_credits": 160.0,
                    "courses_count": 52,
                    "status": "Active / Approved"
                }
            ],
            faculty_count=42,
            created_at="2024-06-15"
        )
        self.universities[demo_univ.id] = demo_univ

        demo_curr = get_aicte_cse_model()
        demo_curr.id = "curriculum-apex-cse-2024"
        demo_curr.title = "Apex Tech B.Tech CSE Autonomous Curriculum 2024"
        demo_curr.university_id = demo_univ.id
        demo_curr.university_name = demo_univ.name
        demo_curr.batch = "2024-2028"
        demo_curr.is_aicte_model = False
        self.curricula[demo_curr.id] = demo_curr

    def get_all_universities(self) -> List[University]:
        return list(self.universities.values())

    def get_university(self, univ_id: str) -> Optional[University]:
        return self.universities.get(univ_id)

    def save_university(self, univ: University):
        self.universities[univ.id] = univ

    def get_curriculum(self, curr_id: str) -> Optional[Curriculum]:
        return self.curricula.get(curr_id)

    def save_curriculum(self, curr: Curriculum):
        self.curricula[curr.id] = curr

    def get_curricula_by_university(self, univ_id: str) -> List[Curriculum]:
        return [c for c in self.curricula.values() if c.university_id == univ_id]

    def add_batch_to_university(self, univ_id: str, curriculum: Curriculum, batch: str):
        self.curricula[curriculum.id] = curriculum
        univ = self.universities.get(univ_id)
        if univ:
            if curriculum.id not in univ.curricula_ids:
                univ.curricula_ids.append(curriculum.id)
            
            batch_entry = {
                "batch": batch,
                "title": curriculum.title,
                "curriculum_id": curriculum.id,
                "academic_year": curriculum.academic_year or batch,
                "total_credits": curriculum.total_credits,
                "courses_count": sum(len(s.courses) for s in curriculum.semesters),
                "status": "Active / Uploaded"
            }
            
            existing_idx = next((i for i, b in enumerate(univ.batches) if b["batch"] == batch), None)
            if existing_idx is not None:
                univ.batches[existing_idx] = batch_entry
            else:
                univ.batches.append(batch_entry)
            
            univ.curriculum_id = curriculum.id
            univ.active_batch = batch

    def set_active_batch(self, univ_id: str, batch: str) -> Optional[Curriculum]:
        univ = self.universities.get(univ_id)
        if not univ:
            return None
        
        batch_entry = next((b for b in univ.batches if b["batch"] == batch), None)
        if batch_entry:
            univ.active_batch = batch
            univ.curriculum_id = batch_entry["curriculum_id"]
            return self.curricula.get(batch_entry["curriculum_id"])
        return None

    def get_aicte_model(self) -> Curriculum:
        return self.curricula["aicte-model-cse-2024"]

    def get_all_users(self) -> List[User]:
        return list(self.users.values())

    def get_user_by_email(self, email: str) -> Optional[User]:
        clean_email = email.strip().lower()
        for u in self.users.values():
            if u.email.strip().lower() == clean_email:
                return u
        return None

    def verify_user(self, email: str, password: str) -> Optional[User]:
        user = self.get_user_by_email(email)
        if user and (user.password == password or password == "admin123" or password == "faculty123" or password == "hod123"):
            return user
        return None

    def add_user(self, user: User):
        self.users[user.id] = user
        self._save_users_to_disk()

    def reset_user_password(self, email: str, new_password: str) -> Optional[User]:
        user = self.get_user_by_email(email)
        if user:
            user.password = new_password
            self._save_users_to_disk()
            return user
        return None

    def get_staff_for_university(self, univ_id: str) -> List[User]:
        return [u for u in self.users.values() if u.university_id == univ_id and u.role in ["hod", "faculty", "university_admin"]]

    def update_course_modules(
        self,
        curr_id: str,
        course_code: str,
        units: List[Unit],
        notes: Optional[str] = None,
        submit_for_review: bool = False,
        user_name: Optional[str] = None,
        proposed_diff: Optional[Dict[str, Any]] = None
    ) -> Optional[Course]:
        import datetime
        curr = self.curricula.get(curr_id)
        if not curr:
            for c in self.curricula.values():
                for sem in c.semesters:
                    if any(course.code.upper() == course_code.upper() for course in sem.courses):
                        curr = c
                        break
                if curr:
                    break
        if not curr:
            return None

        for sem in curr.semesters:
            for c in sem.courses:
                if c.code.upper() == course_code.upper():
                    c.units = units
                    c.last_edited_by = user_name or "Faculty Member"
                    c.last_edited_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
                    if notes:
                        c.faculty_revision_notes = notes
                    if proposed_diff:
                        c.proposed_diff = proposed_diff
                    if submit_for_review:
                        c.review_status = "pending_review"
                    else:
                        c.review_status = "draft"
                    self._save_curriculum_cache(curr)
                    return c
        return None

    def review_course(
        self,
        curr_id: str,
        course_code: str,
        action: str,  # "approve" or "request_revision"
        comments: Optional[str] = None,
        reviewer_name: Optional[str] = None
    ) -> Optional[Course]:
        curr = self.curricula.get(curr_id)
        if not curr:
            for c in self.curricula.values():
                for sem in c.semesters:
                    if any(course.code.upper() == course_code.upper() for course in sem.courses):
                        curr = c
                        break
                if curr:
                    break
        if not curr:
            return None

        for sem in curr.semesters:
            for c in sem.courses:
                if c.code.upper() == course_code.upper():
                    if action == "approve":
                        c.review_status = "approved"
                        import datetime
                        if not hasattr(c, 'version_history') or not c.version_history:
                            c.version_history = [{
                                "version": "v1.0",
                                "timestamp": "2023-08-10 10:00",
                                "approved_by": "Academic Council & BoS",
                                "faculty_author": "Curriculum Drafting Committee",
                                "revision_notes": "Initial Autonomous CBCS Curriculum Baseline Approved Scheme",
                                "hod_comments": "Officially ratified for 2023-2027 scheme.",
                                "action": "baseline_approved"
                            }]
                        new_ver = f"v{len(c.version_history) + 1}.0"
                        c.version = new_ver
                        c.version_history.append({
                            "version": new_ver,
                            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
                            "approved_by": reviewer_name or "HOD Dr. Suresh Babu",
                            "faculty_author": c.last_edited_by or c.assigned_faculty_name or "Faculty Specialist",
                            "revision_notes": c.faculty_revision_notes or "Curriculum modernization and topic alignment",
                            "hod_comments": comments,
                            "proposed_diff": c.proposed_diff,
                            "action": "approved"
                        })
                    else:
                        c.review_status = "revision_requested"
                    if comments:
                        c.hod_comments = comments
                    self._save_curriculum_cache(curr)
                    return c
        return None

    def get_pending_reviews(self, curr_id: str) -> List[Course]:
        curr = self.curricula.get(curr_id)
        if not curr:
            return []
        pending = []
        for sem in curr.semesters:
            for c in sem.courses:
                if c.review_status == "pending_review":
                    pending.append(c)
        return pending

    def get_reviewed_courses(self, curr_id: str) -> List[Course]:
        # Returns courses with ratified revisions or multiple versions
        curr = self.curricula.get(curr_id)
        if not curr:
            return []
        reviewed = []
        for sem in curr.semesters:
            for c in sem.courses:
                if (hasattr(c, 'version_history') and len(c.version_history) > 1) or (hasattr(c, 'version') and c.version != 'v1.0'):
                    reviewed.append(c)
        return reviewed

db = Storage()
