-- Business-rule triggers for final_zoo_db
-- Run AFTER final_zoo_db.sql (and after seed is fine too)

USE `final_zoo_db`;

DROP TRIGGER IF EXISTS `trg_animal_enclosure_capacity`;
DROP TRIGGER IF EXISTS `trg_lineitem_product_stock`;
DROP TRIGGER IF EXISTS `trg_transactionproduct_stock`;

DELIMITER $$

-- 1) Block adding an animal if the enclosure is at capacity
--    (only count animals that are not soft-deleted)
CREATE TRIGGER `trg_animal_enclosure_capacity`
BEFORE INSERT ON `animal`
FOR EACH ROW
BEGIN
  DECLARE current_count INT;
  DECLARE max_capacity INT;

  SELECT `Capacity`
  INTO max_capacity
  FROM `enclosure`
  WHERE `EnclosureID` = NEW.`EnclosureID`
    AND `IsDeleted` = 0;

  IF max_capacity IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Enclosure not found or is deleted.';
  END IF;

  SELECT COUNT(*)
  INTO current_count
  FROM `animal`
  WHERE `EnclosureID` = NEW.`EnclosureID`
    AND `IsDeleted` = 0;

  IF current_count >= max_capacity THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Enclosure is at capacity; cannot add another animal.';
  END IF;
END$$

-- 2) Block product sale if deleted / not enough stock; otherwise decrease stock
CREATE TRIGGER `trg_transactionproduct_stock`
BEFORE INSERT ON `transactionproduct`
FOR EACH ROW
BEGIN
  DECLARE current_stock INT;
  DECLARE product_deleted INT;

  SELECT `QuantityInStock`, `IsDeleted`
  INTO current_stock, product_deleted
  FROM `product`
  WHERE `ProductID` = NEW.`ProductID`;

  IF current_stock IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Product not found for this purchase.';
  ELSEIF product_deleted = 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Product is deleted; cannot purchase.';
  ELSEIF NEW.`Quantity` > current_stock THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Not enough product stock for this purchase.';
  ELSE
    UPDATE `product`
    SET `QuantityInStock` = `QuantityInStock` - NEW.`Quantity`
    WHERE `ProductID` = NEW.`ProductID`
      AND `IsDeleted` = 0;
  END IF;
END$$

DELIMITER ;