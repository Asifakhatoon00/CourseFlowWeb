import pypdf
import re

pdf_path = r"backend\uploads\pdf-bcc9c0e7_2023-2027_CSE_PRC-v2.pdf"
reader = pypdf.PdfReader(pdf_path)

all_text = []
for p in range(len(reader.pages)):
    all_text.append(f"<<<PAGE_{p+1}>>>\n" + reader.pages[p].extract_text())

full_text = "\n".join(all_text)

# Let's split by Course Code:
chunks = re.split(r'Course\s*Code\s*:', full_text, flags=re.I)
print(f"Total chunks found: {len(chunks)}")

catalogues = {}

for chunk in chunks[1:]:
    # Extract code: must match standard course code pattern, e.g., CSE2001, MAT1001, etc.
    # Look at the first non-empty word after Course Code:
    code_match = re.search(r'^\s*([A-Za-z]{2,5}\s*\d{3,4}[A-Za-z]?)', chunk)
    if not code_match:
        # Check if elective placeholder like CSE XXXX or XXXXXXX
        code_match = re.search(r'^\s*([A-Za-z0-9]{4,10})', chunk)
    
    if not code_match:
        continue
    
    code = re.sub(r'[^A-Z0-9]', '', code_match.group(1).upper())
    if not code or code.startswith("TOTAL") or code.startswith("PAGE"):
        continue

    # Course Title
    t_match = re.search(r'Course\s*Title\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)', chunk, re.I)
    title = ""
    if t_match:
        raw_t = t_match.group(1).split("Type of Course")[0].split("L-")[0]
        title = re.sub(r'\s+', ' ', raw_t).strip()

    # Modules
    mod_matches = list(re.finditer(r'(?:Module|MODULE)\s*([1-5])\s*[:–-]?\s*(.*?)(?=(?:(?:Module|MODULE)\s*[1-5]|\Z|List of Laboratory Tasks|List of Practical|Text\s*Book|Reference\s*Book|Web resources))', chunk, re.DOTALL | re.I))
    
    modules = []
    for mm in mod_matches:
        num = int(mm.group(1))
        m_txt = mm.group(2).strip()
        lines = [l.strip() for l in m_txt.splitlines() if l.strip() and not l.startswith('<<<P') and 'PU/AC' not in l]
        
        # Determine Title vs Hours vs Topics
        # The first 1-2 lines often contain the title
        # There might be "18 Sessions" or "18 Classes" or "8 Hrs"
        hrs = 8
        h_match = re.search(r'(\d+)\s*(?:Classes|Hrs|Hours|Sessions)', m_txt, re.I)
        if h_match:
            hrs = int(h_match.group(1))

        # Title extraction: remove hours, remove "Assignment", "Program activity", "Classroom activity"
        m_raw_title = lines[0] if lines else f"Module {num}"
        if len(lines) > 1 and not re.search(r'(?:Topics|Topic|Introduction|Concepts):', lines[1], re.I) and len(lines[1]) < 50 and not any(k in lines[1].lower() for k in ["assignment", "sessions", "classes"]):
            m_raw_title += " - " + lines[1]
        
        # Clean title
        m_title = re.sub(r'\d+\s*(?:Classes|Hrs|Hours|Sessions).*$', '', m_raw_title, flags=re.I)
        m_title = re.sub(r'(?:Assignment|Program activity|Classroom activity|MCQ|Assessment).*$', '', m_title, flags=re.I).strip()
        m_title = re.sub(r'[:–-]+$', '', m_title).strip()
        if not m_title or len(m_title) < 3:
            m_title = f"Module {num} Syllabus"

        # Topics:
        # Search for Topics: or Topic: or take everything after title
        top_match = re.search(r'(?:Topics?|Course Content)\s*:\s*(.*)', m_txt, re.DOTALL | re.I)
        if top_match:
            top_str = top_match.group(1)
        else:
            # take lines after line 1 or 2
            start_l = 1
            if len(lines) > 1 and lines[0] in m_title:
                start_l = 2
            top_str = "\n".join(lines[start_l:])

        # Clean top_str
        top_str = re.sub(r'PU/AC[^\n]+\n|\d{1,3}\s*\n|<<<PAGE_\d+>>>', '', top_str)
        top_str = re.sub(r'(?:Assignment|Program activity|Classroom activity|Bloom’s Level|Level \d).*', '', top_str)
        
        # Extract individual topic bullets or clauses
        parts = [p.strip() for p in re.split(r'[,;•\n\r–]+', top_str) if len(p.strip()) > 3]
        clean_topics = []
        for p in parts:
            p_clean = re.sub(r'^(?:Topic|Topics|Introduction|Concepts|Overview)\s*[:–-]\s*', '', p, flags=re.I).strip()
            if len(p_clean) > 3 and not any(skip in p_clean.lower() for skip in ["sessions", "classes", "bloom", "assignment"]):
                clean_topics.append(p_clean)

        modules.append({
            "unit_number": num,
            "title": m_title,
            "hours": hrs,
            "topics": clean_topics[:12] if clean_topics else ["Unit Curriculum & Practical Competencies"]
        })

    catalogues[code] = {
        "title": title,
        "modules_count": len(modules),
        "modules": modules
    }

print(f"\nExtracted {len(catalogues)} course catalogues.")
# Let's inspect some crucial courses: CSE2001, CSE3155, CSE2285, CSE2067, CSE2514, CSE2502, CSE2269
sample_keys = ["CSE2001", "CSE3155", "CSE2285", "CSE2067", "CSE2514", "CSE2502", "CSE2269", "ENG2001", "MAT1001", "CSE1004"]
for sk in sample_keys:
    if sk in catalogues:
        info = catalogues[sk]
        print(f"\n>>> {sk}: {info['title']} ({info['modules_count']} modules)")
        for m in info["modules"]:
            print(f"    M{m['unit_number']} ({m['hours']}h): {m['title']}")
            print(f"        Topics ({len(m['topics'])}): {', '.join(m['topics'][:4])}")
    else:
        print(f"\n>>> {sk}: NOT FOUND IN CATALOGUES!")
