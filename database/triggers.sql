-- Business-rule triggers for final_zoo_db
-- Run AFTER final_zoo_db.sql

USE `final_zoo_db`;

DROP TRIGGER IF EXISTS `trg_animal_enclosure_capacity`;
DROP TRIGGER IF EXISTS `trg_lineitem_product_stock`;

DELIMITER $$

-- ---------------------------------------------------------------------------
-- 1) Block adding an animal if the enclosure is already at capacity
-- ---------------------------------------------------------------------------
CREATE TRIGGER `trg_animal_enclosure_capacity`
BEFORE INSERT ON `animal`
FOR EACH ROW
BEGIN
  DECLARE current_count INT;
  DECLARE max_capacity INT;

  SELECT `Capacity`
  INTO max_capacity
  FROM `enclosure`
  WHERE `EnclosureID` = NEW.`EnclosureID`;

  SELECT COUNT(*)
  INTO current_count
  FROM `animal`
  WHERE `EnclosureID` = NEW.`EnclosureID`;

  IF current_count >= max_capacity THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Enclosure is at capacity; cannot add another animal.';
  END IF;
END$$

-- ---------------------------------------------------------------------------
-- 2) Block product sale if not enough stock; otherwise decrease stock
-- ---------------------------------------------------------------------------
CREATE TRIGGER `trg_lineitem_product_stock`
BEFORE INSERT ON `transactionlineitem`
FOR EACH ROW
BEGIN
  DECLARE current_stock INT;

  IF NEW.`ItemType` = 'Product' THEN
    SELECT `QuantityInStock`
    INTO current_stock
    FROM `product`
    WHERE `ProductID` = NEW.`ProductID`;

    IF current_stock IS NULL THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Product not found for this line item.';
    ELSEIF NEW.`Quantity` > current_stock THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Not enough product stock for this purchase.';
    ELSE
      UPDATE `product`
      SET `QuantityInStock` = `QuantityInStock` - NEW.`Quantity`
      WHERE `ProductID` = NEW.`ProductID`;
    END IF;
  END IF;
END$$

DELIMITER ;