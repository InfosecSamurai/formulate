// PDF generation utility
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface LetterData {
  letterType: string;
  senderName: string;
  recipientName: string;
  date: string;
  situationDetails: string;
  includeAddress: boolean;
  content: string;
}

export async function generatePDF(letterData: LetterData): Promise<Buffer> {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set font
  doc.setFont('helvetica');
  
  // Add letterhead
  doc.setFontSize(18);
  doc.text(letterData.letterType, 105, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.text(letterData.date, 195, 30, { align: 'right' });
  
  // Add address block if needed
  let yPosition = 40;
  if (letterData.includeAddress) {
    doc.setFontSize(10);
    doc.text(letterData.senderName, 20, yPosition);
    doc.text('Your Address Line 1', 20, yPosition + 5);
    doc.text('Your City, State ZIP', 20, yPosition + 10);
    
    yPosition += 20;
    
    doc.text(letterData.recipientName, 20, yPosition);
    doc.text('Recipient Address Line 1', 20, yPosition + 5);
    doc.text('Recipient City, State ZIP', 20, yPosition + 10);
    
    yPosition += 20;
  }
  
  // Add salutation
  doc.setFontSize(12);
  doc.text(`Dear ${letterData.recipientName},`, 20, yPosition);
  
  // Add letter content
  yPosition += 10;
  const contentLines = doc.splitTextToSize(letterData.content, 170);
  doc.setFontSize(11);
  doc.text(contentLines, 20, yPosition);
  
  // Add signature
  yPosition = doc.internal.pageSize.height - 40;
  doc.text('Sincerely,', 20, yPosition);
  doc.text(letterData.senderName, 20, yPosition + 15);
  
  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  
  return pdfBuffer;
}
