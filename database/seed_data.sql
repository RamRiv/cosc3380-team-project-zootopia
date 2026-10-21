-- Seed data for final_zoo_db
-- Run AFTER schema (final_zoo_db.sql). Views optional before/after.
-- Safe to re-run: clears tables first, then inserts demo rows.

USE `final_zoo_db`;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `transactionlineitem`;
TRUNCATE TABLE `transaction`;
TRUNCATE TABLE `zooclosure`;
TRUNCATE TABLE `animal`;
TRUNCATE TABLE `species_enclosure`;
TRUNCATE TABLE `product`;
TRUNCATE TABLE `ticket`;
TRUNCATE TABLE `parking`;
TRUNCATE TABLE `employee`;
TRUNCATE TABLE `customer`;
TRUNCATE TABLE `attraction`;
TRUNCATE TABLE `species`;
TRUNCATE TABLE `enclosure`;
TRUNCATE TABLE `giftshop`;
TRUNCATE TABLE `foodstand`;
SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- Species
-- ---------------------------------------------------------------------------
INSERT INTO `species` (`SpeciesID`, `CommonName`, `ScientificName`, `Diet`, `ConservationStatus`, `AvgLifespan`) VALUES
(1, 'African Lion', 'Panthera leo', 'Carnivore', 'Vulnerable', 15),
(2, 'African Elephant', 'Loxodonta africana', 'Herbivore', 'Endangered', 60),
(3, 'Bottlenose Dolphin', 'Tursiops truncatus', 'Carnivore', 'Least Concern', 40),
(4, 'Emperor Penguin', 'Aptenodytes forsteri', 'Carnivore', 'Near Threatened', 20),
(5, 'Giant Panda', 'Ailuropoda melanoleuca', 'Herbivore', 'Vulnerable', 20),
(6, 'Red Kangaroo', 'Osphranter rufus', 'Herbivore', 'Least Concern', 22);

-- ---------------------------------------------------------------------------
-- Enclosures
-- ---------------------------------------------------------------------------
INSERT INTO `enclosure` (`EnclosureID`, `Name`, `HabitatType`, `Capacity`, `Location`, `IsIndoor`, `Status`) VALUES
(1, 'Lion Habitat', 'Savanna', 8, 'Zone A', 0, 'Open'),
(2, 'Elephant Plains', 'Grassland', 6, 'Zone B', 0, 'Open'),
(3, 'Marine Lagoon', 'Aquatic', 12, 'Zone C', 1, 'Open'),
(4, 'Polar Pavilion', 'Antarctic', 20, 'Zone C', 1, 'Open'),
(5, 'Bamboo Garden', 'Forest', 4, 'Zone D', 0, 'Open');

-- ---------------------------------------------------------------------------
-- Species allowed in enclosures
-- ---------------------------------------------------------------------------
INSERT INTO `species_enclosure` (`SpeciesID`, `EnclosureID`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 2);

-- ---------------------------------------------------------------------------
-- Animals
-- ---------------------------------------------------------------------------
INSERT INTO `animal` (`AnimalID`, `Name`, `SpeciesID`, `EnclosureID`, `Sex`, `DateOfBirth`, `AcquisitionDate`) VALUES
(1, 'Simba', 1, 1, 'Male', '2018-03-12', '2019-06-01'),
(2, 'Nala', 1, 1, 'Female', '2019-01-20', '2020-02-15'),
(3, 'Dumbo', 2, 2, 'Male', '2010-07-04', '2012-09-10'),
(4, 'Ellie', 2, 2, 'Female', '2012-11-11', '2014-01-05'),
(5, 'Flip', 3, 3, 'Male', '2016-05-22', '2017-08-30'),
(6, 'Splash', 3, 3, 'Female', NULL, '2018-04-12'),
(7, 'Waddles', 4, 4, 'Male', '2020-12-01', '2021-03-18'),
(8, 'Mei', 5, 5, 'Female', '2017-09-09', '2019-10-01'),
(9, 'Skip', 6, 2, 'Male', '2019-04-14', '2020-06-20');

