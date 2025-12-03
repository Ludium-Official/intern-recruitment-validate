import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId, fileName = 'report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`ID가 ${elementId}인 요소를 찾을 수 없습니다.`);
    return;
  }

  try {
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true, 
      logging: false,
      backgroundColor: '#ffffff',
      
      onclone: (documentClone) => {
        const target = documentClone.getElementById(elementId);
        const allElements = target.querySelectorAll('*');
        allElements.forEach((el) => {
          el.style.setProperty('animation', 'none', 'important');
          el.style.setProperty('transition', 'none', 'important');
          el.style.setProperty('box-shadow', 'none', 'important');
        });

        const preElements = target.querySelectorAll('pre');
        preElements.forEach((pre) => {
          pre.style.setProperty('white-space', 'pre-wrap', 'important');
          pre.style.setProperty('word-break', 'break-all', 'important');
          pre.style.setProperty('overflow-x', 'visible', 'important');
          pre.style.setProperty('overflow-y', 'visible', 'important');
          pre.style.setProperty('font-size', '10px', 'important'); 
          pre.style.setProperty('line-height', '1.2', 'important');
        });

        const codeContainers = target.querySelectorAll('.code-viewer-container, .code-body, .code-viewer-content');
        codeContainers.forEach((div) => {
            div.style.setProperty('height', 'auto', 'important');
            div.style.setProperty('overflow', 'visible', 'important');
            div.style.setProperty('max-height', 'none', 'important');
        });
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; 
    const pageHeight = 297; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);

  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    alert('PDF 생성에 실패했습니다.');
  }
};