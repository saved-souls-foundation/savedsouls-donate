-- Zet template "Contact ontvangen" uit (actief = false).
UPDATE email_templates
SET actief = false
WHERE naam = 'Contact ontvangen';
