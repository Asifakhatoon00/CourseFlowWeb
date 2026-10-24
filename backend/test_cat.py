import pypdf
import re

reader = pypdf.PdfReader('backend/uploads/pdf-bcc9c0e7_2023-2027_CSE_PRC-v2.pdf')
full_text = '\n'.join([f'\n<<<P{p+1}>>>\n' + reader.pages[p].extract_text() for p in range(43, len(reader.pages))])

matches = list(re.finditer(r'Course\s*Code\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)', full_text, re.I))
print('Total Course Code occurrences:', len(matches))

courses_parsed = {}
for i in range(len(matches)):
    start = matches[i].start()
    end = matches[i+1].start() if i+1 < len(matches) else len(full_text)
    chunk = full_text[start:end]
    raw_code_header = matches[i].group(1)
    
    # Extract exact course code like MAT1001, CSE2001, etc.
    c_match = re.search(r'([A-Z]{2,4}\s*\d{3,4})', raw_code_header)
    if not c_match:
        continue
    code = re.sub(r'\s+', '', c_match.group(1).upper())
    
    # Title
    t_match = re.search(r'Course\s*Title\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)', chunk, re.I)
    title = ''
    if t_match:
        title = re.sub(r'\s+', ' ', t_match.group(1).split('Type of Course')[0]).strip()
    
    # Description
    desc_match = re.search(r'Course\s*Description\s*(.*?)(?=(?:Course\s*Objective|Course\s*Outcomes|Course\s*Content|Module|\Z))', chunk, re.DOTALL | re.I)
    desc = re.sub(r'\s+', ' ', desc_match.group(1).strip()) if desc_match else ''
    
    # Outcomes
    co_matches = re.finditer(r'(?:^\d+\)|^\d+\.|\bCO\s*[-_]?\s*(\d))\s*(.+?)(?=(?:^\d+\)|^\d+\.|\bCO\s*[-_]?\s*\d|Course\s*Content|Module|\Z))', chunk, re.MULTILINE | re.DOTALL)
    cos = []
    for co_m in co_matches:
        co_text = re.sub(r'\s+', ' ', co_m.group(0).strip())
        if len(co_text) > 15:
            cos.append(co_text[:200])

    # Modules
    mod_matches = list(re.finditer(r'(?:Module|MODULE)\s*([1-5])\s*(.*?)(?=(?:(?:Module|MODULE)\s*[1-5]|\Z|List of|Text Book|Reference Book|Practical Tasks))', chunk, re.DOTALL | re.I))
    modules = []
    for mm in mod_matches:
        num = int(mm.group(1))
        m_txt = mm.group(2).strip()
        lines = [l.strip() for l in m_txt.splitlines() if l.strip() and not l.startswith('<<<P') and 'PU/AC' not in l]
        m_title = lines[0] if lines else f'Module {num}'
        
        # Extract hours
        h_match = re.search(r'(\d+)\s*(?:Classes|Hrs|Hours)', m_txt, re.I)
        hrs = int(h_match.group(1)) if h_match else 8
        m_title = re.sub(r'\d+\s*(?:Classes|Hrs|Hours).*$', '', m_title, flags=re.I).strip()
        m_title = re.sub(r'^(?:Module|MODULE)\s*[1-5][:–\s-]*', '', m_title).strip()
        
        # topics
        topics_match = re.search(r'Topics\s*:\s*(.*)', m_txt, re.DOTALL | re.I)
        top_str = topics_match.group(1) if topics_match else ' '.join(lines[1:])
        top_str = re.sub(r'PU/AC[^\n]+\n|\d{1,3}\s*\n|<<<P\d+>>>', '', top_str)
        raw_topics = [t.strip() for t in re.split(r'[,;•\n\r–]+', top_str) if len(t.strip()) > 3 and 'Topics:' not in t]
        
        modules.append({
            'num': num,
            'title': m_title[:60] if m_title else f'Module {num}',
            'hours': hrs,
            'topics': raw_topics[:8]
        })
    
    courses_parsed[code] = {
        'title': title,
        'description': desc[:300],
        'cos_count': len(cos),
        'modules': modules
    }

print('Total courses uniquely extracted:', len(courses_parsed))
for test_c in ['MAT1001', 'CSE1004', 'CSE1005', 'CSE2001', 'CSE3156', 'CSE2007', 'CSE2269', 'CSE2502', 'CSE2285']:
    info = courses_parsed.get(test_c)
    if info:
        print(f"\n=== {test_c}: {info['title']} ===")
        print(f"Desc: {info['description'][:90]}...")
        print(f"COs: {info['cos_count']}, Modules: {len(info['modules'])}")
        for m in info['modules']:
            print(f"   Module {m['num']}: {m['title']} ({m['hours']} Hours) -> {len(m['topics'])} topics: {', '.join(m['topics'][:3])}")
    else:
        print(f"\n=== {test_c}: NOT FOUND ===")
