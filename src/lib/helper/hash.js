const crypto = require('crypto');

const algorithm = 'aes-256-ctr'; //Using AES encryption
const key = "BHJE6OTQsYEpmo1MT6PswbYVnloAy9Au";
const iv = crypto.randomBytes(16);

function hash_dynamic(input, algorithm = "sha256") {
    var hash = crypto.createHash(algorithm).update(input).digest('hex');
    return hash;
}

function json_convert(params) {
    return JSON.stringify(params);
}

function generate_signature_pgo(order_id, nominal, client_code, client_secret) {
    var input = order_id + nominal + client_code + client_secret;

    var hash = crypto.createHash('sha512').update(input).digest('hex');
    return hash;
}

function generate_signature_yukk(params, secret = null) {
    if(secret == null || secret == ""){
        secret = process.env.NEXT_PUBLIC_SECRET_STAGING;
    }

    var string = json_convert(params);
    var input = string + secret;

    var hash = crypto.createHash('sha512').update(input).digest('hex');
    return hash;
}

//Encrypting text
function encrypt(text) {
   const cipher = crypto.createCipheriv(algorithm, key, iv)
   const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
   return {
      a: iv.toString('hex'),
      b: encrypted.toString('hex')
   }
}

// Decrypting text
function decrypt(iv, content) {
   const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'))
   const decrpyted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()])
   return decrpyted.toString()
}

export { hash_dynamic, generate_signature_pgo, generate_signature_yukk, encrypt, decrypt }