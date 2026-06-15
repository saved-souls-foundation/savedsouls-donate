#!/usr/bin/env node
/**
 * Script 4 — upload-tiktok (OAuth2 + Content Posting API v2)
 *
 * Sandbox / unaudited apps: posts zijn SELF_ONLY (privé op TikTok).
 * Registreer redirect URI in TikTok Developer Portal:
 *   http://localhost:3456/callback
 *
 * Stap 1 — OAuth met PKCE / Desktop flow (browser opent automatisch):
 *   node scripts/tiktok-pipeline/upload-tiktok.mjs --auth
 *   Redirect URI in Developer Portal: http://localhost:3456/callback
 *
 * Stap 2 — testupload (1–2 video's uit upload-queue.csv):
 *   node scripts/tiktok-pipeline/upload-tiktok.mjs --test
 *   node scripts/tiktok-pipeline/upload-tiktok.mjs --test --limit 2
 *
 * Vereist in .env.local (project root):
 *   TIKTOK_CLIENT_KEY=...
 *   TIKTOK_CLIENT_SECRET=...
 */

import { createServer } from "http";
import { exec } from "child_process";
import { promisify } from "util";
import { access, readFile, writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash, randomBytes } from "crypto";

const execAsync = promisify(exec);

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..", "..");
const ENV_FILE = join(PROJECT_ROOT, ".env.local");

const BASE_DIR = "/Users/mike/Documents/savedsouls-tiktok";
const TOKEN_FILE = join(BASE_DIR, "tiktok-token.json");
const VIDEOS_DIR = join(BASE_DIR, "videos");
const UPLOAD_QUEUE = join(BASE_DIR, "upload-queue.csv");
const UPLOAD_STATUS = join(BASE_DIR, "upload-status.json");
const UPLOAD_DELAY_MS = 10_000;

const API_BASE = "https://open.tiktokapis.com";
const AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const REDIRECT_URI = "http://localhost:3456/callback";
const OAUTH_PORT = 3456;
const OAUTH_SCOPES = ["user.info.basic", "video.publish"].join(",");

const SANDBOX = true;
const PRIVACY_LEVEL = SANDBOX ? "SELF_ONLY" : "PUBLIC_TO_EVERYONE";

const TEST_VIDEO = join(VIDEOS_DIR, "307.mp4");
const TEST_CAPTION =
  "Meet Amber! 🐾 Looking for a forever home 🏠 savedsouls-foundation.org/adopt";
const TEST_HASHTAGS = "#rescuedog #adoptdontshop #ThailandRescue #savedsouls";

const runAuth = process.argv.includes("--auth");
const runTest = process.argv.includes("--test");

function parseLimitArg() {
  const idx = process.argv.indexOf("--limit");
  if (idx === -1) return 1;
  const n = Number(process.argv[idx + 1]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

const MIN_CHUNK_BYTES = 5 * 1024 * 1024;
const DEFAULT_CHUNK_BYTES = 10 * 1024 * 1024;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((cell) => cell.length > 0)) rows.push(row);
  }

  return rows;
}

async function loadUploadQueue() {
  const raw = await readFile(UPLOAD_QUEUE, "utf8");
  const rows = parseCsv(raw);
  if (rows.length < 2) return [];

  const header = rows[0];
  return rows.slice(1).map((cells) => {
    const entry = {};
    for (let i = 0; i < header.length; i++) {
      entry[header[i]] = cells[i] ?? "";
    }
    return entry;
  });
}

async function loadUploadStatus() {
  if (!(await fileExists(UPLOAD_STATUS))) return {};
  try {
    return JSON.parse(await readFile(UPLOAD_STATUS, "utf8"));
  } catch {
    return {};
  }
}

async function saveUploadStatus(status) {
  await writeFile(UPLOAD_STATUS, JSON.stringify(status, null, 2) + "\n", "utf8");
}

