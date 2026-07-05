# Test Users Seed Script

This script creates test users that bypass email authentication for development and testing.

## Prerequisites

1. Make sure you have the following in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. Run all migrations to ensure database schema is up to date:
```bash
# Apply migrations in Supabase dashboard or via CLI
```

## Running the Seed Script

```bash
npm run seed:test-users
```

## Test Users Created

The script creates 3 test users:

### 1. Admin User
- **Email:** `admin@test.unblck.dev`
- **Password:** `admin123`
- **Access:** Full admin dashboard access
- **Note:** Add this email to `ADMIN_EMAILS` in your `.env.local`

### 2. Founder User  
- **Email:** `founder@test.unblck.dev`
- **Password:** `founder123`
- **Tier:** Founder (Stellar-funded)
- **Access:** Unlimited hub access, all features

### 3. Builder User
- **Email:** `builder@test.unblck.dev`  
- **Password:** `builder123`
- **Tier:** Builder
- **Access:** 3 days/week hub access

## What Gets Created

For each user:
1. ✅ Auth user (email verified, no confirmation needed)
2. ✅ Hub access application (approved)
3. ✅ Member profile (with appropriate tier)
4. ✅ Passport verified
5. ✅ Terms accepted

## Usage

After running the seed script, you can:
- Login directly at `/login` with the credentials above
- No email confirmation required
- Immediate access to hub features
- Test booking, room reservations, tour claims, etc.

## Cleanup

To remove test users, use Supabase dashboard:
1. Go to Authentication > Users
2. Delete users with `@test.unblck.dev` emails
3. Associated data will be cascade deleted

## Troubleshooting

If you get errors:
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check that migrations are applied
- Verify database schema matches expected structure
- Users might already exist - delete them first
