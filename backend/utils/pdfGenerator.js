import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateResumePDF = async (resumeData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      // Pipe to file
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Header - Name and Contact
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text(resumeData.fullName || 'Your Name', { align: 'center' });

      doc.moveDown(0.5);

      // Contact Information
      doc.fontSize(10)
         .font('Helvetica')
         .text([
           resumeData.email || '',
           resumeData.phone || '',
           resumeData.location || ''
         ].filter(Boolean).join(' | '), { align: 'center' });

      doc.moveDown(1);

      // Professional Summary
      if (resumeData.summary) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('PROFESSIONAL SUMMARY', { underline: true });
        
        doc.moveDown(0.5);
        
        doc.fontSize(10)
           .font('Helvetica')
           .text(resumeData.summary, { align: 'justify' });
        
        doc.moveDown(1);
      }

      // Experience Section
      if (resumeData.experience && resumeData.experience.length > 0) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('EXPERIENCE', { underline: true });
        
        doc.moveDown(0.5);

        resumeData.experience.forEach((exp, index) => {
          if (exp.title || exp.company) {
            // Job Title and Company
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text(exp.title || 'Position', { continued: true })
               .font('Helvetica')
               .text(exp.company ? ` at ${exp.company}` : '');

            // Location and Dates
            if (exp.location || exp.dates) {
              doc.fontSize(10)
                 .font('Helvetica-Oblique')
                 .text([exp.location, exp.dates].filter(Boolean).join(' | '));
            }

            // Description
            if (exp.description) {
              doc.moveDown(0.3);
              doc.fontSize(10)
                 .font('Helvetica')
                 .text(exp.description, { align: 'justify' });
            }

            if (index < resumeData.experience.length - 1) {
              doc.moveDown(0.8);
            }
          }
        });

        doc.moveDown(1);
      }

      // Education Section
      if (resumeData.education && resumeData.education.length > 0) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('EDUCATION', { underline: true });
        
        doc.moveDown(0.5);

        resumeData.education.forEach((edu, index) => {
          if (edu.degree || edu.school) {
            // Degree
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text(edu.degree || 'Degree');

            // School and Location
            if (edu.school || edu.location) {
              doc.fontSize(10)
                 .font('Helvetica')
                 .text([edu.school, edu.location].filter(Boolean).join(', '));
            }

            // Dates
            if (edu.dates) {
              doc.fontSize(10)
                 .font('Helvetica-Oblique')
                 .text(edu.dates);
            }

            if (index < resumeData.education.length - 1) {
              doc.moveDown(0.8);
            }
          }
        });

        doc.moveDown(1);
      }

      // Skills Section
      if (resumeData.skills) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('SKILLS', { underline: true });
        
        doc.moveDown(0.5);

        // Parse skills (can be comma-separated string or array)
        let skillsList = [];
        if (typeof resumeData.skills === 'string') {
          skillsList = resumeData.skills.split(',').map(s => s.trim()).filter(Boolean);
        } else if (Array.isArray(resumeData.skills)) {
          skillsList = resumeData.skills;
        }

        if (skillsList.length > 0) {
          doc.fontSize(10)
             .font('Helvetica')
             .text(skillsList.join(' • '), { align: 'justify' });
        }
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(8)
         .font('Helvetica-Oblique')
         .text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });

      // Finalize PDF
      doc.end();

      writeStream.on('finish', () => {
        resolve(outputPath);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

// Ensure uploads directory exists
export const ensureUploadsDirectory = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};
