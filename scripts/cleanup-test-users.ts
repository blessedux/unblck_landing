/**
 * Cleanup script for test users
 * Deletes all test users and their associated data
 * 
 * Run with: npm run cleanup:test-users
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function cleanupTestUsers() {
  console.log('🧹 Cleaning up test users...\n');

  const testEmails = [
    'admin@test.unblck.dev',
    'founder@test.unblck.dev',
    'builder@test.unblck.dev',
  ];

  for (const email of testEmails) {
    console.log(`Deleting: ${email}`);

    // Get user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error(`  ❌ Error listing users: ${listError.message}`);
      continue;
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      console.log(`  ⚠️  User not found, skipping...`);
      continue;
    }

    // Delete auth user (this will cascade delete related records)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error(`  ❌ Delete error: ${deleteError.message}`);
      continue;
    }

    console.log(`  ✓ Deleted successfully`);
  }

  console.log('\n✅ Cleanup complete!\n');
}

cleanupTestUsers()
  .then(() => {
    console.log('You can now run: npm run seed:test-users');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
