import { useEffect, useState } from 'react'
import QueryPage from '../components/QueryPage.jsx'

// the 3 queries. each is QueryPage with different filters + columns

export function AnimalSearch() {
  // enclosure dropdown options come from the database
  const [enclosures, setEnclosures] = useState([])

  useEffect(() => {
    async function loadEnclosures() {
      const response = await fetch('/api/enclosures')
      setEnclosures(await response.json())
    }
    loadEnclosures()
  }, [])

  return (
    <QueryPage
      title="Find Animals"
      description="Search animals by species, enclosure, and sex. Leave a box empty to skip it."
      url="/api/animals/search"
      rowKey="AnimalID"
      fields={[
        { name: 'species', label: 'Species' },
        {
          name: 'enclosureId',
          label: 'Enclosure',
          type: 'select',
          // turn each enclosure into a dropdown option
          options: enclosures.map((en) => ({ value: en.EnclosureID, label: en.Name })),
        },
        {
          name: 'sex',
          label: 'Sex',
          type: 'select',
          options: [
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
          ],
        },
      ]}
      columns={[
        { key: 'AnimalName', label: 'Name' },
        { key: 'Species', label: 'Species' },
        { key: 'ConservationStatus', label: 'Status' },
        { key: 'Enclosure', label: 'Enclosure' },
        { key: 'EnclosureStatus', label: 'Enclosure Open?' },
        { key: 'Sex', label: 'Sex' },
        { key: 'DateOfBirth', label: 'Born', isDate: true },
      ]}
    />
  )
}

export function SpeciesSearch() {
  return (
    <QueryPage
      title="Find Species"
      description="Search species by name, diet, or conservation status."
      url="/api/species/search"
      rowKey="SpeciesID"
      fields={[{ name: 'q', label: 'Name, diet, or status' }]}
      columns={[
        { key: 'CommonName', label: 'Species' },
        { key: 'ScientificName', label: 'Scientific Name' },
        { key: 'Diet', label: 'Diet' },
        { key: 'ConservationStatus', label: 'Status' },
        { key: 'AnimalCount', label: 'Animals' },
        { key: 'Enclosures', label: 'Enclosures' },
      ]}
    />
  )
}

export function ProductSearch() {
  return (
    <QueryPage
      title="Find Products"
      description="Search products by name, category, or shop."
      url="/api/products/search"
      rowKey="ProductID"
      fields={[{ name: 'q', label: 'Product, category, or shop' }]}
      columns={[
        { key: 'ProductName', label: 'Product' },
        { key: 'Category', label: 'Category' },
        { key: 'Price', label: 'Price', isMoney: true },
        { key: 'QuantityInStock', label: 'In Stock' },
        { key: 'ShopName', label: 'Shop' },
      ]}
    />
  )
}