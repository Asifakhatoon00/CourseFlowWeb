import pypdf
import re

pdf_path = r"backend\uploads\pdf-bcc9c0e7_2023-2027_CSE_PRC-v2.pdf"
reader = pypdf.PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

# 1. Scheme pages (around 38-43)
print("\n=== SCHEME PAGES CHECK ===")
for p in range(36, 44):
    text = reader.pages[p].extract_text()
    if "SEMESTER" in text.upper():
        print(f"\n--- Page {p+1} ---")
        for line in text.splitlines()[:25]:
            print("  ", line)

# 2. Sample Course: CSE2001 (Data Structures and Algorithms)
print("\n=== SEARCHING FOR CSE2001 CATALOGUE ===")
for p in range(40, len(reader.pages)):
    text = reader.pages[p].extract_text()
    if "CSE2001" in text or "CSE 2001" in text:
        print(f"\n--- Found on Page {p+1} ---")
        lines = text.splitlines()
        for line in lines[:40]:
            print("  ", line)
        if len(lines) > 40:
            print("  ... [truncated, next page preview] ...")
        break
