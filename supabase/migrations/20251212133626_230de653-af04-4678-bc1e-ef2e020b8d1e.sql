-- Create leads table for capturing contact form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'portfolio',
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Users can view their own leads
CREATE POLICY "Users can view their own leads"
ON public.leads FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can insert leads (for public portfolio forms)
CREATE POLICY "Anyone can insert leads"
ON public.leads FOR INSERT
WITH CHECK (true);

-- Users can update their own leads
CREATE POLICY "Users can update their own leads"
ON public.leads FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own leads
CREATE POLICY "Users can delete their own leads"
ON public.leads FOR DELETE
USING (auth.uid() = user_id);

-- Create briefing_models table for custom briefing templates
CREATE TABLE public.briefing_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.briefing_models ENABLE ROW LEVEL SECURITY;

-- Users can view their own briefing models
CREATE POLICY "Users can view their own briefing models"
ON public.briefing_models FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can view public briefing models
CREATE POLICY "Anyone can view public briefing models"
ON public.briefing_models FOR SELECT
USING (is_public = true OR share_token IS NOT NULL);

-- Users can create their own briefing models
CREATE POLICY "Users can create their own briefing models"
ON public.briefing_models FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own briefing models
CREATE POLICY "Users can update their own briefing models"
ON public.briefing_models FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own briefing models
CREATE POLICY "Users can delete their own briefing models"
ON public.briefing_models FOR DELETE
USING (auth.uid() = user_id);

-- Add username field to profiles for public portfolio URL
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS calendly_url TEXT,
ADD COLUMN IF NOT EXISTS show_contact_form BOOLEAN DEFAULT true;

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Allow public access to profiles by username for public portfolio
CREATE POLICY "Anyone can view public profiles by username"
ON public.profiles FOR SELECT
USING (username IS NOT NULL);

-- Allow public access to projects for public portfolio
CREATE POLICY "Anyone can view projects of public profiles"
ON public.projects FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = projects.user_id 
    AND profiles.username IS NOT NULL
  )
);

-- Trigger for updated_at on leads
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on briefing_models
CREATE TRIGGER update_briefing_models_updated_at
BEFORE UPDATE ON public.briefing_models
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();