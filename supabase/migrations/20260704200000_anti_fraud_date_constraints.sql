CREATE OR REPLACE FUNCTION enforce_future_date_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'table_reservations' THEN
        IF NEW.reservation_date::date < current_date THEN
            RAISE EXCEPTION 'Reservation date cannot be in the past.';
        END IF;
    ELSIF TG_TABLE_NAME = 'catering_bookings' OR TG_TABLE_NAME = 'event_bookings' THEN
        IF NEW.event_date IS NOT NULL AND NEW.event_date::date < current_date THEN
            RAISE EXCEPTION 'Event date cannot be in the past.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_table_reservations_future_date ON table_reservations;
CREATE TRIGGER tr_table_reservations_future_date
BEFORE INSERT ON table_reservations
FOR EACH ROW EXECUTE FUNCTION enforce_future_date_on_insert();

DROP TRIGGER IF EXISTS tr_catering_bookings_future_date ON catering_bookings;
CREATE TRIGGER tr_catering_bookings_future_date
BEFORE INSERT ON catering_bookings
FOR EACH ROW EXECUTE FUNCTION enforce_future_date_on_insert();

DROP TRIGGER IF EXISTS tr_event_bookings_future_date ON event_bookings;
CREATE TRIGGER tr_event_bookings_future_date
BEFORE INSERT ON event_bookings
FOR EACH ROW EXECUTE FUNCTION enforce_future_date_on_insert();

ALTER TABLE promo_codes
DROP CONSTRAINT IF EXISTS promo_codes_ends_at_check;

ALTER TABLE promo_codes
ADD CONSTRAINT promo_codes_ends_at_check
CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at);

NOTIFY pgrst, 'reload schema';
