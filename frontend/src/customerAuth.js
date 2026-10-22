// TEMP fake customer accounts, saved in the browser until the db is ready
// later every function here becomes a call to the backend, pages won't change

const TEST_CUSTOMERS = [
  { firstName: 'Ava', lastName: 'Martinez', email: 'ava.martinez@email.com', phone: '713-555-0101', password: 'test123' },
]

// all accounts = test ones + anyone who signed up in this browser
export function getCustomers() {
  const saved = JSON.parse(localStorage.getItem('customers')) || []
  return [...TEST_CUSTOMERS, ...saved]
}

// save a new account
export function addCustomer(customer) {
  const saved = JSON.parse(localStorage.getItem('customers')) || []
  saved.push(customer)
  localStorage.setItem('customers', JSON.stringify(saved))
}

// who's logged in right now (null = nobody)
export function getLoggedInCustomer() {
  return JSON.parse(localStorage.getItem('customer'))
}

// remember who logged in (no password)
export function loginCustomer(customer) {
  localStorage.setItem('customer', JSON.stringify({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
  }))
}

export function logoutCustomer() {
  localStorage.removeItem('customer')
}