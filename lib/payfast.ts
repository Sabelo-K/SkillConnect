import { createHash } from "crypto";

export const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID ?? "10000100";
export const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY ?? "46f0cd694581a";
export const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE ?? "";

const IS_SANDBOX =
  process.env.NODE_ENV !== "production" || process.env.PAYFAST_SANDBOX === "true";

export const PAYFAST_URL = IS_SANDBOX
  ? "https://sandbox.payfast.co.za/eng/process"
  : "https://www.payfast.co.za/eng/process";

// Build MD5 signature in PayFast's expected format (insertion-order matters)
export function generateSignature(
  data: Record<string, string>,
  passPhrase: string = PAYFAST_PASSPHRASE
): string {
  let pfOutput = "";
  for (const key of Object.keys(data)) {
    if (key !== "signature" && data[key] !== "") {
      pfOutput += `${key}=${encodeURIComponent(data[key].trim())}&`;
    }
  }
  pfOutput = pfOutput.slice(0, -1);
  if (passPhrase) {
    pfOutput += `&passphrase=${encodeURIComponent(passPhrase.trim())}`;
  }
  return createHash("md5").update(pfOutput).digest("hex");
}

export function buildPaymentData(
  job: { id: string; clientName: string; quotedAmount: number; trade: string; clientToken?: string },
  baseUrl: string
): Record<string, string> {
  const parts = job.clientName.trim().split(" ");
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ") || firstName;

  const returnParams = job.clientToken
    ? `clientToken=${job.clientToken}`
    : `jobId=${job.id}`;
  const cancelParams = job.clientToken
    ? `clientToken=${job.clientToken}`
    : `jobId=${job.id}`;

  // Parameter order must match what we include — PayFast is order-sensitive
  const data: Record<string, string> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${baseUrl}/job/payment/success?${returnParams}`,
    cancel_url: `${baseUrl}/job/payment/cancel?${cancelParams}`,
    notify_url: `${baseUrl}/api/payfast/notify`,
    m_payment_id: job.id,
    amount: job.quotedAmount.toFixed(2),
    item_name: `SkillConnect ${job.trade} Job`,
    name_first: firstName,
    name_last: lastName,
  };
  data.signature = generateSignature(data);
  return data;
}

// PayFast server IPs that send ITN notifications
export const PAYFAST_VALID_IPS = [
  "41.74.179.194",
  "41.74.179.195",
  "41.74.179.196",
  "41.74.179.197",
  "127.0.0.1",
  "::1",
];

export function verifyITNSignature(
  data: Record<string, string>,
  receivedSignature: string
): boolean {
  const computed = generateSignature(data);
  return computed === receivedSignature;
}
