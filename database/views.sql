-- Views for final_zoo_db
-- Run after final_zoo_db.sql (and seed if you want data in reports)

USE final_zoo_db;

DROP VIEW IF EXISTS v_transaction_totals;
DROP VIEW IF EXISTS v_customer_spending;
DROP VIEW IF EXISTS v_product_sales;
DROP VIEW IF EXISTS v_enclosure_occupancy;
DROP VIEW IF EXISTS v_low_stock;

-- Total for each sale: ticket + products (history — no IsDeleted on these tables)
CREATE VIEW v_transaction_totals AS
SELECT
  t.TransactionID,
  t.CustomerID,
  t.Date,
  t.PaymentType,
  COALESCE(tk.UnitPrice, 0)
    + COALESCE(SUM(tp.Quantity * tp.UnitPrice), 0) AS TotalAmount
FROM `transaction` t
LEFT JOIN ticket tk
  ON tk.TransactionID = t.TransactionID
LEFT JOIN transactionproduct tp
  ON tp.TransactionID = t.TransactionID
GROUP BY
  t.TransactionID,
  t.CustomerID,
  t.Date,
  t.PaymentType,
  tk.UnitPrice;

-- Lifetime spend (keep soft-deleted customers so old sales still show)
CREATE VIEW v_customer_spending AS
SELECT
  c.CustomerID,
  c.Email,
  c.IsDeleted,
  COUNT(vt.TransactionID) AS TransactionCount,
  COALESCE(SUM(vt.TotalAmount), 0) AS LifetimeSpend
FROM customer c
LEFT JOIN v_transaction_totals vt
  ON vt.CustomerID = c.CustomerID
GROUP BY
  c.CustomerID,
  c.Email,
  c.IsDeleted;

-- Product sales (active products only in this catalog-style report)
CREATE OR REPLACE VIEW v_product_sales AS
SELECT
  p.ProductID,
  p.Name,
  p.ShopID,
  IFNULL(SUM(tp.Quantity), 0) AS UnitsSold,
  IFNULL(SUM(tp.Quantity * tp.UnitPrice), 0.00) AS Revenue
FROM product p
LEFT JOIN transactionproduct tp
  ON tp.ProductID = p.ProductID
WHERE p.IsDeleted = 0
GROUP BY
  p.ProductID,
  p.Name,
  p.ShopID;

-- Animals vs capacity (ignore soft-deleted enclosures and animals)
CREATE OR REPLACE VIEW v_enclosure_occupancy AS
SELECT
  e.EnclosureID,
  e.Name AS EnclosureName,
  e.Capacity,
  COUNT(a.AnimalID) AS AnimalCount,
  e.Capacity - COUNT(a.AnimalID) AS RemainingCapacity,
  ROUND(COUNT(a.AnimalID) * 100.0 / NULLIF(e.Capacity, 0), 2) AS CapacityPercentage
FROM enclosure e
LEFT JOIN animal a
  ON a.EnclosureID = e.EnclosureID
 AND a.IsDeleted = 0
WHERE e.IsDeleted = 0
GROUP BY
  e.EnclosureID,
  e.Name,
  e.Capacity;