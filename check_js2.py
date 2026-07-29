import re, sys

with open('/workspace/periodes/index.html', 'r') as f:
    content = f.read()

# Extract main script block (the largest one)
matches = list(re.finditer(r'<script>(.*?)</script>', content, re.DOTALL))
main = max(matches, key=lambda m: len(m.group(1)))
js = main.group(1)

# Print line count
lines = js.split('\n')
print(f"Total JS lines: {len(lines)}")

# Check each line for potential issues
for i, line in enumerate(lines, 1):
    stripped = line.strip()
    
    # Skip empty lines and comments
    if not stripped or stripped.startswith('//') or stripped.startswith('/*'):
        continue
    
    # Check for unescaped </script> inside strings
    if '</script>' in stripped or '</SCRIPT>' in stripped.upper():
        print(f"❌ Line {i}: contains </script>: {stripped[:80]}")
    
    # Check for lines with template literals that might break
    if '`' in stripped:
        count = stripped.count('`')
        if count % 2 != 0:
            print(f"⚠️ Line {i}: odd backticks ({count}): {stripped[:100]}")

print("\n✅ Basic check complete")
sys.exit(0)
