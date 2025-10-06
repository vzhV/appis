# Supabase Integration Setup

This project now uses Supabase as the database backend for API key management.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Your Supabase project URL (found in your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key (found in your Supabase dashboard under Settings > API)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Your Supabase service role key (found in your Supabase dashboard under Settings > API)
# WARNING: Keep this secret! This key has admin privileges
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. Create the Database Schema

Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor:

```sql
-- Create API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('development', 'production')),
  usage INTEGER DEFAULT 0,
  monthly_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_type ON api_keys(type);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see their own API keys
CREATE POLICY "Users can view own API keys" ON api_keys
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own API keys
CREATE POLICY "Users can insert own API keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own API keys
CREATE POLICY "Users can update own API keys" ON api_keys
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own API keys
CREATE POLICY "Users can delete own API keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set user_id
CREATE TRIGGER set_user_id_trigger
  BEFORE INSERT ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION set_user_id();
```

### 4. Test the Integration

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3001/dashboards`
3. Try creating, editing, and deleting API keys

**Note:** Make sure you have set up your environment variables and created the database schema before testing, otherwise you'll get connection errors.

## Features

- **Persistent Storage**: API keys are now stored in Supabase database
- **User Isolation**: Each user can only see their own API keys (when authentication is implemented)
- **Row Level Security**: Database-level security policies protect user data
- **Automatic Timestamps**: Created and updated timestamps are automatically managed
- **Unique Constraints**: API keys are guaranteed to be unique across the system

## Database Schema

The `api_keys` table includes:

- `id`: UUID primary key
- `name`: Human-readable name for the API key
- `key`: The actual API key string
- `type`: Either 'development' or 'production'
- `usage`: Current usage count
- `monthly_limit`: Optional monthly usage limit
- `created_at`: When the key was created
- `last_used`: When the key was last used
- `is_active`: Whether the key is active

**Note:** This schema does not include user authentication yet. All API keys are shared across the system. User isolation will be added when authentication is implemented.

## Security Features

- **Row Level Security (RLS)**: Enabled but allows all operations (no user restrictions yet)
- **Service Role**: Server-side operations use service role for admin access
- **Input Validation**: All inputs are validated before database operations
- **Unique Constraints**: Prevents duplicate API keys

**Note:** User isolation and authentication will be added in a future update.

## Next Steps

To complete the integration, you may want to:

1. **Set up environment variables** with your Supabase credentials
2. **Run the SQL schema** in your Supabase project
3. **Implement Authentication**: Add Supabase Auth to manage user sessions
4. **Add User Management**: Create user registration and login flows
5. **Add Usage Tracking**: Implement actual API usage tracking
6. **Add Rate Limiting**: Implement rate limiting based on monthly limits
7. **Add Audit Logging**: Track all API key operations for security
