"""
Generates an authentic multi-page University Syllabus PDF for testing extraction & segregation.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
SAMPLE_PDF_PATH = os.path.join(UPLOAD_DIR, "Apex_University_CSE_Curriculum.pdf")

def create_sample_syllabus_pdf():
    doc = SimpleDocTemplate(
        SAMPLE_PDF_PATH,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1E3A8A'),
        alignment=1, # Center
        spaceAfter=10
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#475569'),
        alignment=1,
        spaceAfter=20
    )
    sem_heading = ParagraphStyle(
        'SemHeading',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=14,
        spaceAfter=8
    )
    course_heading = ParagraphStyle(
        'CourseHeading',
        parent=styles['Heading3'],
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#1E3A8A'),
        spaceBefore=8,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#334155')
    )
    bold_body = ParagraphStyle(
        'BoldBody',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    story = []

    # Cover Title
    story.append(Paragraph("APEX INSTITUTE OF TECHNOLOGY & SCIENCE (AUTONOMOUS)", title_style))
    story.append(Paragraph("Department of Computer Science & Engineering<br/>Curriculum & Detailed Syllabi (Regulations 2024 - AICTE Model Framework)", subtitle_style))
    story.append(Spacer(1, 15))

    # Semester 3
    story.append(Paragraph("SEMESTER III", sem_heading))
    story.append(Spacer(1, 5))

    # Course 1: PCC-CS301
    story.append(Paragraph("Course Code: PCC-CS301 : Data Structures and Algorithms", course_heading))
    story.append(Paragraph("<b>Credits: 4.0</b> (L: 3, T: 1, P: 0) | Category: Professional Core", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Course Outcomes:</b>", bold_body))
    story.append(Paragraph("CO1: Understand time and space complexity tradeoffs for linear and non-linear data structures.", body_style))
    story.append(Paragraph("CO2: Implement binary search trees, AVL trees and priority queues for fast retrieval.", body_style))
    story.append(Paragraph("CO3: Analyze graph traversal techniques (BFS, DFS) and shortest path algorithms.", body_style))
    story.append(Paragraph("CO4: Design efficient dynamic memory structures and hash collision resolution systems.", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Syllabus Units:</b>", bold_body))
    story.append(Paragraph("<b>UNIT I: Linear Data Structures (8 Hours)</b> - Arrays, Stacks, Queues, Linked Lists, Circular Lists, Infix to Postfix conversion.", body_style))
    story.append(Paragraph("<b>UNIT II: Trees and Search Structures (9 Hours)</b> - Binary Trees, Binary Search Trees, AVL Trees, B-Trees, Traversals and balancing.", body_style))
    story.append(Paragraph("<b>UNIT III: Graph Algorithms (9 Hours)</b> - Adjacency matrix, Breadth First Search, Depth First Search, Dijkstra's algorithm, Minimum Spanning Trees.", body_style))
    story.append(Paragraph("<b>UNIT IV: Sorting and Hashing (8 Hours)</b> - Merge Sort, Quick Sort, Heap Sort, Hash tables, Open addressing, Chaining strategies.", body_style))
    story.append(Paragraph("<b>TEXT BOOKS:</b> 1. Thomas H. Cormen, Introduction to Algorithms, MIT Press. 2. Mark Allen Weiss, Data Structures & Algorithm Analysis.", body_style))
    story.append(Spacer(1, 12))

    # Course 2: PCC-CS302
    story.append(Paragraph("Course Code: PCC-CS302 : Database Management Systems", course_heading))
    story.append(Paragraph("<b>Credits: 4.0</b> (L: 3, T: 1, P: 0) | Category: Professional Core", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Course Outcomes:</b>", bold_body))
    story.append(Paragraph("CO1: Formulate entity relationship models and relational schema mappings.", body_style))
    story.append(Paragraph("CO2: Apply relational calculus, algebra and complex SQL queries with joins and subqueries.", body_style))
    story.append(Paragraph("CO3: Analyze schema normalization up to BCNF eliminating anomalies.", body_style))
    story.append(Paragraph("CO4: Evaluate transaction ACID properties, concurrency control and serializability.", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Syllabus Units:</b>", bold_body))
    story.append(Paragraph("<b>UNIT I: Database Architecture & ER Model (8 Hours)</b> - File systems vs DBMS, Data models, ER diagrams, Constraints.", body_style))
    story.append(Paragraph("<b>UNIT II: Relational Algebra & SQL (9 Hours)</b> - Selection, Projection, Joins, DDL, DML, Nested queries, Views, Stored procedures.", body_style))
    story.append(Paragraph("<b>UNIT III: Normalization Theory (8 Hours)</b> - Functional dependencies, 1NF, 2NF, 3NF, Boyce-Codd Normal Form, Multivalued dependencies.", body_style))
    story.append(Paragraph("<b>UNIT IV: Transaction Management (8 Hours)</b> - Concurrency control, Two-phase locking (2PL), Deadlock handling, Write-Ahead Logging.", body_style))
    story.append(Paragraph("<b>TEXT BOOKS:</b> 1. Abraham Silberschatz, Database System Concepts, McGraw Hill. 2. Raghu Ramakrishnan, Database Management Systems.", body_style))
    story.append(Spacer(1, 15))

    # Semester 4
    story.append(Paragraph("SEMESTER IV", sem_heading))
    story.append(Spacer(1, 5))

    # Course 3: PCC-CS401
    story.append(Paragraph("Course Code: PCC-CS401 : Operating Systems", course_heading))
    story.append(Paragraph("<b>Credits: 4.0</b> (L: 3, T: 1, P: 0) | Category: Professional Core", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Course Outcomes:</b>", bold_body))
    story.append(Paragraph("CO1: Understand operating system process scheduling and system call mechanisms.", body_style))
    story.append(Paragraph("CO2: Implement concurrency control and synchronization using semaphores and mutexes.", body_style))
    story.append(Paragraph("CO3: Analyze virtual memory paging, segmentation and replacement heuristics.", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Syllabus Units:</b>", bold_body))
    story.append(Paragraph("<b>UNIT I: Process Management (9 Hours)</b> - Process states, Process Control Block, Context switching, CPU scheduling algorithms.", body_style))
    story.append(Paragraph("<b>UNIT II: Synchronization & Deadlocks (9 Hours)</b> - Critical section, Semaphores, Dining Philosophers, Banker's algorithm.", body_style))
    story.append(Paragraph("<b>UNIT III: Memory Management (8 Hours)</b> - Paging, Inverted page tables, Demand paging, Page faults, LRU replacement, Thrashing.", body_style))
    story.append(Paragraph("<b>UNIT IV: Storage & File Systems (8 Hours)</b> - Directory structures, Disk scheduling algorithms (SCAN, C-SCAN), Inodes.", body_style))
    story.append(Paragraph("<b>TEXT BOOKS:</b> 1. Silberschatz & Galvin, Operating System Concepts, Wiley. 2. Andrew Tanenbaum, Modern Operating Systems.", body_style))
    story.append(Spacer(1, 15))

    # Semester 5
    story.append(Paragraph("SEMESTER V", sem_heading))
    story.append(Spacer(1, 5))

    # Course 4: PCC-CS501
    story.append(Paragraph("Course Code: PCC-CS501 : Artificial Intelligence & Machine Learning", course_heading))
    story.append(Paragraph("<b>Credits: 4.0</b> (L: 3, T: 1, P: 0) | Category: Professional Core", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Course Outcomes:</b>", bold_body))
    story.append(Paragraph("CO1: Apply search algorithms (A*, Minimax) for intelligent problem solving.", body_style))
    story.append(Paragraph("CO2: Implement supervised classification using Decision Trees, SVM and Random Forests.", body_style))
    story.append(Paragraph("CO3: Analyze neural network backpropagation and gradient descent optimization.", body_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Syllabus Units:</b>", bold_body))
    story.append(Paragraph("<b>UNIT I: Search & Intelligent Agents (8 Hours)</b> - Uninformed & informed search, Heuristic design, A* algorithm, Alpha-beta pruning.", body_style))
    story.append(Paragraph("<b>UNIT II: Supervised Learning (9 Hours)</b> - Linear regression, Logistic classification, Decision Trees, Support Vector Machines.", body_style))
    story.append(Paragraph("<b>UNIT III: Neural Networks & Deep Learning (9 Hours)</b> - Multi-layer perceptron, Backpropagation, Activation functions, Regularization.", body_style))
    story.append(Paragraph("<b>TEXT BOOKS:</b> 1. Stuart Russell and Peter Norvig, AI: A Modern Approach. 2. Tom Mitchell, Machine Learning.", body_style))

    doc.build(story)
    print(f"Sample PDF created at: {SAMPLE_PDF_PATH}")
    return SAMPLE_PDF_PATH

if __name__ == "__main__":
    create_sample_syllabus_pdf()
