/**
 * Verify test users script
 * Checks if test users and their data exist
 * 
 * Run with: npm run verify:test-users
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function verifyTestUsers() {
  console.log('🔍 Verifying test users...\n');

  const testEmails = [
    { email: 'admin@test.unblck.dev', role: 'Admin' },
    { email: 'founder@test.unblck.dev', role: 'Founder' },
    { email: 'builder@test.unblck.dev', role: 'Builder' },
  ];

  for (const testUser of testEmails) {
    console.log(`\n${testUser.role}: ${testUser.email}`);
    console.log('━'.repeat(50));

    // Check auth user
    const { data: users } = await supabase.auth.admin.listUsers();
    const authUser = users.users.find(u => u.email === testUser.email);
    
    if (!authUser) {
      console.log('  ❌ Auth user: NOT FOUND');
      continue;
    }
    console.log(`  ✓ Auth user: ${authUser.id}`);

    // Check application
    const { data: app } = await supabase
      .from('unblck_applications')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single();
    
    if (!app) {
      console.log('  ❌ Application: NOT FOUND');
    } else {
      console.log(`  ✓ Application: ${app.status} (${app.application_type})`);
    }

    // Check member profile
    const { data: profile } = await supabase
      .from('member_profiles')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single();
    
    if (!profile) {
      console.log('  ❌ Member Profile: NOT FOUND');
    } else {
      console.log(`  ✓ Member Profile: ${profile.stellar_funded ? 'Founder' : 'Builder'}`);
    }
  }

  console.log('\n\n' + '='.repeat(50));
  console.log('SUMMARY');
  console.log('='.repeat(50));
  console.log('\nTest credentials:');
  console.log('  Admin:   admin@test.unblck.dev   / admin123');
  console.log('  Founder: founder@test.unblck.dev / founder123');
  console.log('  Builder: builder@test.unblck.dev / builder123');
  console.log('\nLogin at: http://localhost:3001/login\n');
}

verifyTestUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
