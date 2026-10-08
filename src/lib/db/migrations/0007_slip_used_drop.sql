-- Owner ruling 08/10 ("ผ่านคือผ่าน ไม่ผ่านคือไม่ผ่าน ไม่ต้องบันทึก"): the first check of a slip is the verdict and the
-- same transfer coming back is always flagged — no "used for an order" mark. 0006 added the column and is already
-- applied on the live database, so it is dropped here rather than by deleting 0006.
ALTER TABLE slip_checks DROP COLUMN used_at;
