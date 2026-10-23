-- Cart round 22/10 (owner 23/10): which carrier took the parcel — "thailand-post" or "flash" (src/lib/commerce/carriers.ts).
-- Staff pick it with the tracking number on /staff; the customer's order page names it and links to its tracking page.
-- NULL for orders shipped before this column existed (the page then shows the number only).
ALTER TABLE orders ADD COLUMN carrier TEXT;
