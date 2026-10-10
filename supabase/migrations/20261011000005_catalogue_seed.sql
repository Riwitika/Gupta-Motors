-- =============================================================================
-- Gupta Motors — Motorcycle Catalogue Seed Data
-- Migration: 20261011000005_catalogue_seed.sql
-- Description: Seeds the verified official Bajaj motorcycle catalogue records.
-- =============================================================================

INSERT INTO public.motorcycles (
  model_id,
  name,
  series,
  category,
  engine_cc,
  is_active
) VALUES
  ('pulsar-125', 'Pulsar 125', 'Pulsar', 'pulsar', 124.40, true),
  ('pulsar-150', 'Pulsar 150', 'Pulsar', 'pulsar', 149.50, true),
  ('pulsar-n160', 'Pulsar N160', 'Pulsar', 'pulsar', 164.82, true),
  ('pulsar-ns200', 'Pulsar NS200', 'Pulsar', 'pulsar', 199.50, true),
  ('pulsar-n250', 'Pulsar N250', 'Pulsar', 'pulsar', 249.07, true),
  ('freedom-125', 'Freedom 125 (CNG)', 'Freedom', 'commuter', 125.00, true),
  ('platina-100', 'Platina 100', 'Platina', 'commuter', 102.00, true),
  ('platina-110-abs', 'Platina 110 ABS', 'Platina', 'commuter', 115.45, true),
  ('ct-110x', 'CT 110X', 'CT', 'commuter', 115.45, true),
  ('avenger-cruise-220', 'Avenger Cruise 220', 'Avenger', 'cruiser', 220.00, true),
  ('avenger-street-160', 'Avenger Street 160', 'Avenger', 'cruiser', 160.00, true),
  ('dominar-400', 'Dominar 400', 'Dominar', 'tourer', 373.30, true),
  ('dominar-250', 'Dominar 250', 'Dominar', 'tourer', 248.77, true)
ON CONFLICT (model_id) DO UPDATE SET
  name = EXCLUDED.name,
  series = EXCLUDED.series,
  category = EXCLUDED.category,
  engine_cc = EXCLUDED.engine_cc,
  is_active = EXCLUDED.is_active,
  updated_at = now();
