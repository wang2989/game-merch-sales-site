/**
 * Shared item shape used across the app.
 *
 * @typedef {Object} Item
 * @property {string} id       Unique, stable identifier (key in cart.buyQuantity)
 * @property {string} name     Display name
 * @property {number} price    Unit price in USD
 * @property {number} stock    Quantity available to purchase
 * @property {string} [image]  Image URL (e.g. imported from src/assets); blank for now
 */

/** @returns {Item} */
export function createItem({ id, name, price, stock = 0, image = '' }) {
  return { id, name, price, stock, image }
}
