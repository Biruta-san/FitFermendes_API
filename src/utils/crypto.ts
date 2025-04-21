const CryptoJS = require("crypto-js");

const secretKey = process.env.SECRET_KEY;

export const encriptar = (dados: string) => {
    return CryptoJS.AES.encrypt(dados, secretKey).toString();
};

export const decriptar = (dados: string) => {
    const bytes = CryptoJS.AES.decrypt(dados, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
