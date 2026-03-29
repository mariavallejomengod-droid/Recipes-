const KEYS = {
  RECIPES: 'recetario_recipes',
  WEEKLY_PLANS: 'recetario_plans',
  SHOPPING_LISTS: 'recetario_shopping',
}

function load(key, fallback = []) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// Recipes
export function getRecipes() {
  return load(KEYS.RECIPES, [])
}

export function saveRecipes(recipes) {
  save(KEYS.RECIPES, recipes)
}

export function getRecipeById(id) {
  return getRecipes().find(r => r.id === id) || null
}

export function addRecipe(recipe) {
  const recipes = getRecipes()
  const newRecipe = { ...recipe, id: generateId(), source: recipe.source || 'user', creadaEn: new Date().toISOString().split('T')[0] }
  recipes.push(newRecipe)
  saveRecipes(recipes)
  return newRecipe
}

export function updateRecipe(id, updates) {
  const recipes = getRecipes().map(r => r.id === id ? { ...r, ...updates } : r)
  saveRecipes(recipes)
}

export function deleteRecipe(id) {
  saveRecipes(getRecipes().filter(r => r.id !== id))
}

export function toggleFavorite(id) {
  const recipes = getRecipes().map(r => r.id === id ? { ...r, favorita: !r.favorita } : r)
  saveRecipes(recipes)
}

// Weekly Plans
export function getWeeklyPlan(weekStart) {
  const plans = load(KEYS.WEEKLY_PLANS, {})
  return plans[weekStart] || null
}

export function saveWeeklyPlan(weekStart, plan) {
  const plans = load(KEYS.WEEKLY_PLANS, {})
  plans[weekStart] = plan
  save(KEYS.WEEKLY_PLANS, plans)
}

// Shopping Lists
export function getShoppingList(weekStart) {
  const lists = load(KEYS.SHOPPING_LISTS, {})
  return lists[weekStart] || null
}

export function saveShoppingList(weekStart, list) {
  const lists = load(KEYS.SHOPPING_LISTS, {})
  lists[weekStart] = list
  save(KEYS.SHOPPING_LISTS, lists)
}

// Export/Import
export function exportAllData() {
  return JSON.stringify({
    recipes: getRecipes(),
    plans: load(KEYS.WEEKLY_PLANS, {}),
    shopping: load(KEYS.SHOPPING_LISTS, {}),
    exportedAt: new Date().toISOString(),
  }, null, 2)
}

export function importAllData(jsonString) {
  const data = JSON.parse(jsonString)
  if (data.recipes) save(KEYS.RECIPES, data.recipes)
  if (data.plans) save(KEYS.WEEKLY_PLANS, data.plans)
  if (data.shopping) save(KEYS.SHOPPING_LISTS, data.shopping)
}

// Week helpers
export function getMonday(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function formatWeekKey(date) {
  return date.toISOString().split('T')[0]
}

export function formatDateRange(mondayDate, lang = 'en') {
  const sunday = new Date(mondayDate)
  sunday.setDate(sunday.getDate() + 6)
  const localeMap = { es: 'es-ES', pl: 'pl-PL', en: 'en-US' }
  const locale = localeMap[lang] || 'en-US'
  const opts = { day: 'numeric', month: 'short' }
  return `${mondayDate.toLocaleDateString(locale, opts)} - ${sunday.toLocaleDateString(locale, opts)}`
}
