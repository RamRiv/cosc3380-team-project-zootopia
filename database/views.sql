-- Views for final_zoo_db
-- Run AFTER final_zoo_db.sql (schema), BEFORE or AFTER seed_data.sql.
-- Money totals are computed here (not stored on tables).

USE `final_zoo_db`;

DROP VIEW IF EXISTS `v_lineitem_detail`;
DROP VIEW IF EXISTS `v_transaction_totals`;
DROP VIEW IF EXISTS `v_customer_spending`;
DROP VIEW IF EXISTS `v_revenue_by_item_type`;
DROP VIEW IF EXISTS `v_revenue_by_shop_stand`;

-- ---------------------------------------------------------------------------
-- Each line item with computed Subtotal (Quantity * UnitPrice)
-- ---------------------------------------------------------------------------
CREATE VIEW `v_lineitem_detail` AS
SELECT
  li.`LineItemID`,
  li.`TransactionID`,
  li.`Quantity`,
  li.`ItemType`,
  li.`UnitPrice`,
  (li.`Quantity` * li.`UnitPrice`) AS `Subtotal`,
  li.`TicketID`,
  li.`ProductID`,
  li.`PassID`
FROM `transactionlineitem` li;

-- ---------------------------------------------------------------------------
-- Each transaction with computed TotalAmount (sum of line subtotals)
-- ---------------------------------------------------------------------------
CREATE VIEW `v_transaction_totals` AS
SELECT
  t.`TransactionID`,
  t.`CustomerID`,
  t.`Date`,
  t.`PaymentType`,
  COALESCE(SUM(li.`Quantity` * li.`UnitPrice`), 0) AS `TotalAmount`
FROM `transaction` t
LEFT JOIN `transactionlineitem` li
  ON li.`TransactionID` = t.`TransactionID`
GROUP BY
  t.`TransactionID`,
  t.`CustomerID`,
  t.`Date`,
  t.`PaymentType`;

-- ---------------------------------------------------------------------------
-- Lifetime spend per customer (for reports)
-- ---------------------------------------------------------------------------
CREATE VIEW `v_customer_spending` AS
SELECT
  c.`CustomerID`,
  c.`FirstName`,
  c.`LastName`,
  c.`EmailAddress`,
  c.`MembershipType`,
  COUNT(DISTINCT vt.`TransactionID`) AS `TransactionCount`,
  COALESCE(SUM(vt.`TotalAmount`), 0) AS `LifetimeSpend`
FROM `customer` c
LEFT JOIN `v_transaction_totals` vt
  ON vt.`CustomerID` = c.`CustomerID`
GROUP BY
  c.`CustomerID`,
  c.`FirstName`,
  c.`LastName`,
  c.`EmailAddress`,
  c.`MembershipType`;

-- ---------------------------------------------------------------------------
-- Revenue grouped by ItemType (Ticket / Product / Parking)
-- ---------------------------------------------------------------------------
CREATE VIEW `v_revenue_by_item_type` AS
SELECT
  li.`ItemType`,
  SUM(li.`Quantity`) AS `UnitsSold`,
  SUM(li.`Quantity` * li.`UnitPrice`) AS `Revenue`
FROM `transactionlineitem` li
GROUP BY li.`ItemType`;

-- ---------------------------------------------------------------------------
-- Product revenue by gift shop or food stand
-- (only Product line items; shop/stand come from product)
-- ---------------------------------------------------------------------------
CREATE VIEW `v_revenue_by_shop_stand` AS
SELECT
  CASE
    WHEN p.`ShopID` IS NOT NULL THEN 'Gift Shop'
    WHEN p.`StandID` IS NOT NULL THEN 'Food Stand'
  END AS `LocationType`,
  COALESCE(gs.`ShopID`, fs.`StandID`) AS `LocationID`,
  COALESCE(gs.`Name`, fs.`Name`) AS `LocationName`,
  SUM(li.`Quantity`) AS `UnitsSold`,
  SUM(li.`Quantity` * li.`UnitPrice`) AS `Revenue`
FROM `transactionlineitem` li
INNER JOIN `product` p
  ON p.`ProductID` = li.`ProductID`
LEFT JOIN `giftshop` gs
  ON gs.`ShopID` = p.`ShopID`
LEFT JOIN `foodstand` fs
  ON fs.`StandID` = p.`StandID`
WHERE li.`ItemType` = 'Product'
GROUP BY
  CASE
    WHEN p.`ShopID` IS NOT NULL THEN 'Gift Shop'
    WHEN p.`StandID` IS NOT NULL THEN 'Food Stand'
  END,
  COALESCE(gs.`ShopID`, fs.`StandID`),
  COALESCE(gs.`Name`, fs.`Name`);