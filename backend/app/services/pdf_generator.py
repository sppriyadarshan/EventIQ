import io
import os
import qrcode
from datetime import datetime

from reportlab.lib.pagesizes import letter, landscape, A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch


def generate_certificate_pdf(
    student_name: str,
    event_name: str,
    institution_name: str,
    event_date: str,
    venue_name: str,
    registration_id_display: str,
    certificate_id: str,
    organizer_name: str,
    verification_url: str
) -> bytes:
    """
    Generates a professional PDF certificate of participation using ReportLab.
    Embeds a real verification QR code linking to EventIQ certificate verification portal.
    """
    buffer = io.BytesIO()

    # Create landscape A4 canvas
    page_width, page_height = landscape(A4)

    # 1. Generate QR Code image in memory
    qr_img = qrcode.make(verification_url)
    qr_buffer = io.BytesIO()
    qr_img.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    # 2. Setup Canvas / Page Drawing
    c = canvas.Canvas(buffer, pagesize=landscape(A4))

    # Draw Decorative Borders
    c.setStrokeColor(colors.HexColor("#6B1E23"))  # Brand Burgundy
    c.setLineWidth(5)
    c.rect(20, 20, page_width - 40, page_height - 40)

    c.setStrokeColor(colors.HexColor("#C59B27"))  # Gold Accent
    c.setLineWidth(1.5)
    c.rect(26, 26, page_width - 52, page_height - 52)

    # Header / Institution Name
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(colors.HexColor("#6B1E23"))
    c.drawCentredString(page_width / 2.0, page_height - 65, (institution_name or "EventIQ Institute of Technology").upper())

    c.setFont("Helvetica", 10)
    c.setFillColor(colors.HexColor("#5A524C"))
    c.drawCentredString(page_width / 2.0, page_height - 82, "OFFICIAL ACADEMIC & EVENT CREDENTIAL VERIFICATION SYSTEM")

    # Main Title: CERTIFICATE OF PARTICIPATION
    c.setFont("Helvetica-Bold", 26)
    c.setFillColor(colors.HexColor("#6B1E23"))
    c.drawCentredString(page_width / 2.0, page_height - 130, "CERTIFICATE OF PARTICIPATION")

    # Presentation Subtitle
    c.setFont("Helvetica-Oblique", 13)
    c.setFillColor(colors.HexColor("#3D332A"))
    c.drawCentredString(page_width / 2.0, page_height - 160, "This certificate is proudly presented to")

    # Student Name
    c.setFont("Helvetica-Bold", 24)
    c.setFillColor(colors.HexColor("#1A1412"))
    c.drawCentredString(page_width / 2.0, page_height - 200, student_name)

    # Decorative Underline under name
    c.setStrokeColor(colors.HexColor("#6B1E23"))
    c.setLineWidth(1)
    c.line((page_width / 2.0) - 160, page_height - 210, (page_width / 2.0) + 160, page_height - 210)

    # Participation Text
    c.setFont("Helvetica", 12)
    c.setFillColor(colors.HexColor("#3D332A"))
    c.drawCentredString(page_width / 2.0, page_height - 235, "for successfully participating in")

    # Event Name
    c.setFont("Helvetica-Bold", 20)
    c.setFillColor(colors.HexColor("#6B1E23"))
    c.drawCentredString(page_width / 2.0, page_height - 265, event_name)

    # Event Details Summary Box
    box_y = page_height - 345
    box_w = page_width - 160
    c.setFillColor(colors.HexColor("#FBF3EA"))
    c.rect(80, box_y, box_w, 55, fill=True, stroke=False)
    c.setStrokeColor(colors.HexColor("#E2D7CB"))
    c.rect(80, box_y, box_w, 55, fill=False, stroke=True)

    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#3D332A"))
    
    col1 = 110
    col2 = 280
    col3 = 450
    col4 = 630

    c.drawString(col1, box_y + 34, f"Date: {event_date}")
    c.drawString(col1, box_y + 14, f"Venue: {venue_name}")

    c.drawString(col3, box_y + 34, f"Registration ID: {registration_id_display}")
    c.drawString(col3, box_y + 14, f"Certificate ID: {certificate_id}")

    # Bottom Row: Verification QR (Left) & Organizer Signature (Right)
    # Draw Verification QR Code Image
    from reportlab.lib.utils import ImageReader
    qr_img_reader = ImageReader(qr_buffer)
    qr_x = 55
    qr_y = 45
    c.drawImage(qr_img_reader, qr_x, qr_y, width=80, height=80)

    c.setFont("Helvetica", 8)
    c.setFillColor(colors.HexColor("#5A524C"))
    c.drawString(qr_x, qr_y - 12, "Scan QR to verify certificate")
    c.drawString(qr_x, qr_y - 22, f"ID: {certificate_id}")

    # Signature Block (Right)
    sig_x = page_width - 240
    sig_y = 80

    c.setStrokeColor(colors.HexColor("#3D332A"))
    c.setLineWidth(1)
    c.line(sig_x, sig_y, sig_x + 180, sig_y)

    c.setFont("Helvetica-Bold", 10)
    c.setFillColor(colors.HexColor("#1A1412"))
    c.drawString(sig_x + 10, sig_y - 16, organizer_name or "Department Convener")

    c.setFont("Helvetica", 9)
    c.setFillColor(colors.HexColor("#5A524C"))
    c.drawString(sig_x + 10, sig_y - 30, "Authorized Organizer")
    c.drawString(sig_x + 10, sig_y - 42, f"Issued: {datetime.utcnow().strftime('%Y-%m-%d')}")

    # Save & Return PDF Bytes
    c.showPage()
    c.save()

    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
