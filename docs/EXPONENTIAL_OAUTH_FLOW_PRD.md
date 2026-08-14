# PRD: OAuth Device Flow for Exponential CLI

**Status:** Proposed  
**Target Repo:** [positonic/exponential-cli](https://github.com/positonic/exponential-cli)  
**GitHub Issue:** [#16](https://github.com/positonic/exponential-cli/issues/16)  
**Author:** Cloud Agent User  
**Date:** 2026-08-14

---

## Problem Statement

The current Exponential CLI authentication requires users to:
1. Manually generate a JWT token from the web UI
2. Copy and paste the token into `exponential auth login --token <jwt>`
3. Repeat this process for every device and environment (MacBook, phone, cloud agents)

This creates friction for:
- **Multi-device workflows** (desktop, mobile, cloud IDEs)
- **AI agents** in ephemeral environments (Cursor Cloud Agents, GitHub Codespaces)
- **Teams** onboarding multiple developers

Users expect the same seamless "login with browser" experience offered by modern CLI tools like:
- GitHub CLI (`gh auth login`)
- AWS CLI (`aws sso login`)
- Vercel CLI (`vercel login`)

---

## Proposed Solution: OAuth 2.0 Device Authorization Flow

Implement [RFC 8628 OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628), the industry standard for authenticating CLI tools and devices without keyboards/browsers.

### User Experience

#### Current Flow (Manual JWT)
```bash
$ exponential auth login --token <paste-long-jwt-here> --api-url https://app.exponential.so
✅ Logged in
```
**Problems:**
- Requires switching to browser, finding the tokens page, generating token, copying it back
- Token is long-lived and must be stored/managed manually
- No cross-device sync

#### Proposed Flow (OAuth Device)
```bash
$ exponential auth login

🔐 Authenticate with Exponential:

   Visit: https://app.exponential.so/auth/device
   Enter code: ABCD-1234

   Or open directly: https://app.exponential.so/auth/device?code=ABCD-1234

⏳ Waiting for authentication...

✅ Authenticated as user@example.com
   Token saved to ~/.config/exponential-cli-nodejs/config.json
```

**User's browser:**
1. Opens link on any device (phone, laptop, tablet)
2. Already logged into Exponential → sees approval screen immediately
3. Clicks "Approve" → done

**Benefits:**
- ✅ One-click authentication using existing session
- ✅ Works on any device with a browser
- ✅ Secure: short-lived tokens, automatic refresh
- ✅ Same flow for desktop, mobile, cloud IDEs, CI/CD

---

## Technical Design

### 1. Device Flow Sequence

```
┌──────────┐                                ┌──────────────┐                 ┌──────────────┐
│   CLI    │                                │ Exponential  │                 │    User      │
│          │                                │   Server     │                 │   Browser    │
└────┬─────┘                                └──────┬───────┘                 └──────┬───────┘
     │                                             │                                │
     │  1. POST /oauth/device/code                │                                │
     ├────────────────────────────────────────────>│                                │
     │                                             │                                │
     │  2. device_code, user_code, verification_uri│                                │
     │<────────────────────────────────────────────┤                                │
     │                                             │                                │
     │  3. Display verification_uri + user_code    │                                │
     │     to user                                 │                                │
     │                                             │                                │
     │                                             │  4. User visits verification_uri│
     │                                             │<─────────────────────────────────┤
     │                                             │                                │
     │                                             │  5. Enter user_code (or auto-fill)│
     │                                             │<─────────────────────────────────┤
     │                                             │                                │
     │                                             │  6. Approve device access      │
     │                                             │<─────────────────────────────────┤
     │                                             │                                │
     │  7. POST /oauth/token (polling)            │                                │
     ├────────────────────────────────────────────>│                                │
     │                                             │                                │
     │  8. access_token, refresh_token            │                                │
     │<────────────────────────────────────────────┤                                │
     │                                             │                                │
     │  9. ✅ Authenticated                        │                                │
     │                                             │                                │
```

### 2. API Endpoints (Server-Side)

#### `POST /oauth/device/code`
Initiates device flow and returns a user code.

**Request:**
```json
{
  "client_id": "exponential-cli",
  "scope": "actions:read actions:write projects:read workspaces:read"
}
```

**Response:**
```json
{
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",
  "user_code": "ABCD-1234",
  "verification_uri": "https://app.exponential.so/auth/device",
  "verification_uri_complete": "https://app.exponential.so/auth/device?code=ABCD-1234",
  "expires_in": 900,
  "interval": 5
}
```

#### `POST /oauth/token`
CLI polls this endpoint until user approves.

**Request (polling):**
```json
{
  "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",
  "client_id": "exponential-cli"
}
```

**Response (pending):**
```json
{
  "error": "authorization_pending"
}
```

**Response (approved):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "def50200...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "actions:read actions:write projects:read workspaces:read"
}
```

#### `POST /oauth/token` (refresh)
When access token expires, use refresh token to get a new one.

**Request:**
```json
{
  "grant_type": "refresh_token",
  "refresh_token": "def50200...",
  "client_id": "exponential-cli"
}
```

### 3. CLI Implementation

**New Command:**
```bash
exponential auth login           # Device flow (default)
exponential auth login --token   # Legacy JWT flow (keep for backward compat)
exponential auth refresh         # Manually refresh token
exponential auth revoke          # Revoke current token
```

**Config Storage:**
```json
{
  "apiUrl": "https://app.exponential.so",
  "accessToken": "eyJhbGci...",
  "refreshToken": "def50200...",
  "expiresAt": "2026-08-14T23:52:00.000Z",
  "authMethod": "oauth"
}
```

**Token Refresh Logic:**
- CLI checks if `accessToken` is expired before each API call
- If expired, automatically refreshes using `refreshToken`
- If refresh fails, prompt user to re-authenticate
- No user interruption for valid refresh tokens

### 4. Web UI (Verification Page)

**Route:** `/auth/device`

**Query Params:**
- `?code=ABCD-1234` (optional, pre-fills the input)

**UI Components:**
1. **Input field** for user code (6-8 characters, formatted as `ABCD-1234`)
2. **Submit button** → validates code, shows approval screen
3. **Approval screen:**
   - Device details: "Exponential CLI wants to access your account"
   - Permissions: "Read and write actions, projects, and workspaces"
   - **Approve** / **Deny** buttons
4. **Success screen:** "Device authenticated! You can close this window."

**Security:**
- User must be logged in to see this page
- User code expires in 15 minutes (configurable)
- Rate limiting on code verification attempts
- Log device approvals in account audit log

---

## Implementation Phases

### Phase 1: Server-Side OAuth Endpoints (Backend)
**Estimated Effort:** Medium  
**Dependencies:** OAuth library (e.g., `oauth2-server`, `node-oauth2-server`)

- [ ] Implement `POST /oauth/device/code`
- [ ] Implement `POST /oauth/token` (device grant)
- [ ] Implement `POST /oauth/token` (refresh grant)
- [ ] Create database tables for device codes, refresh tokens
- [ ] Add token expiration and cleanup jobs

### Phase 2: Web UI for Device Verification
**Estimated Effort:** Small  
**Dependencies:** Phase 1 complete

- [ ] Build `/auth/device` page
- [ ] User code input and validation
- [ ] Approval/denial flow
- [ ] Success/error states

### Phase 3: CLI Device Flow
**Estimated Effort:** Medium  
**Dependencies:** Phase 1 & 2 complete

- [ ] Implement `exponential auth login` device flow
- [ ] Polling logic with exponential backoff
- [ ] Display verification URL and user code
- [ ] Automatic token refresh on API calls
- [ ] Keep legacy `--token` flag for backward compatibility

### Phase 4: Enhanced UX
**Estimated Effort:** Small  
**Dependencies:** Phase 3 complete

- [ ] Open browser automatically (`exponential auth login --browser`)
- [ ] QR code display for mobile scanning
- [ ] Token revocation command (`exponential auth revoke`)
- [ ] Account switching (`exponential auth switch`)

---

## Success Metrics

### User Experience
- **Time to authenticate:** < 30 seconds (down from ~2 minutes)
- **Setup steps:** 2 steps (down from 5 steps)
- **Error rate:** < 5% failed authentications

### Adoption
- **Device flow adoption:** > 80% of new CLI users within 3 months
- **Support tickets:** 50% reduction in auth-related support requests

### Security
- **Token lifetime:** Access tokens expire in 1 hour (vs. never for JWT)
- **Audit logs:** All device approvals logged with IP, timestamp, device info

---

## Alternatives Considered

### 1. **Magic Link via Email**
**Pros:** No new server endpoints  
**Cons:** Requires email client, slower UX, email deliverability issues

### 2. **QR Code Only**
**Pros:** Great for mobile-first users  
**Cons:** Desktop users still need to switch devices, not accessible

### 3. **Keep JWT-Only**
**Pros:** No development work  
**Cons:** Poor UX, manual token management, security risks

**Decision:** OAuth Device Flow is the industry standard and provides the best balance of UX, security, and developer experience.

---

## Security Considerations

### Threats
1. **User code brute force:** Mitigated by rate limiting (10 attempts per IP per hour)
2. **Token theft:** Mitigated by short-lived access tokens (1 hour), refresh token rotation
3. **Phishing verification URLs:** Mitigated by clear domain display (`app.exponential.so`)

### Best Practices
- Store tokens encrypted at rest (CLI config files)
- Use HTTPS for all OAuth endpoints
- Log all device authorization events
- Allow users to revoke tokens from web UI (`/settings/devices`)
- Implement refresh token rotation (RFC 6749)

---

## Open Questions

1. **Token expiration:** What's the ideal lifetime for access tokens (1h, 8h, 24h)?  
   *Recommendation: 1 hour for security, with automatic refresh*

2. **Refresh token rotation:** Should refresh tokens rotate on each use?  
   *Recommendation: Yes, for enhanced security*

3. **Device limit:** Should users have a max number of authenticated devices?  
   *Recommendation: 10 devices, with oldest auto-revoked*

4. **Offline support:** How should CLI behave with no internet during token refresh?  
   *Recommendation: Graceful degradation, allow reads from cache, queue writes*

---

## References

- [RFC 8628: OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- [GitHub CLI Device Flow](https://cli.github.com/manual/gh_auth_login)
- [AWS SSO CLI Login](https://docs.aws.amazon.com/cli/latest/userguide/sso-configure-profile-token.html)
- [Google OAuth Device Flow](https://developers.google.com/identity/protocols/oauth2/limited-input-device)

---

## Appendix: CLI Code Examples

### Device Flow Authentication (Node.js)

```javascript
async function deviceFlowLogin() {
  // 1. Request device code
  const deviceRes = await fetch('https://app.exponential.so/oauth/device/code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: 'exponential-cli',
      scope: 'actions:read actions:write projects:read workspaces:read'
    })
  });
  const deviceData = await deviceRes.json();

  // 2. Display instructions to user
  console.log('\n🔐 Authenticate with Exponential:\n');
  console.log(`   Visit: ${deviceData.verification_uri}`);
  console.log(`   Enter code: ${deviceData.user_code}\n`);
  console.log(`   Or open directly: ${deviceData.verification_uri_complete}\n`);
  console.log('⏳ Waiting for authentication...\n');

  // 3. Poll for token
  const startTime = Date.now();
  const expiresIn = deviceData.expires_in * 1000;
  const interval = deviceData.interval * 1000;

  while (Date.now() - startTime < expiresIn) {
    await sleep(interval);

    const tokenRes = await fetch('https://app.exponential.so/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: deviceData.device_code,
        client_id: 'exponential-cli'
      })
    });

    if (tokenRes.status === 200) {
      const tokenData = await tokenRes.json();
      
      // 4. Save token
      await saveConfig({
        apiUrl: 'https://app.exponential.so',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        authMethod: 'oauth'
      });

      console.log('✅ Authenticated successfully!');
      return tokenData;
    }

    const error = await tokenRes.json();
    if (error.error === 'authorization_pending') {
      continue; // Keep polling
    } else if (error.error === 'slow_down') {
      interval += 5000; // Increase polling interval
    } else {
      throw new Error(`Authentication failed: ${error.error}`);
    }
  }

  throw new Error('Authentication timed out');
}
```

### Automatic Token Refresh

```javascript
async function makeAuthenticatedRequest(endpoint, options = {}) {
  const config = await loadConfig();
  
  // Check if token is expired
  if (new Date(config.expiresAt) <= new Date()) {
    console.log('🔄 Refreshing access token...');
    
    const tokenRes = await fetch('https://app.exponential.so/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: config.refreshToken,
        client_id: 'exponential-cli'
      })
    });

    if (tokenRes.status !== 200) {
      console.error('❌ Failed to refresh token. Please run: exponential auth login');
      process.exit(1);
    }

    const tokenData = await tokenRes.json();
    
    // Update config with new tokens
    await saveConfig({
      ...config,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    });

    config.accessToken = tokenData.access_token;
  }

  // Make the actual API call
  return fetch(`https://app.exponential.so${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${config.accessToken}`
    }
  });
}
```

---

**Next Steps:**
1. Review PRD with Exponential team
2. Prioritize in product roadmap
3. Assign to engineering sprint
4. Create tracking issue in GitHub

---

*This PRD was generated as part of improving CLI authentication for cloud environments and multi-device workflows.*
