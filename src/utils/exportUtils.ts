import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToPDF(elementId: string, filename: string = 'portfolio.pdf'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: null,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width / 2, canvas.height / 2],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(filename);
}

export function generateShareableLink(portfolioData: object): string {
  const encoded = btoa(encodeURIComponent(JSON.stringify(portfolioData)));
  return `${window.location.origin}/p/${encoded.slice(0, 20)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function serializePortfolioForShare(data: {
  name: string;
  area: string;
  niche: string;
  profile: string;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    images: string[];
    technologies: string[];
    videoUrl?: string;
  }>;
  settings: {
    template: string;
    primaryColor: string;
    font: string;
    columns: number;
  };
}): string {
  return JSON.stringify(data);
}
