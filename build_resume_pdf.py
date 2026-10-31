import os
import shutil
import fitz  # PyMuPDF
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class FullPageCanvas(canvas.Canvas):
    """
    Precision canvas using the full A4 sheet with classic human-crafted footer and hairline border.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self.pages)
        for state in self.pages:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, total_pages):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Professional, human footer
        left_text = "John Linnu Kalavala  |  Electrical & Electronics Engineering (EEE), JNTUK  |  Web Systems Developer"
        right_text = f"Page {self._pageNumber} of {total_pages}"
        
        self.drawString(34, 20, left_text)
        self.drawRightString(A4[0] - 34, 20, right_text)
        
        # Subtle hairline separator
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.6)
        self.line(34, 30, A4[0] - 34, 30)
        
        self.restoreState()

def create_resume_pdf(output_path):
    # A4: 595.27 x 841.89 points
    # Printable area: 34pt left/right, 26pt top, 38pt bottom
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=34,
        rightMargin=34,
        topMargin=26,
        bottomMargin=38,
        title="John Linnu Kalavala - Electrical & Electronics Engineering Undergrad & Web Systems Engineer",
        author="John Linnu Kalavala",
        subject="Software Engineering & Web Systems Developer Resume",
        keywords="Electrical and Electronics Engineering, EEE, JNTUK Kakinada, Full-Stack Developer, Node.js, JavaScript, Python, SQLite, PWA, Document Automation"
    )

    # Classic Executive Palette
    C_PRIMARY = colors.HexColor("#0f172a")     # Deep Charcoal Obsidian
    C_NAVY = colors.HexColor("#1e3a8a")        # Deep Corporate Navy
    C_TEXT = colors.HexColor("#1e293b")        # Deep Slate for readability
    C_MUTED = colors.HexColor("#475569")       # Slate for metadata
    C_LINE = colors.HexColor("#cbd5e1")        # Section hairline
    C_TECHS = colors.HexColor("#334155")       # Technology descriptors

    # Uniform Font Family: Helvetica, Helvetica-Bold, Helvetica-Oblique
    name_style = ParagraphStyle(
        'DocName',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=23,
        textColor=C_PRIMARY
    )

    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=C_NAVY,
        alignment=2
    )

    contact_style = ParagraphStyle(
        'DocContact',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=C_MUTED
    )

    section_heading = ParagraphStyle(
        'DocSectionHeading',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=C_PRIMARY,
        spaceBefore=5,
        spaceAfter=2
    )

    summary_style = ParagraphStyle(
        'DocSummary',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.6,
        textColor=C_TEXT
    )

    job_title_style = ParagraphStyle(
        'DocJobTitle',
        fontName='Helvetica-Bold',
        fontSize=9.0,
        leading=11.5,
        textColor=C_PRIMARY
    )

    job_date_style = ParagraphStyle(
        'DocJobDate',
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11.5,
        textColor=C_MUTED,
        alignment=2
    )

    job_tech_style = ParagraphStyle(
        'DocJobTech',
        fontName='Helvetica-Oblique',
        fontSize=7.8,
        leading=10.0,
        textColor=C_TECHS,
        spaceAfter=1.5
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        fontName='Helvetica',
        fontSize=8.3,
        leading=10.8,
        textColor=C_TEXT,
        leftIndent=11,
        firstLineIndent=-11,
        spaceAfter=1.5
    )

    skill_cat_style = ParagraphStyle(
        'DocSkillCat',
        fontName='Helvetica-Bold',
        fontSize=8.3,
        leading=10.8,
        textColor=C_PRIMARY
    )

    skill_item_style = ParagraphStyle(
        'DocSkillItem',
        fontName='Helvetica',
        fontSize=8.3,
        leading=10.8,
        textColor=C_TEXT
    )

    story = []

    # ════════════ HEADER ════════════
    header_data = [
        [
            Paragraph("<b>JOHN LINNU KALAVALA</b>", name_style),
            Paragraph("<b>FULL-STACK WEB SYSTEMS DEVELOPER</b>", title_style)
        ]
    ]
    header_table = Table(header_data, colWidths=[315, 212])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'BOTTOM'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ]))
    story.append(header_table)

    contact_text = (
        "<b>Location:</b> Kakinada, Andhra Pradesh, India  |  "
        "<b>University:</b> JNTU College of Engineering Kakinada (JNTUK)  |  "
        "<b>Degree:</b> B.Tech in EEE<br/>"
        "<b>Email:</b> <a href='mailto:johnlinnu@gmail.com'><u>johnlinnu@gmail.com</u></a>  |  "
        "<b>Phone:</b> +91 6302439991  |  "
        "<b>Portfolio:</b> <a href='https://kalavalajohnlinnu-ui.github.io/portfolio-/'><u>kalavalajohnlinnu-ui.github.io/portfolio-/</u></a>  |  "
        "<b>GitHub:</b> <a href='https://github.com/kalavalajohnlinnu-ui'><u>github.com/kalavalajohnlinnu-ui</u></a>"
    )
    story.append(Paragraph(contact_text, contact_style))
    story.append(HRFlowable(width="100%", thickness=1.2, color=C_PRIMARY, spaceBefore=3, spaceAfter=4))

    # ════════════ PROFESSIONAL SUMMARY ════════════
    story.append(Paragraph("<b>PROFESSIONAL SUMMARY</b>", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_LINE, spaceBefore=1, spaceAfter=3))
    summary_p = (
        "Undergraduate <b>Electrical &amp; Electronics Engineering (EEE)</b> student at <b>JNTU College of Engineering Kakinada (JNTUK)</b>, "
        "with demonstrated commercial experience engineering and deploying production-grade web applications, business automation engines, "
        "and document generation systems. Proven track record architecting software for <b>Thomas International Music Academy (TIMA)</b>, "
        "<b>KAPL Enterprises</b>, <b>Bharat Pro Lifts</b>, and <b>Effisol Energy Solutions</b>. Combines rigorous electrical and computer engineering "
        "principles with modern JavaScript/Node.js web architectures, real-time booking engines, and dynamic batch PDF/DOCX automation."
    )
    story.append(Paragraph(summary_p, summary_style))
    story.append(Spacer(1, 3))

    # ════════════ EDUCATION ════════════
    story.append(Paragraph("<b>EDUCATION</b>", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_LINE, spaceBefore=1, spaceAfter=3))
    
    edu_row = [
        Paragraph("<b>Bachelor of Technology (B.Tech) in Electrical &amp; Electronics Engineering (EEE)</b>", job_title_style),
        Paragraph("<b>2024 - 2028 (Expected)</b>", job_date_style)
    ]
    edu_table = Table([edu_row], colWidths=[407, 120])
    edu_table.setStyle(TableStyle([
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(edu_table)
    edu_sub = (
        "<b>Jawaharlal Nehru Technological University (JNTUK), College of Engineering Kakinada</b>, Andhra Pradesh<br/>"
        "<i>Focus Areas: Electrical Circuit Theory, Digital Electronics, Microprocessors &amp; Embedded Systems, Data Structures &amp; Algorithms, Database Systems, Web Application Development.</i>"
    )
    story.append(Paragraph(edu_sub, ParagraphStyle('EduSub', fontName='Helvetica', fontSize=8.0, leading=10.5, textColor=C_TEXT)))
    story.append(Spacer(1, 3))

    # ════════════ PRODUCTION SYSTEMS & CLIENT WORK ════════════
    story.append(Paragraph("<b>PRODUCTION SYSTEMS &amp; COMMERCIAL CLIENT EXPERIENCE</b>", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_LINE, spaceBefore=1, spaceAfter=3))

    def add_project(title, client, date, tech_str, bullets):
        row = [
            Paragraph(f"<b>{title}</b>  |  <font color='#1e3a8a'><b>{client}</b></font>", job_title_style),
            Paragraph(f"<b>{date}</b>", job_date_style)
        ]
        t = Table([row], colWidths=[407, 120])
        t.setStyle(TableStyle([
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ]))
        story.append(t)
        story.append(Paragraph(f"<b>Technologies:</b> {tech_str}", job_tech_style))
        for b in bullets:
            story.append(Paragraph(f"- {b}", bullet_style))
        story.append(Spacer(1, 2.5))

    # 1. TIMA
    add_project(
        "Thomas International Music Academy (TIMA)",
        "Studio Operations &amp; Slot Booking PWA",
        "2026 | Live Production",
        "Node.js, SQLite, Progressive Web App (PWA), Service Workers, Web Push Notifications, REST APIs",
        [
            "<b>Full-Stack Architecture:</b> Built a standalone Node.js and SQLite Progressive Web App managing studio operations across <b>18 daily operating hours (5:00 AM - 11:00 PM)</b>.",
            "<b>Coach Operations Portal:</b> Developed coach dashboard with automated audio notifications for unmarked sessions, roster filters, and transactional SQLite database snapshot backups.",
            "<b>Interactive Profile Tools:</b> Implemented touch photo cropping (1.0x to 3.0x pan/zoom) for student profiles and parent self-service attendance tracking.",
            "<b>Real-Time Slot Engine:</b> Created dynamic make-up slot discovery and reservation engine supporting <b>9 instrument rooms</b>."
        ]
    )

    # 2. KAPL Enterprises
    add_project(
        "KAPL Enterprises",
        "Solar Quotation Generator &amp; Document Generator Pro",
        "2025 - 2026 | Commercial Systems",
        "JavaScript (ES6+), jsPDF, Docxtemplater, PizZip, HTML5/CSS3, Business Logic Engines",
        [
            "<b>Quotation Calculation Engine:</b> Built an automated solar proposal generator computing custom kW loads, GST tiers, and central subsidies, producing branded A4 PDF proposals in under 3 seconds.",
            "<b>Batch Document Automation:</b> Engineered <b>Solar Document Generator Pro</b> to batch-generate <b>6 official legal agreements</b> (Model Agreement, Net Metering, Grounding, Annexures, Completion Reports) from a single entry.",
            "<b>Commercial Impact:</b> Replaced manual drafting workflows with a one-click combined DOCX batch export, saving <b>10+ hours per week</b> in administrative preparation."
        ]
    )

    # 3. Bharat Pro Lifts
    add_project(
        "Bharat Pro Lifts",
        "Elevator Technical Quotation Generator",
        "2025 | Commercial System",
        "JavaScript, jsPDF, Mathematical Calculation Matrices, HTML5/CSS3",
        [
            "<b>Engineering Calculation Suite:</b> Developed an interactive quotation tool computing passenger/freight load limits, shaft dimensions, and door opening configurations.",
            "<b>Dynamic Proposal Export:</b> Implemented real-time cost calculation matrices with instant client-branded PDF quotation downloads and multi-step form validation."
        ]
    )

    # 4. Effisol Energy Solutions
    add_project(
        "Effisol Energy Solutions",
        "Commercial Solar Quotation Management Platform",
        "2025 | Commercial System",
        "JavaScript, Dynamic PDF Generation, Product Catalog Search, Responsive UI",
        [
            "<b>Catalog Search &amp; Proposals:</b> Built end-to-end quotation management platform with searchable Tier-1 module inventory, automatic GST computation, and exportable commercial client proposals."
        ]
    )

    # 5. TechSummit
    add_project(
        "TechSummit",
        "Conference Registration &amp; Digital QR Ticketing Platform",
        "2026 | Live Platform",
        "JavaScript, Vector QR Code Engine, Digital Badge Generation, Responsive Web UI",
        [
            "<b>Event Ticketing Engine:</b> Built conference registration portal with multi-tier ticket selection (General, All-Access, VIP) and automated digital badge generation with scannable QR verification."
        ]
    )

    # ════════════ TECHNICAL SKILLS ════════════
    story.append(Paragraph("<b>TECHNICAL SKILLS &amp; ENGINEERING COMPETENCIES</b>", section_heading))
    story.append(HRFlowable(width="100%", thickness=0.5, color=C_LINE, spaceBefore=1, spaceAfter=3))
    
    skills_data = [
        [
            Paragraph("<b>Core Languages:</b>", skill_cat_style),
            Paragraph("JavaScript (ES6+/Modern), TypeScript, Python, HTML5, CSS3, SQL, C/C++ (Embedded)", skill_item_style)
        ],
        [
            Paragraph("<b>Backend &amp; Systems:</b>", skill_cat_style),
            Paragraph("Node.js (Native architectures), Express.js, RESTful APIs, Progressive Web Apps (PWA), Service Workers, Web Push", skill_item_style)
        ],
        [
            Paragraph("<b>Document Automation:</b>", skill_cat_style),
            Paragraph("jsPDF, Docxtemplater, PizZip, html2canvas, Automated GST &amp; Subsidy Calculators, Batch DOCX/PDF Export", skill_item_style)
        ],
        [
            Paragraph("<b>Frontend &amp; Responsive UI:</b>", skill_cat_style),
            Paragraph("Modern Responsive UI/UX, CSS Grid/Flexbox, GSAP Animations, Canvas Graphics, Cross-Browser Optimization", skill_item_style)
        ],
        [
            Paragraph("<b>Engineering &amp; Databases:</b>", skill_cat_style),
            Paragraph("SQLite (Transactions &amp; Backups), PostgreSQL, Git &amp; GitHub, Linux CLI, Electrical Circuits, Microcontrollers", skill_item_style)
        ]
    ]
    skills_table = Table(skills_data, colWidths=[135, 392])
    skills_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(skills_table)

    # Build document
    doc.build(story, canvasmaker=FullPageCanvas)
    print(f"Resume PDF successfully compiled to: {output_path}")

    # Verify Page Count and Height Utilization with PyMuPDF
    pdf_doc = fitz.open(output_path)
    page_count = len(pdf_doc)
    print(f"PyMuPDF Verification: Total Pages = {page_count}")
    
    page = pdf_doc[0]
    rects = page.get_text('blocks')
    lowest_y = max(b[3] for b in rects)
    print(f"Page Height: {page.rect.height:.1f}pt | Lowest Text Y: {lowest_y:.1f}pt | Bottom Clearance: {page.rect.height - lowest_y:.1f}pt")
    
    # Render high-resolution PNG preview of Page 1
    pix = page.get_pixmap(dpi=150)
    preview_dir = r"C:\Users\user\.gemini\antigravity\scratch\portfolio\assets"
    preview_path = os.path.join(preview_dir, "resume-preview.png")
    pix.save(preview_path)
    print(f"Rendered Page 1 preview to: {preview_path}")
    
    # Copy preview to brain artifact
    brain_preview = r"C:\Users\user\.gemini\antigravity\brain\f686668f-7d1b-46d8-bc17-88db6972bbad\resume_preview.png"
    shutil.copyfile(preview_path, brain_preview)
    print(f"Copied preview to brain artifact: {brain_preview}")
    
    pdf_doc.close()
    return page_count

if __name__ == "__main__":
    out_dir = r"C:\Users\user\.gemini\antigravity\scratch\portfolio"
    out_file = os.path.join(out_dir, "John_Linnu_Kalavala_Resume.pdf")
    pages = create_resume_pdf(out_file)
    
    # Also copy to assets/resume.pdf for direct portfolio downloads
    assets_dir = os.path.join(out_dir, "assets")
    os.makedirs(assets_dir, exist_ok=True)
    asset_file = os.path.join(assets_dir, "resume.pdf")
    shutil.copyfile(out_file, asset_file)
    print(f"Copied to assets folder: {asset_file}")
    
    if pages == 1:
        print("SUCCESS: Resume uses the complete A4 sheet and is strictly 1 Page!")
    else:
        print(f"WARNING: Resume spilled to {pages} pages, adjust vertical spacing!")
