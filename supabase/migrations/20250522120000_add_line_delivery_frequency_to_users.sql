-- Add line_delivery_frequency to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS line_delivery_frequency TEXT;
 
COMMENT ON COLUMN public.users.line_delivery_frequency IS 'User preference for LINE message delivery frequency. e.g., "daily 20:00" or "weekly Friday 20:00"'; 