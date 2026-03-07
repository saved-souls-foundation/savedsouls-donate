-- Optionele hero/cover afbeelding voor blog posts (o.a. spotlight met dierfoto).
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS hero_image text;

COMMENT ON COLUMN posts.hero_image IS 'URL van de cover/hero afbeelding (bijv. dierfoto bij spotlight).';
