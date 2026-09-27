import fs from 'node:fs';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = 'C:\\Users\\khyat\\OneDrive\\Desktop\\karigarsetuai.in-main';
const envPath = root + '\\' + '.env.local';
for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx < 0) continue;
  process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

const sendUrl = pathToFileURL(root + '\\api\\send-email-otp.js').href;
const verifyUrl = pathToFileURL(root + '\\api\\verify-email-otp.js').href;
const originalRandomInt = crypto.randomInt.bind(crypto);
let capturedOtp = null;
crypto.randomInt = (...args) => {
  const value = originalRandomInt(...args);
  capturedOtp = String(value);
  return value;
};

const { default: sendHandler } = await import(sendUrl);
const { default: verifyHandler } = await import(verifyUrl);
const email = 'delivered@resend.dev';
const sendRes = {
  statusCode: 200,
  headers: {},
  setHeader(name, value) { this.headers[name] = value; },
  status(code) { this.statusCode = code; return this; },
  json(payload) { this.payload = payload; return payload; },
  end(payload) { this.payload = payload; return payload; },
};
await sendHandler({ method: 'POST', body: { email } }, sendRes);
console.log('SEND_STATUS=' + sendRes.statusCode);
console.log('SEND_BODY=' + JSON.stringify(sendRes.payload));
console.log('OTP_CAPTURED=' + Boolean(capturedOtp));
if (!capturedOtp) process.exit(0);

const verifyRes = {
  statusCode: 200,
  headers: {},
  setHeader(name, value) { this.headers[name] = value; },
  status(code) { this.statusCode = code; return this; },
  json(payload) { this.payload = payload; return payload; },
  end(payload) { this.payload = payload; return payload; },
};
await verifyHandler({ method: 'POST', body: { email, otp: capturedOtp } }, verifyRes);
console.log('VERIFY_STATUS=' + verifyRes.statusCode);
console.log('VERIFY_BODY=' + JSON.stringify(verifyRes.payload));
