

import multer from 'multer';
const storage = multer.diskStorage({}); // or diskStorage
const upload = multer({ storage });
export default upload;
