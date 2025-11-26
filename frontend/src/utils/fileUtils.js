const ALLOWED_EXTENSIONS = ['.js', '.sol', '.json', '.jsx', '.ts', '.txt', '.md'];

/**
 * 파일 목록에서 허용된 확장자를 가진 파일만 필터링
 * @param {Array} files - 검사할 파일 배열
 * @returns {Array} - 유효한 파일 배열
 */
export const filterValidFiles = (files) => {
  return files.filter(file => {
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(extension);
  });
};

/**
 * File 객체를 텍스트 내용으로 읽어옴
 * @param {File} file - 읽을 파일 객체
 * @returns {Promise<Object>} - { fileName, content } 객체
 */
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve({
      fileName: file.name,
      content: reader.result
    });
    reader.onerror = (error) => reject(error);
  });
};

/**
 * 여러 파일을 동시에 읽어옴
 * @param {Array} files - 읽을 파일 배열
 * @returns {Promise<Array>} - 읽혀진 파일 정보 배열
 */
export const readAllFiles = async (files) => {
  return Promise.all(files.map(readFileAsText));
};