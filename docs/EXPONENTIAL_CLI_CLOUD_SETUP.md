# Exponential CLI Setup for Cursor Cloud Agents

This document describes how to use the [Exponential CLI](https://github.com/positonic/exponential-cli) in Cursor Cloud Agent environments.

## Overview

The Exponential CLI allows you to interact with your Exponential productivity workspace from the command line. This is useful for:
- Managing actions, projects, and goals via AI agents
- Automating task creation and updates
- Syncing work across teams programmatically

## Current Authentication Flow (Manual JWT)

### Prerequisites
1. An active Exponential account at [app.exponential.so](https://app.exponential.so)
2. A JWT API token from Exponential

### Step 1: Generate API Token

1. Log into your Exponential account
2. Navigate to `/tokens` (https://app.exponential.so/tokens)
3. Create a new API key with type **"JWT"**
4. Copy the generated token (you'll need it for the next step)

### Step 2: Add Token to Cursor Secrets

Since Cloud Agents are ephemeral and can't persist local config files across runs, you need to store your token as a secret:

1. Go to [Cursor Dashboard](https://cursor.com/settings) → **Cloud Agents** → **Secrets**
2. Click **Add Secret**
3. Name: `EXPONENTIAL_JWT_TOKEN`
4. Value: Paste your JWT token from Step 1
5. Scope: Choose **User** (available to all your cloud agents) or **Repository** (only for specific repos)
6. Save the secret

**Note:** Secrets are injected as environment variables and persist across all future Cloud Agent runs.

### Step 3: Using the CLI in Cloud Agents

The CLI can be run via `npx` without global installation (recommended for cloud environments):

```bash
# Check if authenticated
npx exponential-cli auth status

# Login using the secret token (one-time per agent session)
npx exponential-cli auth login \
  --token "$EXPONENTIAL_JWT_TOKEN" \
  --api-url https://app.exponential.so

# Verify authentication
npx exponential-cli auth whoami

# Example: List your actions
npx exponential-cli actions list

# Example: What's on your plate today
npx exponential-cli actions today

# Example: List projects
npx exponential-cli projects list --json
```

### Step 4: Automating Authentication in Cloud Agents

To avoid manual login on every agent session, you can create a setup script:

**File: `/workspace/scripts/setup-exponential.sh`**

```bash
#!/bin/bash
# Auto-authenticate Exponential CLI if token is available

if [ -z "$EXPONENTIAL_JWT_TOKEN" ]; then
  echo "⚠️  EXPONENTIAL_JWT_TOKEN not found. Add it to Cursor Dashboard → Cloud Agents → Secrets"
  exit 1
fi

echo "🔐 Authenticating Exponential CLI..."
npx exponential-cli auth login \
  --token "$EXPONENTIAL_JWT_TOKEN" \
  --api-url https://app.exponential.so

if [ $? -eq 0 ]; then
  echo "✅ Exponential CLI authenticated successfully"
  npx exponential-cli auth whoami
else
  echo "❌ Authentication failed"
  exit 1
fi
```

Make it executable:
```bash
chmod +x scripts/setup-exponential.sh
```

Then the agent can run it at the start of each session:
```bash
./scripts/setup-exponential.sh
```

## Limitations of Current Flow

### ❌ **Not Device/Browser-Friendly**
- Requires manually copying JWT tokens from web UI
- No OAuth or browser-based login flow
- Tokens must be manually rotated if they expire

### ❌ **Poor Cross-Device UX**
- Each device (MacBook, phone, cloud agent) needs separate token setup
- No automatic sync of authentication state
- Can't easily "login with browser" and sync across all devices

### ❌ **Security Concerns**
- Long-lived JWT tokens are stored as plaintext secrets
- No automatic token refresh mechanism
- Token compromise affects all devices using that token

## Proposed Better Flow (Feature Request)

See GitHub issue: [#16 - OAuth Device Flow for Browser-Based Authentication](https://github.com/positonic/exponential-cli/issues/16)

### Ideal User Experience

**User prompts in Cursor:**
> "Connect my Exponential account"

**Agent responds:**
```
🔐 Authenticate with Exponential:
   → https://app.exponential.so/auth/device?code=ABC-123

Open this link on any device (phone, laptop, etc.) and approve the connection.
Waiting for authentication... ⏳
```

**User clicks link, logs in via browser (using existing session), approves**

**Agent:**
```
✅ Authenticated as [user@email.com]
   Synced across all your devices and Cursor sessions.
```

### Benefits of OAuth Device Flow
- ✅ **One-click authentication** via browser
- ✅ **Automatic sync** across MacBook, phone, cloud agents
- ✅ **Reuses existing login session** (Google, email, SSO, etc.)
- ✅ **Secure token management** (short-lived access tokens, refresh tokens)
- ✅ **Same UX as GitHub CLI, AWS CLI, etc.**

## Resources

- **Exponential CLI GitHub:** https://github.com/positonic/exponential-cli
- **Exponential App:** https://app.exponential.so
- **API Documentation:** (link TBD)

## Troubleshooting

### "Authentication Status: No"
Run the login command with your token:
```bash
npx exponential-cli auth login --token "$EXPONENTIAL_JWT_TOKEN" --api-url https://app.exponential.so
```

### "EXPONENTIAL_JWT_TOKEN not found"
You need to add the secret in Cursor Dashboard → Cloud Agents → Secrets.

### "Config Path: /home/ubuntu/.config/exponential-cli-nodejs/config.json"
This is the local config file where tokens are stored. In cloud environments, this is ephemeral and resets with each new agent session. That's why we use environment variable secrets instead.

### Permission Denied for Global Install
Don't use `npm install -g` in cloud agents (requires sudo). Use `npx exponential-cli` instead, which downloads and runs the CLI on-demand.

---

**Last Updated:** 2026-08-14
