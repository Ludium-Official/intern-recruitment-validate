const API_URL = 'https://ludiumaivs-server.onrender.com/analyze';

/**
 * 코드 분석 API를 호출합니다.
 * @param {Array} codeFiles - 분석할 파일 객체 배열 ({ fileName, content })
 * @returns {Promise<Object>} - 분석 결과 JSON 객체
 */
export const analyzeCode = async (codeFiles) => {
  const requestBody = {
    programMeta: {
      id: `program-${Date.now()}`,
      title: "User Uploaded Program"
    },
    codeFiles: codeFiles
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const responseJson = await response.json();

    if (!response.ok || responseJson.status !== 'success') {
      const errorSummary = responseJson.detail 
        || (responseJson.analysis && responseJson.analysis.summary)
        || responseJson.message 
        || `API 호출 실패: ${response.statusText}`;
        
      throw new Error(errorSummary);  
    }

    return responseJson.analysis;
  } catch (error) {
    console.error("API 호출 중 오류:", error);
    throw error; // 에러를 다시 던져서 호출하는 쪽에서 처리하도록 함
  }
};