import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Parse PDF file
export const parsePDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Failed to parse PDF: ' + error.message);
  }
};

// Parse DOC/DOCX file
export const parseDOCX = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    throw new Error('Failed to parse DOCX: ' + error.message);
  }
};

// Extract structured data from text using regex patterns
export const extractResumeData = (text) => {
  const data = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    rawText: text
  };

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) data.email = emailMatch[0];

  // Extract phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) data.phone = phoneMatch[0];

  // Extract name (first line usually)
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    data.fullName = lines[0].trim();
  }

  // Extract skills (common section headers)
  const skillsSection = extractSection(text, ['skills', 'technical skills', 'core competencies']);
  if (skillsSection) {
    data.skills = skillsSection
      .split(/[,\n•·]/)
      .map(s => s.trim())
      .filter(s => s && s.length > 1 && s.length < 50);
  }

  // Extract summary
  const summarySection = extractSection(text, ['summary', 'profile', 'objective', 'about']);
  if (summarySection) {
    data.summary = summarySection.substring(0, 500);
  }

  return data;
};

// Helper function to extract section content
const extractSection = (text, headers) => {
  const lowerText = text.toLowerCase();
  
  for (const header of headers) {
    const regex = new RegExp(`${header}[:\\s]*([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
    const match = lowerText.match(regex);
    
    if (match) {
      const startIndex = lowerText.indexOf(match[0]);
      const endIndex = startIndex + match[0].length;
      return text.substring(startIndex, endIndex).replace(new RegExp(header, 'i'), '').trim();
    }
  }
  
  return '';
};

// Download file from URL (using native fetch in Node 18+)
export const downloadFile = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to download file');
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    throw new Error('Failed to download file: ' + error.message);
  }
};
