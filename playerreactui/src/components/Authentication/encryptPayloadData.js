import CryptoJS from 'crypto-js';

const encryptionKey = 'aHB7j5XYlXBFqGxDd5iQgxQC0GCxr1PgRfgiC41MWSs=';
const encryptionIv = 'cW6lnwbg6lmam7mHUqaEQw==';
                    

const encryptData = (data) => {
  const key = CryptoJS.enc.Base64.parse(encryptionKey);
  const iv = CryptoJS.enc.Base64.parse(encryptionIv);

  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });

  return encrypted.toString();
};




export default encryptData
