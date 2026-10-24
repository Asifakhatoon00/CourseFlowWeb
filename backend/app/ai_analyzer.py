"""
AI/ML Intelligence Suite for CourseFlow
1. Semantic Content-Based Alignment & Symmetry Engine (Matches by Content & Topics, NOT Course Code or Title)
2. Bloom's Taxonomy & OBE Validator
3. Industry Skill-Gap Analyzer & Modern Tech Trend Miner
4. NEP 2020 Credit Framework & Autonomy Compliance Checker
"""

import re
import math
from typing import List, Dict, Any, Tuple
from .schemas import Curriculum, Course, GapAnalysisResult, BloomAuditResult

# Bloom's Taxonomy Action Verbs
BLOOM_VERBS = {
    "Remember": [
        "define", "list", "recall", "state", "identify", "name", "recognize",
        "repeat", "reproduce", "label", "memorize", "quote", "tabulate"
    ],
    "Understand": [
        "explain", "describe", "comprehend", "summarize", "interpret", "classify",
        "discuss", "illustrate", "paraphrase", "translate", "extrapolate", "review"
    ],
    "Apply": [
        "apply", "implement", "solve", "execute", "calculate", "demonstrate",
        "modify", "operate", "use", "compute", "employ", "simulate", "utilize"
    ],
    "Analyze": [
        "analyze", "differentiate", "compare", "contrast", "investigate",
        "categorize", "examine", "decompose", "distinguish", "critique", "test", "audit"
    ],
    "Evaluate": [
        "evaluate", "assess", "judge", "appraise", "rate", "prioritize",
        "validate", "defend", "justify", "measure", "verify", "benchmark"
    ],
    "Create": [
        "design", "develop", "formulate", "construct", "synthesize", "build",
        "invent", "compose", "devise", "integrate", "engineer", "author"
    ]
}

INDUSTRY_TECH_RADAR = [
    {
        "category": "Generative AI & LLMs",
        "keywords": ["transformer", "large language model", "llm", "rag", "retrieval-augmented", "vector database", "prompt engineering", "langchain", "fine-tuning", "bert", "gpt", "generative ai"],
        "importance": "Critical (Highest Demand)",
        "recommendation": "Integrate hands-on units covering Transformers, RAG architectures, and Vector Embeddings in Semester 6/7."
    },
    {
        "category": "Cloud-Native & Container Orchestration",
        "keywords": ["kubernetes", "docker", "microservices", "ci/cd", "devops", "cloud native", "serverless", "aws", "gcp", "azure", "helm", "terraform"],
        "importance": "High (Core Industry Skill)",
        "recommendation": "Include containerization (Docker) and Kubernetes orchestration in Operating Systems or Web Tech laboratories."
    },
    {
        "category": "Zero-Trust Cybersecurity & DevSecOps",
        "keywords": ["zero trust", "devsecops", "threat modeling", "siem", "identity and access management", "iam", "pki", "elliptic curve", "ransomware", "penetration testing"],
        "importance": "High (Essential Defense)",
        "recommendation": "Expand Cryptography & Network Security to include Zero Trust Architecture and practical DevSecOps."
    },
    {
        "category": "Modern Full-Stack & API Ecosystems",
        "keywords": ["react", "next.js", "graphql", "restful api", "websockets", "orm", "prisma", "typescript", "fastapi", "node.js"],
        "importance": "Medium-High (Employability Focus)",
        "recommendation": "Update Web Technology electives to cover React/Next.js and modern asynchronous backend APIs."
    },
    {
        "category": "MLOps & Data Pipeline Engineering",
        "keywords": ["mlops", "data pipeline", "feature store", "model monitoring", "airflow", "kafka", "spark", "dvc", "data engineering"],
        "importance": "High (Data Engineering)",
        "recommendation": "Introduce MLOps lifecycle concepts (model tracking, drift detection, data versioning)."
    },
    {
        "category": "Green Computing & Sustainable Tech",
        "keywords": ["green computing", "carbon footprint", "energy-efficient algorithms", "pue", "sustainable engineering", "circular tech"],
        "importance": "Emerging (AICTE / NEP Mandate)",
        "recommendation": "Adopt AICTE Open Elective on Sustainable Green IT and energy-aware server operations."
    },
    {
        "category": "Quantum Computing Fundamentals",
        "keywords": ["quantum computing", "qubit", "superposition", "entanglement", "quantum circuits", "grover", "shor", "post-quantum"],
        "importance": "Future-Proofing",
        "recommendation": "Offer interdisciplinary Open Elective on Quantum Computing and Post-Quantum Cryptography."
    }
]

