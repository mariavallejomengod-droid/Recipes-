import { INGREDIENT_CATEGORIES } from '../data/categories'

export function generateShoppingList(weekPlan, recipes) {
  if (!weekPlan) return []

  const ingredientMap = new Map()

  for (const daySlots of Object.values(weekPlan)) {
    for (const recipeId of Object.values(daySlots)) {
      if (!recipeId || recipeId.startsWith('freetext:')) continue
      const recipe = recipes.find(r => r.id === recipeId)
      if (!recipe) continue

      for (const ing of recipe.ingredientes) {
        const key = ing.nombre.toLowerCase().trim()
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)
          if (existing.unidad === ing.unidad && ing.cantidad) {
            existing.cantidad += ing.cantidad
          }
          if (!existing.recetas.includes(recipe.nombre)) {
            existing.recetas.push(recipe.nombre)
          }
        } else {
          ingredientMap.set(key, {
            nombre: ing.nombre,
            cantidad: ing.cantidad || 0,
            unidad: ing.unidad || '',
            categoria: ing.categoria || 'other',
            comprado: false,
            recetas: [recipe.nombre],
          })
        }
      }
    }
  }

  const items = Array.from(ingredientMap.values())

  const categoryOrder = INGREDIENT_CATEGORIES.map(c => c.id)
  items.sort((a, b) => {
    const ai = categoryOrder.indexOf(a.categoria)
    const bi = categoryOrder.indexOf(b.categoria)
    if (ai !== bi) return ai - bi
    return a.nombre.localeCompare(b.nombre, 'en')
  })

  return items
}

export function formatQuantity(cantidad, unidad) {
  if (!cantidad && !unidad) return ''
  if (!cantidad) return unidad
  if (unidad === 'to taste' || unidad === 'pinch') return unidad
  const num = Number.isInteger(cantidad) ? cantidad : cantidad.toFixed(1)
  return `${num} ${unidad}`
}

export function shoppingListToText(items) {
  let text = 'SHOPPING LIST\n==================\n\n'
  let currentCategory = ''

  for (const item of items) {
    if (item.categoria !== currentCategory) {
      currentCategory = item.categoria
      const cat = INGREDIENT_CATEGORIES.find(c => c.id === currentCategory)
      text += `\n${cat?.emoji || '🛒'} ${cat?.label || currentCategory}\n`
      text += '─'.repeat(30) + '\n'
    }
    const qty = formatQuantity(item.cantidad, item.unidad)
    const check = item.comprado ? '✅' : '⬜'
    text += `${check} ${item.nombre}${qty ? ` (${qty})` : ''}\n`
  }

  return text
}
