# YaYa Wallet Webhook Integration

This repository demonstrates how to securely handle and verify webhook events from **YaYa Wallet** in a Node.js/Express application. It includes timestamp validation to prevent replay attacks and signature verification for data integrity. It also saves the incoming payload to a postgresql database for accessing it later.

## Prerequisites
- Node.js and Express installed.
- Access to your YaYa Wallet secret key.
- Ensure server time is synced using **NTP** or Windows Time Service.


## Setup

1. **Install dependencies**:

## How It Works

### 1. Signature Verification

- **Generating the Signature**:  
  The payload values are concatenated into a single string.  
  An HMAC SHA-256 hash of the string is generated using the **YaYa Wallet secret key**.

- **Verifying the Signature**:  
  The computed hash is compared with the `yaya-signature` header using `crypto.timingSafeEqual` to prevent timing attacks.  
  If the signatures match, the payload is verified; otherwise, the request is rejected with a `400 Invalid signature` response.

### 2. Timestamp Validation to Prevent Replay Attacks

- **Header Timestamp**:  
  The `yaya-timestamp` header provides the event generation time from YaYa Wallet.

- **Checking Timestamp Freshness**:  
  If the difference between the current server time and the header timestamp exceeds **5 minutes** (configurable), the request is rejected to avoid replay attacks.