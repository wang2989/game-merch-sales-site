const inventoryUrl =
  'https://21eoglg9h6.execute-api.us-east-2.amazonaws.com/dev/inventory-management/inventory'

export async function fetchItems(signal) {
  const response = await fetch(inventoryUrl, { signal })

  if (!response.ok) {
    throw new Error(`Inventory request failed (${response.status})`)
  }

  const data = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('Inventory response must be an array')
  }

  return data.map((item, index) => {
    if (
      item === null ||
      typeof item !== 'object' ||
      (typeof item.id !== 'string' && typeof item.id !== 'number') ||
      typeof item.name !== 'string' ||
      !Number.isFinite(item.price) ||
      !Number.isFinite(item.stock)
    ) {
      throw new Error(`Inventory item at position ${index} is invalid`)
    }

    return {
      id: String(item.id),
      name: item.name,
      price: item.price,
      stock: item.stock,
      image: typeof item.image === 'string' ? item.image.trim() : '',
    }
  })
}
