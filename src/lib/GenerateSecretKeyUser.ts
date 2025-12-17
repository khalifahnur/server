const { webcrypto } = require('crypto');

const GenerateSecretKeyUser: () => string = () => {
    const array = new Uint8Array(32);
    webcrypto.getRandomValues(array);
    return Buffer.from(array).toString("hex");
};  

export default GenerateSecretKeyUser;
