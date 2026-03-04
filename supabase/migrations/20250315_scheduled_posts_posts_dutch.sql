-- Nederlandse kolommen voor scheduled_posts en posts (zelfde logica als sent_emails).

-- scheduled_posts: content -> inhoud, scheduled_at -> gepland_op
ALTER TABLE scheduled_posts RENAME COLUMN content TO inhoud;
ALTER TABLE scheduled_posts RENAME COLUMN scheduled_at TO gepland_op;
COMMENT ON COLUMN scheduled_posts.inhoud IS 'Berichttekst';
COMMENT ON COLUMN scheduled_posts.gepland_op IS 'Gepland publicatietijdstip';
DROP INDEX IF EXISTS scheduled_posts_scheduled_at_idx;
CREATE INDEX IF NOT EXISTS scheduled_posts_gepland_op_idx ON scheduled_posts(gepland_op);

-- posts: title -> titel, body -> inhoud, published_at -> gepubliceerd_op
ALTER TABLE posts RENAME COLUMN title TO titel;
ALTER TABLE posts RENAME COLUMN body TO inhoud;
ALTER TABLE posts RENAME COLUMN published_at TO gepubliceerd_op;
COMMENT ON COLUMN posts.titel IS 'Blogtitel';
COMMENT ON COLUMN posts.inhoud IS 'Blogbody (NL)';
COMMENT ON COLUMN posts.gepubliceerd_op IS 'Publicatietijdstip';
DROP INDEX IF EXISTS posts_published_at_idx;
CREATE INDEX IF NOT EXISTS posts_gepubliceerd_op_idx ON posts(gepubliceerd_op);