OBSOLETE_TECH_DATABASE = [
    {
        "tech": "Turbo C++ / Borland Graphics (BGI)",
        "keywords": ["turbo c", "graphics.h", "conio.h", "borland"],
        "modern_replacement": "Modern standard C++ (C++20/23), GCC/Clang, OpenGL or SDL"
    },
    {
        "tech": "Java Applets / AWT / Macromedia Flash",
        "keywords": ["applet", "java applets", "macromedia flash", "actionscript"],
        "modern_replacement": "HTML5 Canvas, WebGL, Modern React/Vue UI frameworks"
    },
    {
        "tech": "Visual Basic 6.0 / ASP Classic",
        "keywords": ["visual basic 6", "vb6", "asp classic"],
        "modern_replacement": "C# .NET Core, TypeScript, Python FastAPI / Django"
    },
    {
        "tech": "CORBA / SOAP Web Services Exclusive Focus",
        "keywords": ["corba", "dcom", "soap exclusive"],
        "modern_replacement": "REST APIs, gRPC, Protocol Buffers, GraphQL"
    }
]

STOPWORDS = {
    "a", "an", "the", "and", "or", "in", "of", "to", "for", "with", "on", "at",
    "by", "from", "up", "about", "into", "over", "after", "is", "are", "was",
    "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "course", "module", "unit", "introduction", "fundamentals", "basics", "using",
    "study", "overview", "concepts", "system", "systems", "applications", "applied"
}

def extract_content_tokens(course: Course) -> List[str]:
    """Extracts meaningful semantic content tokens from a course's units, topics, and outcomes."""
    texts = [course.title, course.description or ""]
    for u in course.units:
        texts.append(u.title)
        texts.extend(u.topics)
    for co in course.course_outcomes:
        texts.append(co.description)

    combined = " ".join(texts).lower()
    cleaned = re.sub(r'[^a-z0-9\s]', ' ', combined)
    tokens = [w for w in cleaned.split() if len(w) > 2 and w not in STOPWORDS]
    return tokens

def compute_semantic_similarity(tokens1: List[str], tokens2: List[str]) -> Tuple[float, List[str]]:
    """
    Computes cosine-like Jaccard/Dice topical similarity between two courses based strictly on content/topics,
    and returns shared symmetric concepts.
    """
    set1 = set(tokens1)
    set2 = set(tokens2)
    if not set1 or not set2:
        return 0.0, []

    common = set1.intersection(set2)
    similarity = (2.0 * len(common)) / (len(set1) + len(set2))
    
    # Scale to realistic 0-100 percentage
    score = round(min(99.0, max(15.0, similarity * 180.0)), 1)
    
    # Meaningful shared concepts
    shared_topics = sorted(list(common), key=lambda w: len(w), reverse=True)[:6]
    return score, shared_topics

