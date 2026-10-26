import fallguysShirt from '../assets/fallguys_shirt.jpg'
import fortniteSweater from '../assets/fortnite_sweater.jpg'
import marioHat from '../assets/mario_hat.jpg'
import minecraftHoodie from '../assets/minecraft_hoodie.jpeg'
import robloxShirt from '../assets/roblox_shirt.jpeg'

const inventoryUrl =
  'https://21eoglg9h6.execute-api.us-east-2.amazonaws.com/dev/inventory-management/inventory'

const imagesByProductName = {
  'fallguys shirt': fallguysShirt,
  'fortnite sweater': fortniteSweater,
  'mario hat': marioHat,
  'minecraft hoodie': minecraftHoodie,
  'roblox shirt': robloxShirt,
}

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
      image: imagesByProductName[item.name.trim().toLowerCase()] ?? '',
    }
  })
}
