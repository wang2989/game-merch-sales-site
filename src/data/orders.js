const orderUrl =
  'https://21eoglg9h6.execute-api.us-east-2.amazonaws.com/dev/order-processing/order'

export async function placeOrder(order) {
  const response = await fetch(orderUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })

  if (response.status === 409) {
    throw new Error('One or more items are out of stock. Please update your cart and try again.')
  }
  if (response.status === 400) {
    throw new Error('The order is missing required information. Please review your shipping and payment details.')
  }
  if (response.status === 502) {
    throw new Error('The inventory service is unavailable. Please try again later.')
  }
  if (response.status !== 201) {
    throw new Error(`Unable to place your order (HTTP ${response.status}). Please try again.`)
  }

  const result = await response.json()
  if (
    !result ||
    typeof result.confirmationNumber !== 'string' ||
    result.confirmationNumber.length === 0 ||
    !Number.isFinite(Number(result.total))
  ) {
    throw new Error('The order was accepted, but the confirmation response was invalid.')
  }

  return {
    confirmationNumber: result.confirmationNumber,
    totalAmount: Number(result.total),
  }
}