def perform_semantic_content_alignment(curriculum: Curriculum, aicte_model: Curriculum) -> List[Dict[str, Any]]:
    """
    Core Content-Based Alignment Engine:
    For every course in the University curriculum, scans ALL courses in the AICTE model
    by TOPICAL CONTENT (not course codes or course names!).
    Discovers true academic symmetry.
    """
    alignment_results = []
    
    # Flatten all AICTE model courses
    aicte_courses = []
    for sem in aicte_model.semesters:
        for c in sem.courses:
            tokens = extract_content_tokens(c)
            aicte_courses.append((c, tokens))

    for sem in curriculum.semesters:
        for univ_course in sem.courses:
            univ_tokens = extract_content_tokens(univ_course)
            best_match = None
            best_score = 0.0
            best_shared = []

            for aicte_c, aicte_tokens in aicte_courses:
                score, shared = compute_semantic_similarity(univ_tokens, aicte_tokens)
                if score > best_score:
                    best_score = score
                    best_match = aicte_c
                    best_shared = shared

            if best_match:
                status_label = "High Symmetry (Direct Alignment)" if best_score >= 70 else "Partial Symmetry (Autonomous Adaption)" if best_score >= 45 else "Autonomous Elective"
                
                alignment_results.append({
                    "university_course_code": univ_course.code,
                    "university_course_title": univ_course.title,
                    "university_semester": univ_course.semester,
                    "university_credits": univ_course.credits,
                    "aicte_matched_code": best_match.code,
                    "aicte_matched_title": best_match.title,
                    "aicte_matched_semester": best_match.semester,
                    "symmetry_score": best_score,
                    "status": status_label,
                    "shared_core_topics": best_shared,
                    "university_modules_count": len(univ_course.units),
                    "aicte_modules_count": len(best_match.units)
                })

    return alignment_results

def classify_bloom_level(text: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z\s]', ' ', text.lower())
    words = cleaned.split()
    for level in ["Create", "Evaluate", "Analyze", "Apply", "Understand", "Remember"]:
        verbs = BLOOM_VERBS[level]
        for verb in verbs:
            if verb in words:
                return level
            for w in words[:4]:
                if w.startswith(verb[:4]):
                    return level
    return "Understand"

def audit_course_bloom(course: Course) -> BloomAuditResult:
    distribution = {
        "Remember": 0, "Understand": 0, "Apply": 0, "Analyze": 0, "Evaluate": 0, "Create": 0
    }
    for co in course.course_outcomes:
        detected_level = classify_bloom_level(co.description)
        distribution[detected_level] += 1

    total = sum(distribution.values())
    if total == 0:
        return BloomAuditResult(
            course_code=course.code,
            course_title=course.title,
            distribution=distribution,
            balance_rating="Needs Outcomes",
            feedback=["Please define Course Outcomes (CO1 to CO5)."]
        )

    high_order = distribution["Evaluate"] + distribution["Create"] + distribution["Analyze"]
    high_order_pct = (high_order / total) * 100

    if high_order_pct >= 40:
        balance_rating = "Excellent (OBE High-Rigor)"
        feedback = ["Syllabus satisfies NBA & AICTE Tier-1 OBE accreditation standards (Higher-order thinking)."]
    elif distribution["Remember"] + distribution["Understand"] >= (total * 0.65):
        balance_rating = "Skewed to Lower-Order Cognitive Levels"
        feedback = ["Over 65% of outcomes rely on Recall and Basic Understanding. Suggest elevating action verbs to 'Design' and 'Analyze'."]
    else:
        balance_rating = "Moderate Balance"
        feedback = ["Good balanced foundation. Adding an analytical project outcome will optimize OBE mapping."]

    return BloomAuditResult(
        course_code=course.code,
        course_title=course.title,
        distribution=distribution,
        balance_rating=balance_rating,
        feedback=feedback
    )