function log(label, data) {
  console.log(`\n=== ${label} ===`);
  if (data !== undefined) {
    console.log(typeof data === "string" ? data : JSON.stringify(data, null, 2));
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** RFC 7636 base64url (geen padding). */
function base64url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** PKCE S256: 32 random bytes → code_verifier, SHA-256 → code_challenge. */
function generatePkcePair() {
  const codeVerifier = base64url(randomBytes(32));
  const codeChallenge = base64url(
    createHash("sha256").update(codeVerifier).digest()
  );
  return { codeVerifier, codeChallenge };
}

async function loadEnvFile() {
  try {
    const content = await readFile(ENV_FILE, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
  }
}

function getCredentials() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    throw new Error(
      `TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET ontbreken in ${ENV_FILE}`
    );
  }
  return { clientKey, clientSecret };
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function loadToken() {
  if (!(await fileExists(TOKEN_FILE))) return null;
  const raw = await readFile(TOKEN_FILE, "utf8");
  return JSON.parse(raw);
}

async function saveToken(tokenData) {
  await writeFile(TOKEN_FILE, JSON.stringify(tokenData, null, 2) + "\n", "utf8");
  log("Token opgeslagen", TOKEN_FILE);
}

async function exchangeToken(bodyParams) {
  const { clientKey, clientSecret } = getCredentials();
  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: clientSecret,
    ...bodyParams,
  });

  log("Token exchange request", Object.fromEntries(body.entries()));

  const res = await fetch(`${API_BASE}/v2/oauth/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body,
  });

  const json = await res.json();
  log("Token exchange response", json);

  if (!res.ok || (json.error?.code && json.error.code !== "ok")) {
    throw new Error(
      json.error?.message ||
        json.error_description ||
        json.message ||
        `Token exchange failed (${res.status})`
    );
  }

  const data = json.data ?? json;
  const expiresIn = Number(data.expires_in || 0);
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    open_id: data.open_id,
    scope: data.scope,
    token_type: data.token_type || "Bearer",
    expires_at: expiresIn ? Date.now() + expiresIn * 1000 : null,
    saved_at: new Date().toISOString(),
  };
}

async function refreshAccessToken(refreshToken) {
  return exchangeToken({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

async function ensureAccessToken() {
  let token = await loadToken();
  if (!token?.access_token) {
    throw new Error("Geen token gevonden. Draai eerst: node upload-tiktok.mjs --auth");
  }

  const expiresAt = token.expires_at ? Number(token.expires_at) : 0;
  const needsRefresh = expiresAt && Date.now() > expiresAt - 60_000;

  if (needsRefresh && token.refresh_token) {
    log("Access token verlopen — refresh…");
    token = await refreshAccessToken(token.refresh_token);
    await saveToken(token);
  }

  return token;
}

function buildAuthUrl(state, codeChallenge) {
  const { clientKey } = getCredentials();
  const params = new URLSearchParams({
    client_key: clientKey,
    response_type: "code",
    scope: OAUTH_SCOPES,
    redirect_uri: REDIRECT_URI,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

async function openBrowser(url) {
  try {
    if (process.platform === "darwin") {
      await execAsync(`open ${JSON.stringify(url)}`);
    } else if (process.platform === "win32") {
      await execAsync(`start ${JSON.stringify(url)}`);
    } else {
      await execAsync(`xdg-open ${JSON.stringify(url)}`);
    }
    log("Browser geopend");
  } catch {
    log("Open deze URL handmatig in je browser", url);
  }
}

async function runOAuthFlow() {
  const state = randomBytes(16).toString("hex");
  const { codeVerifier, codeChallenge } = generatePkcePair();
  const authUrl = buildAuthUrl(state, codeChallenge);

  log("OAuth start", {
    redirect_uri: REDIRECT_URI,
    scopes: OAUTH_SCOPES,
    sandbox: SANDBOX,
    pkce: "S256",
  });
  log("Authorization URL", authUrl);

  const code = await new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const url = new URL(req.url || "/", `http://localhost:${OAUTH_PORT}`);

        if (url.pathname !== "/callback") {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Not found");
          return;
        }

        const error = url.searchParams.get("error");
        const returnedState = url.searchParams.get("state");
        const authCode = url.searchParams.get("code");

        log("OAuth callback ontvangen", {
          error,
          state: returnedState,
          code: authCode ? `${authCode.slice(0, 8)}…` : null,
        });

        if (error) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(`<h1>OAuth mislukt</h1><p>${error}</p>`);
          server.close();
          reject(new Error(`OAuth error: ${error}`));
          return;
        }

        if (returnedState !== state) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<h1>OAuth mislukt</h1><p>State mismatch</p>");
          server.close();
          reject(new Error("OAuth state mismatch"));
          return;
        }

        if (!authCode) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end("<h1>OAuth mislukt</h1><p>Geen authorization code</p>");
          server.close();
          reject(new Error("Geen authorization code ontvangen"));
          return;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>✅ TikTok gekoppeld</h1><p>Je kunt dit venster sluiten en terug naar de terminal gaan.</p>"
        );
        server.close();
        resolve(authCode);
      } catch (err) {
        server.close();
        reject(err);
      }
    });

    server.listen(OAUTH_PORT, "127.0.0.1", () => {
      log(`Lokale server luistert op http://localhost:${OAUTH_PORT}/callback`);
      openBrowser(authUrl);
    });

    server.on("error", reject);
    setTimeout(() => {
      server.close();
      reject(new Error("OAuth timeout (5 minuten)"));
    }, 5 * 60_000);
  });

  const token = await exchangeToken({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  await saveToken(token);
  return token;
}

async function apiRequest(path, { method = "GET", accessToken, body } = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  let payload;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json; charset=UTF-8";
    payload = JSON.stringify(body);
  }

  log(`${method} ${path}`, body ?? null);

  const res = await fetch(url, { method, headers, body: payload });
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }

  log(`Response ${res.status}`, json);

  if (!res.ok) {
    throw new Error(json.error?.message || json.message || `API ${res.status}`);
  }
  if (json.error?.code && json.error.code !== "ok") {
    throw new Error(json.error.message || json.error.code);
  }

  return json;
}

