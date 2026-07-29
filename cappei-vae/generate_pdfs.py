#!/usr/bin/env python3
"""Convertit les fiches CAPPEI Markdown en PDF avec fpdf2."""

import os, re, glob

# Polices DejaVu depuis matplotlib
import matplotlib
FONT_DIR = os.path.join(os.path.dirname(matplotlib.__file__), 'mpl-data', 'fonts', 'ttf')
dejavu_normal = os.path.join(FONT_DIR, 'DejaVuSans.ttf')
dejavu_bold = os.path.join(FONT_DIR, 'DejaVuSans-Bold.ttf')
print(f"Police normale: {dejavu_normal}")
print(f"Police gras: {dejavu_bold}")


def md_to_html(md_text):
    """Convertit markdown en HTML basique."""
    lines = md_text.split('\n')
    html = []
    in_table = False
    table_html = []
    in_blockquote = False
    in_list = False
    
    # Ignorer le frontmatter YAML
    if lines and lines[0].strip() == '---':
        end = 1
        while end < len(lines) and lines[end].strip() != '---':
            end += 1
        lines = lines[end+1:]
    
    for i, line in enumerate(lines):
        # Tableaux
        if '|' in line and '---' not in line:
            cells = [c.strip() for c in line.split('|') if c.strip()]
            if len(cells) >= 2:
                if not in_table:
                    in_table = True
                    table_html = []
                table_html.append(cells)
                continue
        
        if in_table:
            html.append('<table border="1" cellpadding="4">')
            for idx, row in enumerate(table_html):
                tag = 'th' if idx == 0 else 'td'
                html.append(f'<tr>{"".join(f"<{tag}>{c}</{tag}>" for c in row)}</tr>')
            html.append('</table>')
            in_table = False
            table_html = []
        
        text = line.strip()
        if not text:
            if in_blockquote:
                html.append('</blockquote>')
                in_blockquote = False
            if in_list:
                html.append('</ul>')
                in_list = False
            html.append('<br>')
            continue
        
        # Titres
        if text.startswith('### '):
            html.append(f'<h3>{text[4:]}</h3>')
        elif text.startswith('## '):
            html.append(f'<h2>{text[3:]}</h2>')
        elif text.startswith('# '):
            html.append(f'<h1>{text[2:]}</h1>')
        elif text.startswith('- ') or text.startswith('* '):
            content = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text[2:])
            if not in_list:
                html.append('<ul>')
                in_list = True
            html.append(f'<li>{content}</li>')
        elif text.startswith('> '):
            content = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text[2:])
            if not in_blockquote:
                html.append('<blockquote>')
                in_blockquote = True
            html.append(content + '<br>')
        elif text == '---' or text == '***':
            html.append('<hr>')
            if in_list:
                html.append('</ul>')
                in_list = False
        else:
            txt = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
            txt = re.sub(r'\*(.+?)\*', r'<i>\1</i>', txt)
            if in_list:
                html.append('</ul>')
                in_list = False
            if in_blockquote:
                html.append('</blockquote>')
                in_blockquote = False
            html.append(f'<p>{txt}</p>')
    
    if in_table and table_html:
        html.append('<table border="1" cellpadding="4">')
        for idx, row in enumerate(table_html):
            tag = 'th' if idx == 0 else 'td'
            html.append(f'<tr>{"".join(f"<{tag}>{c}</{tag}>" for c in row)}</tr>')
        html.append('</table>')
    if in_blockquote:
        html.append('</blockquote>')
    if in_list:
        html.append('</ul>')
    
    return '\n'.join(html)


def convert_md_to_pdf(md_path, pdf_path, title):
    """Convertit un fichier markdown en PDF avec fpdf2."""
    from fpdf import FPDF
    
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()
    
    html_content = md_to_html(md_text)
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_font('DejaVu', '', dejavu_normal)
    pdf.add_font('DejaVu', 'B', dejavu_bold)
    
    # Titre
    pdf.set_font('DejaVu', 'B', 14)
    pdf.multi_cell(0, 10, title, align='C')
    pdf.ln(5)
    
    # Contenu HTML
    try:
        pdf.write_html(html_content)
    except Exception as e:
        print(f"  ⚠ Erreur write_html: {e}")
        # Fallback : texte brut
        pdf.set_font('DejaVu', '', 10)
        plain = re.sub(r'<[^>]+>', ' ', html_content)
        pdf.multi_cell(0, 6, plain)
    
    pdf.output(pdf_path)
    return os.path.getsize(pdf_path) // 1024


# Exécution
base_dir = "/workspace/cappei-vae"
output_dir = "/workspace/cappei-vae/pdf"
os.makedirs(output_dir, exist_ok=True)

files = [
    ("fiche1-altius-ppre.md", "FICHE 1 - Altius PPRE (DC1)\nPiloter et animer une démarche d'éducation inclusive"),
    ("fiche2-defi-eloquence.md", "FICHE 2 - Défi Éloquence (DC4)\nTravailler en équipe et avec les partenaires"),
    ("fiche3-fluence-morphosyntaxe.md", "FICHE 3 - Fluence (DC2/DC3)\nParcours adaptés et accessibilité pédagogique"),
    ("index-synthese.md", "SYNTHÈSE GÉNÉRALE\nPrésentation et articulation des 3 actions"),
]

for md_file, title in files:
    md_path = os.path.join(base_dir, md_file)
    pdf_path = os.path.join(output_dir, md_file.replace('.md', '.pdf'))
    print(f"📄 {md_file} → ", end='', flush=True)
    k = convert_md_to_pdf(md_path, pdf_path, title)
    print(f"{k} Ko ✅")

print(f"\n📁 Tous les PDFs : {output_dir}/")
for f in sorted(os.listdir(output_dir)):
    p = os.path.join(output_dir, f)
    print(f"  📄 {f} ({os.path.getsize(p)//1024} Ko)")