-- ---------------------------------------------------------------------------
-- Attractions (schedule-only)
-- ---------------------------------------------------------------------------
INSERT INTO `attraction` (`AttractionID`, `Name`, `Type`, `Schedule`, `Location`, `Capacity`, `IsIndoor`, `Status`) VALUES
(1, 'Dolphin Discovery', 'Show', '2026-10-25 14:00:00', 'Marine Theater', 250, 1, 'Open'),
(2, 'Penguin Feeding', 'Exhibit Event', '2026-10-25 11:00:00', 'Polar Pavilion', 80, 1, 'Open'),
(3, 'Night Safari Walk', 'Tour', '2026-10-25 19:30:00', 'Savanna Trail', 40, 0, 'Open'),
(4, 'Keeper Talk: Lions', 'Talk', '2026-10-26 13:00:00', 'Lion Habitat Overlook', 60, 0, 'Scheduled');

-- ---------------------------------------------------------------------------
-- Customers
-- ---------------------------------------------------------------------------
INSERT INTO `customer` (`CustomerID`, `FirstName`, `LastName`, `EmailAddress`, `PhoneNumber`, `MembershipType`) VALUES
(1, 'Ava', 'Martinez', 'ava.martinez@email.com', '713-555-0101', 'None'),
(2, 'Jordan', 'Lee', 'jordan.lee@email.com', '713-555-0102', 'Gold'),
(3, 'Sam', 'Patel', 'sam.patel@email.com', '713-555-0103', NULL),
(4, 'Riley', 'Nguyen', 'riley.nguyen@email.com', '713-555-0104', 'Silver'),
(5, 'Casey', 'Brooks', 'casey.brooks@email.com', '713-555-0105', 'None');

-- ---------------------------------------------------------------------------
-- Employees (managers first so SupervisorID FKs resolve)
-- ---------------------------------------------------------------------------
INSERT INTO `employee` (
  `EmployeeID`, `FirstName`, `LastName`, `Age`, `Gender`, `JobRole`, `HireDate`,
  `PhoneNumber`, `EmailAddress`, `Salary`, `SupervisorID`, `EnclosureID`, `Username`, `PasswordHash`
) VALUES
(1, 'Morgan', 'Clark', 42, 'Female', 'Director', '2015-03-01', '713-555-1001', 'morgan.clark@zoo.com', 95000.00, NULL, NULL, 'mclark', 'seed_hash_mclark'),
(2, 'Alex', 'Rivera', 35, 'Male', 'Head Keeper', '2017-06-15', '713-555-1002', 'alex.rivera@zoo.com', 62000.00, 1, 1, 'arivera', 'seed_hash_arivera'),
(3, 'Taylor', 'Kim', 29, 'Female', 'Keeper', '2020-01-10', '713-555-1003', 'taylor.kim@zoo.com', 48000.00, 2, 1, 'tkim', 'seed_hash_tkim'),
(4, 'Jamie', 'Ortiz', 31, 'Male', 'Keeper', '2019-08-22', '713-555-1004', 'jamie.ortiz@zoo.com', 49000.00, 2, 3, 'jortiz', 'seed_hash_jortiz'),
(5, 'Quinn', 'Baker', 26, 'Non-binary', 'Cashier', '2022-05-01', '713-555-1005', 'quinn.baker@zoo.com', 38000.00, 1, NULL, 'qbaker', 'seed_hash_qbaker'),
(6, 'Drew', 'Singh', 38, 'Male', 'Veterinarian', '2016-11-12', '713-555-1006', 'drew.singh@zoo.com', 78000.00, 1, 5, 'dsingh', 'seed_hash_dsingh');

-- ---------------------------------------------------------------------------
-- Gift shops & food stands
-- ---------------------------------------------------------------------------
INSERT INTO `giftshop` (`ShopID`, `Name`, `Location`) VALUES
(1, 'Safari Souvenirs', 'Main Plaza'),
(2, 'Panda Place Gifts', 'Zone D');

INSERT INTO `foodstand` (`StandID`, `Name`, `Location`) VALUES
(1, 'Savanna Snacks', 'Zone A'),
(2, 'Lagoon Bites', 'Zone C');