async function queryCreatorInfo(accessToken) {
  return apiRequest("/v2/post/publish/creator_info/query/", {
    method: "POST",
    accessToken,
  });
}

function buildChunkPlan(videoSize) {
  if (videoSize <= MIN_CHUNK_BYTES) {
    return {
      video_size: videoSize,
      chunk_size: videoSize,
      total_chunk_count: 1,
    };
  }

  const chunk_size = DEFAULT_CHUNK_BYTES;
  const total_chunk_count = Math.ceil(videoSize / chunk_size);
  return { video_size: videoSize, chunk_size, total_chunk_count };
}

async function initVideoUpload(accessToken, videoSize, caption) {
  const sourceInfo = {
    source: "FILE_UPLOAD",
    ...buildChunkPlan(videoSize),
  };

  return apiRequest("/v2/post/publish/video/init/", {
    method: "POST",
    accessToken,
    body: {
      post_info: {
        title: caption,
        privacy_level: PRIVACY_LEVEL,
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info: sourceInfo,
    },
  });
}

async function uploadVideoChunks(uploadUrl, videoBuffer, chunkPlan) {
  const { video_size, chunk_size, total_chunk_count } = chunkPlan;
  log("Upload chunks", { uploadUrl, video_size, chunk_size, total_chunk_count });

  for (let i = 0; i < total_chunk_count; i++) {
    const start = i * chunk_size;
    const end = Math.min(start + chunk_size, video_size) - 1;
    const chunk = videoBuffer.subarray(start, end + 1);

    log(`Chunk ${i + 1}/${total_chunk_count}`, {
      range: `bytes ${start}-${end}/${video_size}`,
      bytes: chunk.length,
    });

    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(chunk.length),
        "Content-Range": `bytes ${start}-${end}/${video_size}`,
      },
      body: chunk,
    });

    const text = await res.text();
    log(`Chunk ${i + 1} response ${res.status}`, text || "(empty)");

    if (!res.ok) {
      throw new Error(`Chunk upload failed (${res.status}): ${text}`);
    }
  }
}

