const crypto = require("crypto");
const { getProfile } = require("@yayawallet/node-sdk");
const { AppDataSource } = require("../config/database");
const payloadRepository = AppDataSource.getRepository("Payload");

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const TOLERANCE = 5 * 60 * 1000; // 5 minutes in milliseconds

function verifySignature(signedString, headerSignature) {
  const computedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(signedString)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(computedSignature, "utf8"),
    Buffer.from(headerSignature, "utf8")
  );
}

function isFreshTimestamp(timestamp) {
  const now = Date.now();
  const eventTime = new Date(timestamp).getTime();
  return Math.abs(now - eventTime) <= TOLERANCE;
}

const getProfileInformation = async (req, res) => {
  try {
    const profile = await getProfile();
    console.log(profile);
  } catch (error) {
    console.log("Error fetching user profile: ", error);
  }
};

function createSignedString(payload) {
  const values = [];
  function extractValues(obj) {
    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        extractValues(obj[key]);
      } else {
        values.push(String(obj[key]));
      }
    }
  }
  extractValues(payload);
  return values.join("");
}

const savePayloadToDb = async (payloadData) => {
  try {
    const newPayload = payloadRepository.create({
      payloadId: payloadData.id,
      amount: payloadData.amount,
      currency: payloadData.currency,
      created_at_time: payloadData.created_at_time,
      timestamp: payloadData.timestamp,
      cause: payloadData.cause,
      full_name: payloadData.full_name,
      account_name: payloadData.account_name,
      invoice_url: payloadData.invoice_url,
    });

    await payloadRepository.save(newPayload);
    return newPayload;
  } catch (error) {
    console.error("error svaing payload to db: ", error);
  }
};

const webhook = async (req, res) => {
  try {
    const payload = req.body;
    const signedString = createSignedString(payload);
    const yaYaSignature = req.headers["yaya-signature"];

    const timestamp = yaYaSignature;

    // Check for replay attacks
    if (!isFreshTimestamp(timestamp)) {
      console.log("'Replay attack detected'");
      return res.status(400).send("Replay attack detected");
    }

    // Verify the signature
    if (!verifySignature(signedString, yaYaSignature)) {
      console.log("'Invalid signature'");

      return res.status(400).send("Invalid signature");
    }

    console.log("Verified event:", payload);

    await savePayloadToDb(payload);

    res.status(200).send("Event received");
  } catch (error) {
    console.error("err", error);
  }
};

module.exports = { getProfileInformation, webhook };
