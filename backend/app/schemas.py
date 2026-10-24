from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class User(BaseModel):
    id: str
    name: str
    email: str
    password: Optional[str] = "password123"
    role: str  # "university_admin", "hod", "faculty", "student"
    designation: Optional[str] = "Faculty"
    university_id: Optional[str] = None
    department: Optional[str] = "Computer Science & Engineering"
    assigned_courses: List[str] = Field(default_factory=list)

class Unit(BaseModel):
    unit_number: int
    title: str
    hours: int = 8
    topics: List[str]

class CourseOutcome(BaseModel):
    code: str  # e.g., "CO1"
    description: str
    bloom_level: str = "Understand"  # Remember, Understand, Apply, Analyze, Evaluate, Create
    target_score: Optional[float] = 75.0

class Course(BaseModel):
    code: str
    title: str
    category: str  # BSC, ESC, HSMC, PCC, PEC, OEC, PROJ, MC
    credits: float = 3.0
    lecture_hours: int = 3
    tutorial_hours: int = 0
    practical_hours: int = 0
    semester: int
    prerequisites: Optional[str] = "None"
    description: Optional[str] = ""
    units: List[Unit] = Field(default_factory=list)
    course_outcomes: List[CourseOutcome] = Field(default_factory=list)
    textbooks: List[str] = Field(default_factory=list)
    reference_books: List[str] = Field(default_factory=list)
    is_aicte_core: bool = True
    assigned_faculty_id: Optional[str] = None
    assigned_faculty_name: Optional[str] = None
    review_status: str = "approved"  # "draft", "pending_review", "approved", "revision_requested"
    hod_comments: Optional[str] = None
    faculty_revision_notes: Optional[str] = None
    last_edited_by: Optional[str] = None
    last_edited_at: Optional[str] = None
    proposed_diff: Optional[Dict[str, Any]] = None
    version: Optional[str] = "v1.0"
    version_history: List[Dict[str, Any]] = Field(default_factory=list)

class Semester(BaseModel):
    semester_number: int
    courses: List[Course] = Field(default_factory=list)
    total_credits: float = 0.0

class Curriculum(BaseModel):
    id: str
    title: str
    degree: str = "B.Tech"
    department: str = "Computer Science & Engineering"
    regulation: str = "NEP 2020 / AICTE Model"
    academic_year: str = "2024-2025"
    batch: Optional[str] = "2023-2027"
    university_id: Optional[str] = None
    university_name: Optional[str] = None
    is_aicte_model: bool = False
    total_credits: float = 160.0
    semesters: List[Semester] = Field(default_factory=list)

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterUniversityRequest(BaseModel):
    name: str
    code: str
    location: str
    aicte_approval_id: str
    admin_name: str
    admin_email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str
    new_password: str

class VerifyEmailRequest(BaseModel):
    email: str

class RegisterUserRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "faculty"
    designation: Optional[str] = "Assistant Professor"
    department: Optional[str] = "Computer Science & Engineering"
    university_id: Optional[str] = "univ-presidency-01"

class AddStaffRequest(BaseModel):
    name: str
    email: str
    password: str = "staff123"
    role: str  # "hod" or "faculty"
    designation: str
    department: str = "Computer Science & Engineering"
    assigned_course_code: Optional[str] = None

class AssignCourseRequest(BaseModel):
    user_id: str
    course_code: str
    curriculum_id: Optional[str] = None

class UpdateModuleRequest(BaseModel):
    curriculum_id: str
    course_code: str
    units: List[Unit]
    faculty_revision_notes: Optional[str] = None
    submit_for_review: bool = False
    proposed_diff: Optional[Dict[str, Any]] = None

class ReviewCourseRequest(BaseModel):
    curriculum_id: str
    course_code: str
    action: str  # "approve" or "request_revision"
    comments: Optional[str] = None

class University(BaseModel):
    id: str
    name: str
    code: str
    location: str
    aicte_approval_id: str
    admin_name: str
    admin_email: str
    curriculum_id: Optional[str] = None
    curricula_ids: List[str] = Field(default_factory=list)
    active_batch: Optional[str] = "2023-2027"
    batches: List[Dict[str, Any]] = Field(default_factory=list)
    faculty_count: int = 0
    created_at: Optional[str] = None

class GapAnalysisResult(BaseModel):
    compliance_score: float
    total_credits: float
    aicte_target_credits: float = 160.0
    autonomy_delta_percent: float
    credit_distribution: Dict[str, float]
    nep_compliant: bool
    missing_industry_skills: List[Dict[str, Any]]
    obsolete_topics_detected: List[Dict[str, Any]]
    recommendations: List[str]

class BloomAuditResult(BaseModel):
    course_code: str
    course_title: str
    distribution: Dict[str, int]
    balance_rating: str  # Excellent, Moderate, Skewed Low-Order
    feedback: List[str]
