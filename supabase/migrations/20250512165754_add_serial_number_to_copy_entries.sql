DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'copy_entries' 
        AND column_name = 'serial_number'
    ) THEN
        ALTER TABLE public.copy_entries
        ADD COLUMN serial_number SERIAL UNIQUE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_copy_entries_serial_number ON public.copy_entries(serial_number);