def perform_gap_analysis(curriculum: Curriculum, aicte_model: Curriculum) -> GapAnalysisResult:
    category_credits: Dict[str, float] = {
        "BSC": 0.0, "ESC": 0.0, "HSMC": 0.0, "PCC": 0.0, "PEC": 0.0, "OEC": 0.0, "PROJ": 0.0, "MC": 0.0
    }

    all_course_text = []
    for sem in curriculum.semesters:
        for c in sem.courses:
            cat = c.category.upper() if c.category else "PCC"
            if cat not in category_credits:
                category_credits[cat] = 0.0
            category_credits[cat] += c.credits

            unit_topics = " ".join([" ".join(u.topics) for u in c.units])
            co_topics = " ".join([co.description for co in c.course_outcomes])
            all_course_text.append(f"{c.title} {c.description} {unit_topics} {co_topics}".lower())

    corpus = " ".join(all_course_text)
    total_credits = sum(category_credits.values())

    missing_skills = []
    for skill_info in INDUSTRY_TECH_RADAR:
        matched = False
        for kw in skill_info["keywords"]:
            if re.search(r'\b' + re.escape(kw) + r'\b', corpus):
                matched = True
                break
        if not matched:
            missing_skills.append({
                "category": skill_info["category"],
                "importance": skill_info["importance"],
                "recommendation": skill_info["recommendation"]
            })

    obsolete_detected = []
    for obs in OBSOLETE_TECH_DATABASE:
        for kw in obs["keywords"]:
            if re.search(r'\b' + re.escape(kw) + r'\b', corpus):
                obsolete_detected.append({
                    "technology": obs["tech"],
                    "keyword_found": kw,
                    "modern_replacement": obs["modern_replacement"]
                })
                break

    nep_compliant = (
        140.0 <= total_credits <= 170.0 and
        category_credits.get("BSC", 0) >= 15 and
        category_credits.get("ESC", 0) >= 12 and
        category_credits.get("PCC", 0) >= 40
    )

    # Compute overall alignment based on semantic matches
    semantic_matches = perform_semantic_content_alignment(curriculum, aicte_model)
    avg_symmetry = sum(m["symmetry_score"] for m in semantic_matches) / len(semantic_matches) if semantic_matches else 75.0
    
    compliance_score = round(min(98.0, max(50.0, avg_symmetry * 0.95 - len(obsolete_detected) * 4.0)), 1)
    autonomy_delta = round(max(0.0, 100.0 - compliance_score), 1)

    recommendations = []
    if total_credits < 155:
        recommendations.append(f"Total credits ({total_credits}) are slightly below AICTE target (160). Add 1 Professional Elective or Skill Lab.")
    elif total_credits > 165:
        recommendations.append(f"Total credits ({total_credits}) exceed 165. Optimize contact hours to prevent student cognitive overload.")

    for obs in obsolete_detected:
        recommendations.append(f"Modernize '{obs['technology']}': Replace with {obs['modern_replacement']}.")

    for ms in missing_skills[:2]:
        recommendations.append(f"Incorporate emerging module in {ms['category']}: {ms['recommendation']}")

    return GapAnalysisResult(
        compliance_score=compliance_score,
        total_credits=total_credits,
        aicte_target_credits=160.0,
        autonomy_delta_percent=autonomy_delta,
        credit_distribution=category_credits,
        nep_compliant=nep_compliant,
        missing_industry_skills=missing_skills,
        obsolete_topics_detected=obsolete_detected,
        recommendations=recommendations
    )

