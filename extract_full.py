import fitz
doc = fitz.open('/home/hermeswebui/.hermes/webui/attachments/9717b04b290c/The_16_Word_Sales_Letter_A_proven_method-3.pdf')
text = ""
for page in doc:
    text += page.get_text()
doc.close()
with open('/workspace/p16_full.txt', 'w') as f:
    f.write(text)

# Extraire les chapitres clés
chapters = text.split('Chapter ')
print(f"Nombre de chapitres: {len(chapters)-1}")
print(f"Taille totale: {len(text)} chars")

# Afficher les titres des chapitres
for i, ch in enumerate(chapters):
    lines = ch.strip().split('\n')
    if lines:
        print(f"Ch.{i}: {lines[0][:80]}")
