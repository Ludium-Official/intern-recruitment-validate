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
      scale: 2, // [변경] 모바일 과부하 방지 및 글자 뻥튀기 방지를 위해 2로 조정
      useCORS: true, 
      logging: false,
      backgroundColor: '#ffffff',
      
      // [핵심] 캡처 직전, 복제된 화면(Clone)을 A4용지에 맞게 성형수술
      onclone: (documentClone) => {
        const target = documentClone.getElementById(elementId);
        
        // 1. 애니메이션/그림자 제거
        const allElements = target.querySelectorAll('*');
        allElements.forEach((el) => {
          el.style.setProperty('animation', 'none', 'important');
          el.style.setProperty('transition', 'none', 'important');
          el.style.setProperty('box-shadow', 'none', 'important');
        });

        // 2. [필살기] 코드 영역 강제 다이어트 (글자 줄이고 줄바꿈)
        // SyntaxHighlighter는 pre > code > span 구조임. pre를 공략해야 함.
        const preElements = target.querySelectorAll('pre');
        preElements.forEach((pre) => {
          // 가로 스크롤 없애고 줄바꿈 강제
          pre.style.setProperty('white-space', 'pre-wrap', 'important');
          pre.style.setProperty('word-break', 'break-all', 'important');
          pre.style.setProperty('overflow-x', 'visible', 'important');
          pre.style.setProperty('overflow-y', 'visible', 'important');
          
          // [중요] 글자 크기를 확 줄여서 A4 폭에 많이 들어가게 함
          pre.style.setProperty('font-size', '10px', 'important'); 
          pre.style.setProperty('line-height', '1.2', 'important');
        });

        // 3. 코드 컨테이너 높이 제한 해제 (내용만큼 길어지게)
        const codeContainers = target.querySelectorAll('.code-viewer-container, .code-body, .code-viewer-content');
        codeContainers.forEach((div) => {
            div.style.setProperty('height', 'auto', 'important');
            div.style.setProperty('overflow', 'visible', 'important');
            div.style.setProperty('max-height', 'none', 'important');
        });
      }
    });

    // --- PDF 저장 로직 (동일) ---
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