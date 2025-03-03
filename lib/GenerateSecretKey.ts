const { webcrypto } = require('crypto');

const GenerateSecretKey: () => string = () => {
    const array = new Uint8Array(32);
    webcrypto.getRandomValues(array);
    return Buffer.from(array).toString("hex");
};  

export default GenerateSecretKey;
