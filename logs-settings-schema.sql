-- Logs and Settings Schema for Appis
-- This file contains the database schema for activity logs and user settings

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- 'create_key', 'edit_key', 'delete_key', 'login', 'logout', etc.
    resource_type VARCHAR(50) NOT NULL, -- 'api_key', 'user', 'settings', etc.
    resource_id UUID, -- ID of the affected resource
    details JSONB, -- Additional details about the action
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(20) DEFAULT 'dark', -- 'light', 'dark', 'auto'
    notifications JSONB DEFAULT '{"email": true, "push": true, "api_alerts": true}', -- Notification preferences
    api_preferences JSONB DEFAULT '{"default_limit": 1000, "auto_refresh": true}', -- API-related preferences
    dashboard_preferences JSONB DEFAULT '{"default_view": "overview", "items_per_page": 10}', -- Dashboard preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Settings Table (for global settings)
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource_type ON activity_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Row Level Security (RLS) Policies

-- Activity Logs Policies
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own logs
CREATE POLICY "Users can view their own activity logs" ON activity_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own logs
CREATE POLICY "Users can insert their own activity logs" ON activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Settings Policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can view their own settings
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- System Settings Policies (admin only)
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view system settings
CREATE POLICY "Authenticated users can view system settings" ON system_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Functions

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_action VARCHAR(50),
    p_resource_type VARCHAR(50),
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO activity_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        details,
        ip_address,
        user_agent
    ) VALUES (
        auth.uid(),
        p_action,
        p_resource_type,
        p_resource_id,
        p_details,
        p_ip_address,
        p_user_agent
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create user settings
CREATE OR REPLACE FUNCTION get_or_create_user_settings()
RETURNS user_settings AS $$
DECLARE
    settings_record user_settings;
BEGIN
    -- Try to get existing settings
    SELECT * INTO settings_record 
    FROM user_settings 
    WHERE user_id = auth.uid();
    
    -- If no settings exist, create default ones
    IF NOT FOUND THEN
        INSERT INTO user_settings (user_id) 
        VALUES (auth.uid()) 
        RETURNING * INTO settings_record;
    END IF;
    
    RETURN settings_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('max_api_keys_per_user', '{"value": 10}', 'Maximum number of API keys per user'),
('default_api_key_limit', '{"value": 1000}', 'Default monthly limit for new API keys'),
('log_retention_days', '{"value": 90}', 'Number of days to retain activity logs'),
('maintenance_mode', '{"value": false}', 'System maintenance mode flag')
ON CONFLICT (key) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON activity_logs TO authenticated;
GRANT ALL ON user_settings TO authenticated;
GRANT SELECT ON system_settings TO authenticated;