def get_course_ai_suggestions(course: Course) -> Dict[str, Any]:
    """Generates intelligent curriculum suggestions for faculty module editing."""
    title_lower = course.title.lower()
    code_upper = course.code.upper()

    obsolete_findings = []
    modern_additions = []
    target_module = 4
    bloom_level = "Level 4 (Analyze)"
    bloom_guidance = "Elevate module assessments to analytical comparisons of trade-offs, amortized complexity, and real-world system constraints."

    # Domain 1: Data Structures specifically (CSE2001 / DS / DSA)
    if "data structure" in title_lower or code_upper in ["CSE2001", "CS201", "DS"]:
        target_module = 4
        bloom_level = "Level 4 (Analyze)"
        bloom_guidance = "Challenge students to analyze memory footprint, cache line performance, and worst-case vs amortized runtimes across tree and graph variants."
        obsolete_findings.append({
            "topic": "Elementary Bubble Sort & Selection Sort Proofs in Advanced Data Structures",
            "warning": "Introductory O(n²) sorting is covered in primary programming; it should not consume core contact hours.",
            "reason": "Introductory quadratic sorting is covered in basic programming; core hours should focus on advanced trees and hashing.",
            "recommended_replacement": "Dual-Pivot Quicksort (Yaroslavskiy Algorithm) & Cache-Oblivious Memory Hierarchies"
        })
        obsolete_findings.append({
            "topic": "Unbounded Raw Pointer Implementations without Bounds Checking or Smart Pointers",
            "warning": "Raw pointer manipulation without RAII leads to memory leaks and security exploits.",
            "reason": "Modern engineering emphasizes memory safety models (Rust concepts / C++ smart pointers).",
            "recommended_replacement": "Smart Pointer Memory Semantics (std::unique_ptr) and Memory-Safe Abstractions"
        })
        modern_additions.append({
            "topic": "Trie (Prefix Tree) & Radix Trees for High-Throughput Autocomplete & Routing",
            "reason": "Industry standard for search engine query autocompletion and high-speed IP lookup tables.",
            "industry_tag": "Production Search & Routing Standard",
            "module_number": 3
        })
        modern_additions.append({
            "topic": "Segment Tree & Fenwick Tree (Binary Indexed Tree) for Dynamic Range Queries",
            "reason": "Crucial for algorithmic problem solving, computational geometry, and real-time gaming state indexing.",
            "industry_tag": "Competitive Programming & Quant Tech",
            "module_number": 4
        })
        modern_additions.append({
            "topic": "Probabilistic Data Structures: Bloom Filters & Count-Min Sketch",
            "reason": "Core building block in distributed systems (Redis, Cassandra, Apache BigTable) for fast membership testing.",
            "industry_tag": "Big Data & Distributed Cache Standard",
            "module_number": 5
        })
        modern_additions.append({
            "topic": "Lock-Free Concurrent Skip Lists & Concurrent Queues for Multi-Core Systems",
            "reason": "Essential for high-concurrency Java/C++ server runtimes without lock contention bottlenecks.",
            "industry_tag": "Multi-Core System Concurrency",
            "module_number": 5
        })

    # Domain 2: Design and Analysis of Algorithms specifically (CSE2007 / DAA / ALGO)
    elif "algorithm" in title_lower or code_upper in ["CSE2007", "CSE2008", "CS202", "DAA"]:
        target_module = 4
        bloom_level = "Level 5 (Evaluate)"
        bloom_guidance = "Elevate students to proving NP-completeness, designing polynomial-time approximations, and evaluating streaming algorithm bounds."
        obsolete_findings.append({
            "topic": "Manual Simplex Method Tabular Pivot Calculations on Paper",
            "warning": "Hand-computing matrix pivot operations does not build algorithmic intuition.",
            "reason": "Industry formulates linear programming models and delegates solving to modern simplex/interior-point solvers (PuLP/SciPy).",
            "recommended_replacement": "Linear Programming (LP/ILP) Formulation & Modern Solver Integrations"
        })
        obsolete_findings.append({
            "topic": "Shell Sort Gap Sequences & Obsolete Empirical Sorting",
            "warning": "Deprecated in modern analysis in favor of TimSort and introspective sorting.",
            "reason": "Modern production libraries (Java, Python, C++) use TimSort and Introsort.",
            "recommended_replacement": "TimSort Hybrid Mechanics & Cache-Conscious Divide-and-Conquer"
        })
        modern_additions.append({
            "topic": "Distributed MapReduce & Parallel Graph Processing (Pregel / Spark GraphX)",
            "reason": "The foundation for massive scale graph analytics, PageRank, and social network analysis.",
            "industry_tag": "Big Data & Cloud Graph Standard",
            "module_number": 4
        })
        modern_additions.append({
            "topic": "Polynomial-Time Approximation Algorithms (PTAS) for NP-Hard Problems",
            "reason": "Teaches how industry tackles computationally intractable challenges (Vertex Cover, Metric TSP, Knapsack).",
            "industry_tag": "Advanced Optimization Standard",
            "module_number": 5
        })
        modern_additions.append({
            "topic": "Randomized Streaming Algorithms (HyperLogLog, Reservoir Sampling)",
            "reason": "Used in web-scale systems to count billions of unique visitors using only a few kilobytes of memory.",
            "industry_tag": "Web-Scale Streaming Standard",
            "module_number": 4
        })
        modern_additions.append({
            "topic": "Fast Fourier Transform (FFT) Algorithm for O(n log n) Polynomial Multiplication",
            "reason": "Fundamental for computer vision, audio processing, and zero-knowledge cryptography.",
            "industry_tag": "Signal Processing & Cryptography",
            "module_number": 2
        })

    # Domain 3: Operating Systems (CSE2004 / CSE2008 / OS)
    elif "operating" in title_lower or "os" in title_lower or code_upper in ["CSE2004", "CSE3001"]:
        target_module = 5
        bloom_level = "Level 4 (Analyze)"
        bloom_guidance = "Analyze concurrency race conditions, lock-free primitives, and virtual memory page fault overheads."
        obsolete_findings.append({
            "topic": "Legacy Disk Scheduling (SCAN, C-SCAN for Mechanical Spinning Hard Drives)",
            "warning": "Irrelevant for PCIe/NVMe Solid State Drives where physical head seek times do not exist.",
            "reason": "Cloud servers and modern devices run on NVMe/PCIe SSDs.",
            "recommended_replacement": "NVMe Flash Translation Layer (FTL), SSD Wear Leveling, and Blk-mq Multi-Queue I/O"
        })
        modern_additions.append({
            "topic": "Containerization Internals: Linux Namespaces, cgroups v2, and OverlayFS",
            "reason": "The foundation of Docker and Kubernetes container runtimes.",
            "industry_tag": "Cloud-Native Infrastructure Standard",
            "module_number": 4
        })
        modern_additions.append({
            "topic": "eBPF (Extended Berkeley Packet Filter) for Kernel Observability & Tracing",
            "reason": "Modern Linux kernel observability standard used in modern cloud monitoring tools.",
            "industry_tag": "Kernel Engineering & Observability",
            "module_number": 5
        })

    # Domain 4: Database Systems (DBMS / CSE2005 / CSE3002)
    elif "database" in title_lower or "dbms" in title_lower or code_upper in ["CSE2005", "CSE3002"]:
        target_module = 4
        bloom_level = "Level 4 (Analyze)"
        bloom_guidance = "Analyze index selectivity, query execution plans, and ACID vs BASE distributed consistency trade-offs."
        obsolete_findings.append({
            "topic": "Hierarchical & Network CODASYL Database Models",
            "warning": "Obsolete legacy concepts superseded by relational, document, and vector databases.",
            "reason": "Commercial databases are purely relational, document, graph, or vector-based.",
            "recommended_replacement": "Modern Vector Databases (pgvector) and Document NoSQL Stores"
        })
        modern_additions.append({
            "topic": "Vector Databases & High-Dimensional Embeddings Indexing (HNSW / IVFFlat)",
            "reason": "Crucial for Generative AI, LLM Retrieval-Augmented Generation (RAG), and semantic search.",
            "industry_tag": "Generative AI & LLM Essential",
            "module_number": 5
        })
        modern_additions.append({
            "topic": "Log-Structured Merge-Trees (LSM-Trees) vs B+ Trees in Modern Storage Engines",
            "reason": "Core storage architecture used by RocksDB, Cassandra, and Google BigTable.",
            "industry_tag": "High-Throughput Storage Standard",
            "module_number": 4
        })
        modern_additions.append({
            "topic": "Distributed Consensus Protocols: Raft, Paxos, and Two-Phase Commit",
            "reason": "The backbone of distributed databases like Google Spanner, CockroachDB, and YugabyteDB.",
            "industry_tag": "Distributed Database Standard",
            "module_number": 5
        })

    # Domain 5: Computer Networks (CN / CSE3003)
    elif "network" in title_lower or code_upper in ["CSE3003", "CN"]:
        target_module = 4
        bloom_level = "Level 4 (Analyze)"
        bloom_guidance = "Analyze packet flows, congestion collapse mechanisms, and cryptographic handshake latencies."
        obsolete_findings.append({
            "topic": "Classful IPv4 Addressing (Class A, B, C) as Primary Architecture",
            "warning": "Classless Inter-Domain Routing (CIDR) and IPv6 have been universal for over 30 years.",
            "reason": "Modern networking is strictly CIDR and IPv6 dual-stack.",
            "recommended_replacement": "IPv6 Transition Mechanisms, Subnetting with CIDR, and BGP Anycast"
        })
        modern_additions.append({
            "topic": "HTTP/3 over QUIC Protocol (UDP-Based Multiplexed Low-Latency Transport)",
            "reason": "Adopted by major web browsers and CDN providers to eliminate head-of-line blocking.",
            "industry_tag": "Modern Web & CDN Standard",
            "module_number": 4
        })
        modern_additions.append({
            "topic": "Software-Defined Networking (SDN) & OpenFlow Programmable Control Planes",
            "reason": "Industry standard for hyperscale cloud datacenter network orchestration.",
            "industry_tag": "Cloud Datacenter Standard",
            "module_number": 5
        })

    # Domain 6: Machine Learning / AI
    elif "intelligence" in title_lower or "machine learning" in title_lower or "ai" in title_lower or code_upper in ["CSE3005", "AIML"]:
        target_module = 4
        bloom_level = "Level 5 (Evaluate)"
        bloom_guidance = "Evaluate model hallucinations, perplexity metrics, and inference latency trade-offs on edge devices."
        obsolete_findings.append({
            "topic": "Static Rule-Based Expert Systems without Probabilistic Inference",
            "warning": "Superseded by Transformer foundation models and deep learning architectures.",
            "reason": "Modern AI is dominated by self-attention mechanisms and deep generative neural networks.",
            "recommended_replacement": "Transformer Encoders/Decoders & Self-Attention Mechanics"
        })
        modern_additions.append({
            "topic": "Retrieval-Augmented Generation (RAG) Architecture with Vector Embeddings",
            "reason": "Highest market demand for building enterprise Generative AI agents.",
            "industry_tag": "Top Market Demand 2025",
            "module_number": 5
        })
        modern_additions.append({
            "topic": "Parameter-Efficient Fine-Tuning (PEFT, LoRA) & 4-bit Quantization (AWQ/GGUF)",
            "reason": "Enables deploying frontier models on consumer GPUs and edge hardware.",
            "industry_tag": "Applied LLM Engineering",
            "module_number": 4
        })

    # Domain 7: General Computing / Software Engineering
    else:
        target_module = 4
        bloom_level = "Level 4 (Analyze)"
        bloom_guidance = "Analyze code maintainability, security vulnerabilities, and deployment pipeline latency."
        obsolete_findings.append({
            "topic": "Monolithic Waterfall Process & Unencrypted Protocol Implementations",
            "warning": "Modern engineering mandates continuous delivery, containerization, and TLS 1.3 encryption.",
            "reason": "Industry operates under agile CI/CD with Zero-Trust security principles.",
            "recommended_replacement": "Microservices Patterns, gRPC/Protobuf, and Zero-Trust TLS 1.3"
        })
        modern_additions.append({
            "topic": "DevOps CI/CD Automation, Containerized Testing, and Cloud Observability",
            "reason": "Universal engineering baseline across all tech organizations.",
            "industry_tag": "Industry 4.0 Standard",
            "module_number": 5
        })
        modern_additions.append({
            "topic": "OWASP Top 10 Secure Coding & Privacy by Design (DPDP Act 2023 Compliance)",
            "reason": "Mandated for all software engineers handling user data.",
            "industry_tag": "National Cybersecurity Mandate",
            "module_number": 4
        })

    return {
        "course_code": course.code,
        "course_title": course.title,
        "obsolete_topics": obsolete_findings,
        "modern_topics": modern_additions,
        "industry_additions": modern_additions,
        "target_module_number": target_module,
        "overall_health": "Needs Modernization" if obsolete_findings else "Up-to-date",
        "bloom_recommendations": {
            "recommended_level": bloom_level,
            "guidance": bloom_guidance
        }
    }

