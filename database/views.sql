-- Views for final_zoo_db
-- Run after final_zoo_db.sql

USE final_zoo_db;

DROP VIEW IF EXISTS v_transaction_totals;
DROP VIEW IF EXISTS v_customer_spending;
DROP VIEW IF EXISTS v_product_sales;
DROP VIEW IF EXISTS v_enclosure_occupancy;
DROP VIEW IF EXISTS v_low_stock;

-- Total for each sale: ticket + products
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

-- How much each customer has spent
CREATE VIEW v_customer_spending AS
SELECT
  c.CustomerID,
  c.Email,
  COUNT(vt.TransactionID) AS TransactionCount,
  COALESCE(SUM(vt.TotalAmount), 0) AS LifetimeSpend
FROM customer c
LEFT JOIN v_transaction_totals vt
  ON vt.CustomerID = c.CustomerID
GROUP BY
  c.CustomerID,
  c.Email;

-- Product sales (good for a report)
CREATE VIEW v_product_sales AS
SELECT
  p.ProductID,
  p.Name,
  p.ShopID,
  SUM(tp.Quantity) AS UnitsSold,
  SUM(tp.Quantity * tp.UnitPrice) AS Revenue
FROM product p
LEFT JOIN transactionproduct tp
  ON tp.ProductID = p.ProductID
GROUP BY
  p.ProductID,
  p.Name,
  p.ShopID;

-- Animals vs capacity (good for a query)
CREATE VIEW v_enclosure_occupancy AS
SELECT
  e.EnclosureID,
  e.Name,
  e.Capacity,
  COUNT(a.AnimalID) AS AnimalCount,
  e.Capacity - COUNT(a.AnimalID) AS SpotsLeft
FROM enclosure e
LEFT JOIN animal a
  ON a.EnclosureID = e.EnclosureID
GROUP BY
  e.EnclosureID,
  e.Name,
  e.Capacity;