async function fetchPublishStatus(accessToken, publishId) {
  return apiRequest("/v2/post/publish/status/fetch/", {
    method: "POST",
    accessToken,
    body: { publish_id: publishId },
  });
}

async function pollPublishStatus(accessToken, publishId) {
  const terminal = new Set([
    "PUBLISH_COMPLETE",
    "FAILED",
    "SEND_TO_USER_INBOX",
  ]);

  for (let attempt = 1; attempt <= 60; attempt++) {
    const json = await fetchPublishStatus(accessToken, publishId);
    const status = json.data?.status;
    log(`Publish status (poging ${attempt})`, json.data);

    if (terminal.has(status)) {
      return json.data;
    }

    await sleep(5000);
  }

  throw new Error("Publish status timeout na 5 minuten");
}

async function publishComment(accessToken, videoId, text) {
  return apiRequest("/v2/comment/publish/", {
    method: "POST",
    accessToken,
    body: {
      video_id: String(videoId),
      text,
    },
  });
}

async function uploadSingleVideo(accessToken, { videoPath, caption, hashtags, label }) {
  if (!(await fileExists(videoPath))) {
    throw new Error(`Video niet gevonden: ${videoPath}`);
  }

  const videoBuffer = await readFile(videoPath);
  const videoSize = videoBuffer.length;
  const chunkPlan = buildChunkPlan(videoSize);

  log(`Upload start: ${label}`, {
    video: videoPath,
    bytes: videoSize,
    caption,
    hashtags,
    privacy_level: PRIVACY_LEVEL,
    sandbox: SANDBOX,
  });

  const initRes = await initVideoUpload(accessToken, videoSize, caption);
  const publishId = initRes.data?.publish_id;
  const uploadUrl = initRes.data?.upload_url;

  if (!publishId || !uploadUrl) {
    throw new Error("Init response mist publish_id of upload_url");
  }

  await uploadVideoChunks(uploadUrl, videoBuffer, chunkPlan);

  log("Upload voltooid — status opvragen…");
  const finalStatus = await pollPublishStatus(accessToken, publishId);

  let commentResult = null;
  const postIds = finalStatus.publicaly_available_post_id || [];

  if (postIds.length > 0 && hashtags) {
    try {
      commentResult = await publishComment(accessToken, postIds[0], hashtags);
    } catch (err) {
      log("Comment mislukt (kan bij SELF_ONLY / sandbox)", {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  } else if (hashtags) {
    log(
      "Geen publicaly_available_post_id — comment overgeslagen",
      "Hashtags kunnen in caption staan of later handmatig."
    );
  }

  const result = {
    publish_id: publishId,
    status: finalStatus.status,
    fail_reason: finalStatus.fail_reason || null,
    post_ids: postIds,
    comment: commentResult?.data || null,
  };

  log(`Upload resultaat: ${label}`, result);

  if (finalStatus.status === "FAILED") {
    throw new Error(finalStatus.fail_reason || "Publish FAILED");
  }

  return result;
}

async function runTestBatch(accessToken, limit) {
  const queue = await loadUploadQueue();
  if (queue.length === 0) {
    throw new Error(`Geen rijen in ${UPLOAD_QUEUE}`);
  }

  const status = await loadUploadStatus();
  let creatorChecked = false;
  const batch = [];
  let skipped = 0;

  for (const row of queue) {
    if (batch.length >= limit) break;

    const filename = row.filename?.trim();
    if (!filename) continue;

    const id = filename.replace(/\.mp4$/i, "");
    if (status[id]?.status === "ok") {
      skipped++;
      continue;
    }

    const videoPath = join(VIDEOS_DIR, filename);
    if (!(await fileExists(videoPath))) {
      log("Skip — geen videobestand", videoPath);
      continue;
    }

    batch.push({
      id,
      filename,
      videoPath,
      caption: row.caption?.trim() || "",
      hashtags: row.hashtags?.trim() || "",
      label: `${row.animal_name || id} (${filename})`,
    });
  }

  log("Test batch", {
    limit,
    selected: batch.length,
    skipped_already_uploaded: skipped,
    queue_total: queue.length,
  });

  if (batch.length === 0) {
    console.log("Geen video's om te uploaden (alles al gedaan of geen bestanden).");
    return;
  }

  for (let i = 0; i < batch.length; i++) {
    const item = batch[i];
    console.log(`\n▶️  Video ${i + 1}/${batch.length}: ${item.label}`);

    if (!creatorChecked) {
      const creatorInfo = await queryCreatorInfo(accessToken);
      const privacyOptions =
        creatorInfo.data?.privacy_level_options ||
        creatorInfo.data?.creator_info?.privacy_level_options;

      if (privacyOptions && !privacyOptions.includes(PRIVACY_LEVEL)) {
        log("Waarschuwing", {
          message: `${PRIVACY_LEVEL} niet in toegestane opties`,
          privacyOptions,
        });
      }
      creatorChecked = true;
    }

    try {
      const result = await uploadSingleVideo(accessToken, item);
      status[item.id] = {
        status: "ok",
        filename: item.filename,
        animal_name: item.label,
        publish_id: result.publish_id,
        tiktok_status: result.status,
        uploaded_at: new Date().toISOString(),
      };
      await saveUploadStatus(status);
      console.log(`   ✅ ${item.filename}`);
    } catch (err) {
      status[item.id] = {
        status: "failed",
        filename: item.filename,
        error: err instanceof Error ? err.message : String(err),
        failed_at: new Date().toISOString(),
      };
      await saveUploadStatus(status);
      console.error(`   ❌ ${item.label}:`, err instanceof Error ? err.message : err);
    }

    if (i < batch.length - 1) {
      log(`Wacht ${UPLOAD_DELAY_MS / 1000}s (rate limit)…`);
      await sleep(UPLOAD_DELAY_MS);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Verwerkt: ${batch.length}`);
  console.log(`Status:   ${UPLOAD_STATUS}`);
}

async function uploadTestVideo(accessToken) {
  return uploadSingleVideo(accessToken, {
    videoPath: TEST_VIDEO,
    caption: TEST_CAPTION,
    hashtags: TEST_HASHTAGS,
    label: "Amber (307.mp4)",
  });
}

async function main() {
  await loadEnvFile();
  getCredentials();

  console.log("📤 Saved Souls — TikTok upload\n");
  log("Config", {
    sandbox: SANDBOX,
    privacy_level: PRIVACY_LEVEL,
    token_file: TOKEN_FILE,
    upload_queue: UPLOAD_QUEUE,
  });

  if (runAuth) {
    await runOAuthFlow();
    console.log("\n✅ OAuth klaar. Draai daarna:");
    console.log("   node scripts/tiktok-pipeline/upload-tiktok.mjs --test --limit 2");
    return;
  }

  if (runTest) {
    const token = await ensureAccessToken();
    const limit = parseLimitArg();
    if (limit === 1 && process.argv.indexOf("--limit") === -1) {
      await uploadTestVideo(token.access_token);
    } else {
      await runTestBatch(token.access_token, limit);
    }
    console.log("\n✅ Test upload afgerond.");
    return;
  }

  console.log("Gebruik:");
  console.log("  node scripts/tiktok-pipeline/upload-tiktok.mjs --auth              # OAuth2 flow");
  console.log("  node scripts/tiktok-pipeline/upload-tiktok.mjs --test              # 1 video (Amber)");
  console.log("  node scripts/tiktok-pipeline/upload-tiktok.mjs --test --limit 2    # 2 video's uit CSV");
}

main().catch((err) => {
  console.error("\n❌ upload-tiktok failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
