-- 1. Create a function to check if a date is in the past
CREATE OR REPLACE FUNCTION check_future_date_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Determine which column to check based on the table name
  IF TG_TABLE_NAME = 'table_reservations' THEN
    IF NEW.reservation_date < CURRENT_DATE THEN
      RAISE EXCEPTION 'reservation_date cannot be in the past';
    END IF;
  ELSIF TG_TABLE_NAME = 'event_bookings' THEN
    IF NEW.event_date < CURRENT_DATE THEN
      RAISE EXCEPTION 'event_date cannot be in the past';
    END IF;
  ELSIF TG_TABLE_NAME = 'catering_bookings' THEN
    IF NEW.event_date < CURRENT_DATE THEN
      RAISE EXCEPTION 'event_date cannot be in the past';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach the trigger to table_reservations
DROP TRIGGER IF EXISTS ensure_future_reservation_date ON table_reservations;
CREATE TRIGGER ensure_future_reservation_date
  BEFORE INSERT OR UPDATE ON table_reservations
  FOR EACH ROW
  EXECUTE FUNCTION check_future_date_trigger();

-- 3. Attach the trigger to event_bookings
DROP TRIGGER IF EXISTS ensure_future_event_booking_date ON event_bookings;
CREATE TRIGGER ensure_future_event_booking_date
  BEFORE INSERT OR UPDATE ON event_bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_future_date_trigger();

-- 4. Attach the trigger to catering_bookings
DROP TRIGGER IF EXISTS ensure_future_catering_booking_date ON catering_bookings;
CREATE TRIGGER ensure_future_catering_booking_date
  BEFORE INSERT OR UPDATE ON catering_bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_future_date_trigger();

-- 5. Add static CHECK constraint to promo_codes
-- First remove if it exists to make it idempotent
ALTER TABLE promo_codes DROP CONSTRAINT IF EXISTS promo_codes_ends_at_check;
ALTER TABLE promo_codes ADD CONSTRAINT promo_codes_ends_at_check CHECK (ends_at > starts_at);
