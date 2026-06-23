from docx import Document

doc = Document("data/job_description.docx")

for para in doc.paragraphs:
    print(para.text)