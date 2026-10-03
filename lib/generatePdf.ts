import jsPDF from "jspdf";
import { toPng } from "html-to-image";

export async function exportInvoiceToPdf(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Exact A4 dimensions in px at 96 DPI: 794 x 1123
  const a4WidthPx = 794;
  const a4HeightPx = 1123;

  try {
    const dataUrl = await toPng(element, {
      width: a4WidthPx,
      height: a4HeightPx,
      pixelRatio: 2, // 2x high resolution
      backgroundColor: "#ffffff",
      skipFonts: true, // prevents font stylesheet parse error
      cacheBust: true,
      style: {
        transform: "none",
        transformOrigin: "top left",
        margin: "0",
        boxShadow: "none",
      },
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;

    pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } catch (error) {
    console.error("toPng generation failed, trying canvas fallback:", error);
    // Fallback: If direct export failed, trigger clean window.print()
    window.print();
    throw new Error("Direct PDF download had an issue in your browser. Opened the clean print dialog (select 'Save as PDF').");
  }
}
