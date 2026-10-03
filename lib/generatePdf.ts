import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportInvoiceToPdf(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Create clone or render with optimal settings
  const canvas = await html2canvas(element, {
    scale: 2.5, // High resolution for clear text and logos
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  // A4 portrait: 210mm x 297mm
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Add the high-res image exactly filling A4 dimensions
  pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
  pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}
