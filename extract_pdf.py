import fitz
doc = fitz.open('/home/hermeswebui/.hermes/webui/attachments/9717b04b290c/The_16_Word_Sales_Letter_A_proven_method-2.pdf')
text = ""
for page in doc:
    text += page.get_text()
doc.close()
print(text[:5000])
with open('/workspace/p16wsl.txt', 'w') as f:
    f.write(text)
print(f"\n\nTOTAL: {len(text)} chars")
