// remembers which customer is logged in (saved in the browser)
// the actual login/signup checks happen on the backend

// who's logged in right now (null = nobody)
export function getLoggedInCustomer() {
  return JSON.parse(localStorage.getItem('customer'))
}

// save who logged in, using what the backend sent back
export function loginCustomer(data) {
  localStorage.setItem('customer', JSON.stringify({
    username: data.username,
    email: data.email || null,
    customerId: data.customerId,
  }))
}

export function logoutCustomer() {
  localStorage.removeItem('customer')
}
