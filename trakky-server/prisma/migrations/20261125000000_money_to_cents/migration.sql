-- Convert money from major units (DOUBLE) to integer minor units (INT pence).
-- The DECIMAL step rounds existing binary floats to two decimals before scaling,
-- so values like 0.30000000000000004 become 30 pence instead of 30.000000000000004.
ALTER TABLE `Budget`
    MODIFY `budget` DECIMAL(20, 2) NOT NULL,
    MODIFY `maxBudget` DECIMAL(20, 2) NOT NULL;
UPDATE `Budget` SET `budget` = `budget` * 100, `maxBudget` = `maxBudget` * 100;
ALTER TABLE `Budget`
    MODIFY `budget` INT NOT NULL,
    MODIFY `maxBudget` INT NOT NULL;

ALTER TABLE `Payment` MODIFY `amount` DECIMAL(20, 2) NOT NULL;
UPDATE `Payment` SET `amount` = `amount` * 100;
ALTER TABLE `Payment` MODIFY `amount` INT NOT NULL;

-- Rollback (manual): MODIFY the three columns back to DOUBLE, then divide each by 100.
