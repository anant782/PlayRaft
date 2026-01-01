
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smwjtvapoqxuhyptmuth.supabase.co';

// =================================================================================
// IMPORTANT NOTE ON API KEY:
// =================================================================================
// The provided API key format ('sb_publishable_...') is unusual for the Supabase client library.
// Typically, this should be the 'anon' public key from your Supabase project's API settings, 
// which is a very long string (a JSON Web Token).
//
// If you see a "DB Connection Failed" status in the app's footer, please double-check 
// that this key is correct by visiting your Supabase Dashboard > Project Settings > API.
// =================================================================================
const supabaseKey = 'sb_publishable_z4N1PmuRqJoecgT8yMOIOg_JL08zDtX';

// Assumes a table named `sitemap_games` with a primary key column `game_id` of type TEXT.
// You will need to enable Row Level Security (RLS) on this table and create a policy
// that allows public inserts. See the provided SQL script for the exact commands.
export const supabase = createClient(supabaseUrl, supabaseKey);
