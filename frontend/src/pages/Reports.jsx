import ReportPage from '../components/ReportPage.jsx'

// the 3 reports, all use ReportPage
// sql for these is in database/views.sql

export function OccupancyReport() {
  return (
    <ReportPage
      title="Enclosure Occupancy"
      description="How full each enclosure is compared to its capacity."
      url="/api/reports/enclosure-occupancy"
      rowKey="EnclosureID"
      columns={[
        { key: 'EnclosureName', label: 'Enclosure' },
        { key: 'Capacity', label: 'Capacity' },
        { key: 'AnimalCount', label: 'Animals' },
        { key: 'RemainingCapacity', label: 'Spots Left' },
        { key: 'CapacityPercentage', label: '% Full' },
      ]}
    />
  )
}

export function ProductSalesReport() {
  return (
    <ReportPage
      title="Product Sales"
      description="Units sold and revenue for every product."
      url="/api/reports/product-sales"
      rowKey="ProductID"
      columns={[
        { key: 'Name', label: 'Product' },
        { key: 'ShopID', label: 'Shop #' },
        { key: 'UnitsSold', label: 'Units Sold' },
        { key: 'Revenue', label: 'Revenue', isMoney: true },
      ]}
    />
  )
}

export function CustomerSpendingReport() {
  return (
    <ReportPage
      title="Customer Spending"
      description="How many purchases each customer made and how much they spent in total."
      url="/api/reports/customer-spending"
      rowKey="CustomerID"
      columns={[
        { key: 'Email', label: 'Customer' },
        { key: 'TransactionCount', label: 'Purchases' },
        { key: 'LifetimeSpend', label: 'Total Spent', isMoney: true },
      ]}
    />
  )
}