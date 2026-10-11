import { createItem } from '../types/item'
import minecraftHoodie from '../assets/minecraft_hoodie.jpeg'
import robloxShirt from '../assets/roblox_shirt.jpeg'
import fortniteSweater from '../assets/fortnite_sweater.jpg'
import marioHat from '../assets/mario_hat.jpg'
import fallguysShirt from '../assets/fallguys_shirt.jpg'

export const items = [
  createItem({ id: 'minecraft-hoodie', name: 'Minecraft Hoodie', price: 44.99, stock: 25, image: minecraftHoodie }),
  createItem({ id: 'roblox-shirt', name: 'Roblox Shirt', price: 24.99, stock: 40, image: robloxShirt }),
  createItem({ id: 'fortnite-sweater', name: 'Fortnite Sweater', price: 39.99, stock: 30, image: fortniteSweater }),
  createItem({ id: 'mario-hat', name: 'Mario Hat', price: 19.99, stock: 50, image: marioHat }),
  createItem({ id: 'fallguys-shirt', name: 'Fallguys Shirt', price: 24.99, stock: 35, image: fallguysShirt }),
]

export const itemsById = Object.fromEntries(items.map((item) => [item.id, item]))
