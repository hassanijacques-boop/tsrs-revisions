import re

with open('/workspace/periodes/index.html', 'r') as f:
    content = f.read()

# Find all script blocks
matches = list(re.finditer(r'<script>(.*?)</script>', content, re.DOTALL))
# The main script is the longest one
main = max(matches, key=lambda m: len(m.group(1)))
js = main.group(1)

# Check for </script or </SCRIPT inside strings
dangerous = [(m.start(), m.group()) for m in re.finditer(r'</s(?:cript|CRIPT)', js)]
if dangerous:
    print(f"⚠️ Found {len(dangerous)} potentially dangerous </script inside JS!")
    for pos, match in dangerous[:5]:
        print(f"  Position {pos}: '{match}'")
else:
    print("✅ No </script inside JS - safe")

# Check for HTML comments
if '<!--' in js:
    print("⚠️ Found HTML comment inside script!")
    for m in re.finditer(r'<!--', js):
        print(f"  At position {m.start()}")
else:
    print("✅ No HTML comments inside JS")

# Check for common issues with escaped quotes in template literals
# Look for lines with backslash-escaped single quotes inside template literals
lines = js.split('\n')
issues = []
for i, line in enumerate(lines):
    stripped = line.strip()
    # Check for odd number of double quotes on a line (potential issue)
    dq = stripped.count('"')
    if dq % 2 != 0 and dq > 0 and not stripped.startswith('//') and not stripped.startswith('/*'):
        issues.append((i, f"Odd double quotes ({dq}): {stripped[:80]}"))

if issues:
    print(f"\n⚠️ Found {len(issues)} lines with odd double quotes:")
    for i, msg in issues[:10]:
        print(f"  Line {i}: {msg}")
else:
    print("✅ No odd double quote issues")
