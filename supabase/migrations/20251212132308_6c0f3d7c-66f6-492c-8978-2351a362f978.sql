-- Add niche_framework field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS niche_framework text DEFAULT 'general';

-- Add advanced proposal fields to proposals table
ALTER TABLE public.proposals 
ADD COLUMN IF NOT EXISTS exclusions text,
ADD COLUMN IF NOT EXISTS terms text,
ADD COLUMN IF NOT EXISTS validity_days integer DEFAULT 15,
ADD COLUMN IF NOT EXISTS timeline text,
ADD COLUMN IF NOT EXISTS deliverables text;

-- Add result_metrics field to projects for AI extraction
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS result_metrics text,
ADD COLUMN IF NOT EXISTS problem_statement text,
ADD COLUMN IF NOT EXISTS solution_summary text,
ADD COLUMN IF NOT EXISTS impact_description text;