-- 10 test agenda items voor development/demo
INSERT INTO calendar_events (title, description, category, start_time, end_time, location, animal_name) VALUES
('Veterinaire controle Akari', 'Reguliere gezondheidscheck', 'medisch', now() + interval '1 hour', now() + interval '2 hours', 'Dierenkliniek Ban Khok Ngam', 'Akari'),
('Adoptiegesprek Familie Janssen', 'Video call over adoptie Bootleg', 'adoptie', now() + interval '3 hours', now() + interval '4 hours', 'Online (Zoom)', 'Bootleg'),
('Vrijwilliger aankomst Thomas', 'Nieuwe vrijwilliger uit Nederland', 'vrijwilliger', now() + interval '6 hours', now() + interval '7 hours', 'Opvang Ban Khok Ngam', NULL),
('Zwemtherapie sessie', 'Wekelijkse zwemtherapie gehandicapte honden', 'medisch', now() + interval '8 hours', now() + interval '9 hours', 'Zwembad terrein', NULL),
('Sterilisatie dag', '5 honden sterilisatie operaties', 'medisch', now() + interval '24 hours', now() + interval '32 hours', 'Dierenkliniek', NULL),
('Donateur bezoek', 'Nederlandse donateurs bezoeken de opvang', 'bezoek', now() + interval '26 hours', now() + interval '30 hours', 'Opvang Ban Khok Ngam', NULL),
('Voer bestelling ophalen', 'Maandelijkse voer bestelling', 'logistiek', now() + interval '28 hours', now() + interval '29 hours', 'Khon Kaen markt', NULL),
('Foto sessie adoptiedieren', 'Nieuwe foto profiel foto voor website', 'marketing', now() + interval '30 hours', now() + interval '31 hours', 'Opvang terrein', NULL),
('Video call sponsor', 'Maandelijkse update voor hoofdsponsor', 'financieel', now() + interval '36 hours', now() + interval '37 hours', 'Online', NULL),
('Transport 3 honden naar Bangkok', 'Vlucht naar Nederland adoptie', 'adoptie', now() + interval '40 hours', now() + interval '44 hours', 'Bangkok Suvarnabhumi Airport', NULL);
