# Agent Hub Check-in API

Version: v1  
Base URL: `https://unblck.cl/api/agent/v1`

This document describes the UNBLCK Agent API for external Telegram/WhatsApp bots to book hub check-ins on behalf of linked members.

## Authentication

All requests require an API key passed in the `Authorization` header:

```
Authorization: Bearer <AGENT_API_KEY>
```

The API key is a shared secret provided by UNBLCK. Contact the UNBLCK team to receive your key.

## Identity Linking

Before a bot can book on behalf of a member, the member must link their messaging identity to their UNBLCK account.

### Link Flow

1. Member generates a link code in the UNBLCK hub app (`/member/hub/connect`)
2. Member sends the code to your bot in Telegram or WhatsApp
3. Bot calls `POST /api/agent/v1/channel-links` with the code
4. Bot can now make bookings using the member's channel identity



### Channel Identity Headers

After linking, all hub check-in requests must include these headers:

```
X-Channel: telegram | whatsapp
X-Channel-User-Id: <unique user ID from messaging platform>
```

- `X-Channel`: Must be either `"telegram"` or `"whatsapp"`
- `X-Channel-User-Id`: The unique identifier for the user in the messaging platform (e.g., Telegram user ID, WhatsApp phone number)



## Endpoints



### 1. Link Channel Identity

**POST** `/channel-links`

Exchange a link code for a channel binding.

**Request Body:**

```json
{
  "channel": "telegram",
  "channel_user_id": "123456789",
  "code": "ABC123XY"
}
```

**Response (200):**

```json
{
  "ok": true
}
```

**Error Responses:**

- `400` - Invalid link code, code expired, or code already used
- `401` - Invalid API key



### 2. Unlink Channel Identity

**DELETE** `/channel-links`

Remove the link between a channel identity and member account.

**Request Body:**

```json
{
  "channel": "telegram",
  "channel_user_id": "123456789"
}
```

**Response (200):**

```json
{
  "ok": true
}
```



### 3. Get Hub Check-in State

**GET** `/hub-checkins`

Get the member's current booking state, credits, and open days.

**Headers Required:**

- `Authorization: Bearer <AGENT_API_KEY>`
- `X-Channel: telegram | whatsapp`
- `X-Channel-User-Id: <user_id>`

**Response (200):**

```json
{
  "bookings": ["2026-07-18", "2026-07-19"],
  "passes": [
    { "id": "uuid", "date": "2026-07-18" },
    { "id": "uuid", "date": "2026-07-19" }
  ],
  "credits": {
    "total": 3,
    "used": 2,
    "remaining": 1
  },
  "tier": "ambassador",
  "open_days": [1, 2, 3, 4, 5]
}
```

**Field Descriptions:**

- `bookings`: Array of booked dates (YYYY-MM-DD format)
- `passes`: Active passes with IDs (for displaying QR codes)
- `credits`: Weekly credit status
  - `total`: Weekly allowance (3 for Builders, unlimited for Founders)
  - `used`: Credits used this week
  - `remaining`: Credits left
- `tier`: Member tier (`"ambassador"` = Builder, `"stellar_funded"` = Founder)
- `open_days`: Days hub is open (0=Sunday, 1=Monday, ..., 6=Saturday)

**Error Responses:**

- `401` - Invalid API key
- `403` - Channel identity not linked (code: `link_required`)
- `404` - Member profile not found



### 4. Create Hub Check-in

**POST** `/hub-checkins`

Book a hub check-in for a specific date.

**Headers Required:**

- `Authorization: Bearer <AGENT_API_KEY>`
- `X-Channel: telegram | whatsapp`
- `X-Channel-User-Id: <user_id>`

**Request Body:**

```json
{
  "booking_date": "2026-07-18"
}
```

**Response (200):**

```json
{
  "ok": true,
  "booking_id": "uuid"
}
```

**Error Responses:**

- `400` - Booking not allowed, with error code:
  - `credits_exhausted` - Weekly credit limit reached
  - `hub_closed` - Hub not open on requested date
  - `same_day_blocked` - Same-day bookings not allowed
  - `not_current_week` - Builders can only book current week
- `401` - Invalid API key
- `403` - Channel identity not linked (code: `link_required`)



### 5. Cancel Hub Check-in

**DELETE** `/hub-checkins/:date`

Cancel an existing hub check-in.

**Headers Required:**

- `Authorization: Bearer <AGENT_API_KEY>`
- `X-Channel: telegram | whatsapp`
- `X-Channel-User-Id: <user_id>`

**URL Parameters:**

- `date`: Booking date in YYYY-MM-DD format

**Response (200):**

```json
{
  "ok": true
}
```

**Error Responses:**

- `401` - Invalid API key
- `403` - Channel identity not linked (code: `link_required`)
- `500` - Could not cancel booking



## Business Rules



### Builders (tier: "ambassador")

- 3 hub check-in credits per week (Monday-Sunday)
- Can only book days in the current week
- No same-day bookings allowed
- Monday-Friday only (as configured in hub schedule)



### Founders (tier: "stellar_funded")

- Unlimited hub check-in credits
- No same-day bookings allowed
- Monday-Friday only (as configured in hub schedule)



### Timezone

All dates are in Santiago, Chile timezone (America/Santiago).

## Error Codes Reference


| Code                | Meaning                                        | Action                                        |
| ------------------- | ---------------------------------------------- | --------------------------------------------- |
| `link_required`     | User hasn't linked their channel identity      | Prompt user to link account in hub app        |
| `credits_exhausted` | Weekly credits used up (Builders only)         | Inform user they've used all 3 weekly credits |
| `hub_closed`        | Hub not open on requested date                 | Show open days, suggest alternative date      |
| `same_day_blocked`  | Trying to book today                           | Suggest booking for tomorrow or later         |
| `not_current_week`  | Trying to book future week (Builders)          | Builders can only book within current week    |
| `missing_identity`  | Missing X-Channel or X-Channel-User-Id headers | Include both headers in request               |




## Example Bot Flow

```
User: Book Thursday

Bot: Checks if user is linked
  → GET /hub-checkins with user's channel identity
  
If 403 with link_required:
  Bot: "Please link your account first. Get a code from /member/hub/connect"
  
If 200:
  Bot: Parses response, determines Thursday's date
  → POST /hub-checkins with booking_date
  
If 200:
  Bot: "✓ Booked! You're all set for Thursday, July 18."
  
If 400 with credits_exhausted:
  Bot: "You've used all 3 weekly credits. Your credits reset Monday."
```



## Rate Limiting

No explicit rate limits currently enforced, but please be considerate:

- Cache member state responses for at least 30 seconds
- Don't poll the API; only query on user interaction
- Batch operations when possible



## Support

For API key requests, issues, or questions:

- Email: [dev@unblck.io](mailto:dev@unblck.io)
- Include "Agent API" in subject line