-- ---------------------------------------------------------------------------
-- Products (exactly one of ShopID / StandID)
-- ---------------------------------------------------------------------------
INSERT INTO `product` (`ProductID`, `Name`, `Price`, `Category`, `QuantityInStock`, `ShopID`, `StandID`) VALUES
(1, 'Plush Lion', 18.99, 'Merchandise', 40, 1, NULL),
(2, 'Zoo T-Shirt', 24.99, 'Apparel', 55, 1, NULL),
(3, 'Panda Mug', 12.50, 'Merchandise', 30, 2, NULL),
(4, 'Bamboo Keychain', 6.99, 'Merchandise', 80, 2, NULL),
(5, 'Soft Pretzel', 4.50, 'Food', 100, NULL, 1),
(6, 'Lemonade', 3.25, 'Beverage', 120, NULL, 1),
(7, 'Fish & Chips', 9.75, 'Food', 60, NULL, 2),
(8, 'Bottled Water', 2.50, 'Beverage', 200, NULL, 2);

-- ---------------------------------------------------------------------------
-- Tickets & parking passes
-- ---------------------------------------------------------------------------
INSERT INTO `ticket` (`TicketID`, `Type`, `Date`, `Price`) VALUES
(1, 'Adult', '2026-10-20', 29.99),
(2, 'Child', '2026-10-20', 19.99),
(3, 'Adult', '2026-10-21', 29.99),
(4, 'Senior', '2026-10-21', 24.99),
(5, 'Adult', '2026-10-22', 29.99);

INSERT INTO `parking` (`PassID`, `Type`, `Date`, `Price`) VALUES
(1, 'Standard', '2026-10-20', 12.00),
(2, 'Standard', '2026-10-21', 12.00),
(3, 'Premium', '2026-10-21', 20.00),
(4, 'Standard', '2026-10-22', 12.00);

-- ---------------------------------------------------------------------------
-- Transactions (no TotalAmount — use v_transaction_totals)
-- ---------------------------------------------------------------------------
INSERT INTO `transaction` (`TransactionID`, `CustomerID`, `Date`, `PaymentType`) VALUES
(1, 1, '2026-10-20 10:15:00', 'Card'),
(2, 2, '2026-10-21 11:05:00', 'Card'),
(3, 3, '2026-10-21 14:40:00', 'Cash'),
(4, 4, '2026-10-22 09:50:00', 'Card');

-- ---------------------------------------------------------------------------
-- Line items (no Subtotal — use v_lineitem_detail)
-- ---------------------------------------------------------------------------
INSERT INTO `transactionlineitem` (
  `LineItemID`, `TransactionID`, `Quantity`, `ItemType`, `UnitPrice`,
  `TicketID`, `ProductID`, `PassID`
) VALUES
(1, 1, 1, 'Ticket', 29.99, 1, NULL, NULL),
(2, 1, 1, 'Ticket', 19.99, 2, NULL, NULL),
(3, 1, 1, 'Parking', 12.00, NULL, NULL, 1),
(4, 2, 1, 'Ticket', 29.99, 3, NULL, NULL),
(5, 2, 1, 'Ticket', 24.99, 4, NULL, NULL),
(6, 2, 1, 'Product', 4.50, NULL, 5, NULL),
(7, 2, 1, 'Parking', 12.00, NULL, NULL, 2),
(8, 3, 2, 'Product', 18.99, NULL, 1, NULL),
(9, 3, 1, 'Product', 3.25, NULL, 6, NULL),
(10, 3, 1, 'Parking', 20.00, NULL, NULL, 3),
(11, 4, 1, 'Ticket', 29.99, 5, NULL, NULL),
(12, 4, 1, 'Product', 24.99, NULL, 2, NULL),
(13, 4, 1, 'Parking', 12.00, NULL, NULL, 4);

-- ---------------------------------------------------------------------------
-- Zoo closures
-- ---------------------------------------------------------------------------
INSERT INTO `zooclosure` (`ClosureID`, `Date`, `Scope`, `Reason`, `EnclosureID`, `AttractionID`) VALUES
(1, '2026-10-18', 'Full Zoo', 'Severe thunderstorm and park-wide flooding risk', NULL, NULL),
(2, '2026-10-23', 'Enclosure', 'Habitat fence maintenance', 1, NULL),
(3, '2026-10-25', 'Attraction', 'Stage equipment repair before evening show', NULL, 1);

SELECT 'Seed data loaded successfully' AS status;