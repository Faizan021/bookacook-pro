-- 1. Create the custom ENUM for status tracking
CREATE TYPE seo_content_status AS ENUM ('draft', 'in_review', 'approved', 'published', 'rejected', 'archived');

-- 2. Create the main table
CREATE TABLE public.seo_content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- e.g., 'competitor', 'geo'
    target_keyword TEXT NOT NULL,
    title TEXT,
    slug TEXT,
    meta_title TEXT,
    meta_description TEXT,
    content TEXT,
    cta_text TEXT,
    internal_links JSONB DEFAULT '[]'::jsonb,
    status seo_content_status DEFAULT 'draft'::seo_content_status,
    sitemap_indexed BOOLEAN DEFAULT false,
    last_edited_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.seo_content_pages ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies (Only Admins can Read/Write)
CREATE POLICY "Allow admins to read seo_content_pages"
ON public.seo_content_pages FOR SELECT
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Allow admins to insert seo_content_pages"
ON public.seo_content_pages FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Allow admins to update seo_content_pages"
ON public.seo_content_pages FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

CREATE POLICY "Allow admins to delete seo_content_pages"
ON public.seo_content_pages FOR DELETE
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'));

-- 5. Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seo_content_pages_updated_at
BEFORE UPDATE ON public.seo_content_pages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
