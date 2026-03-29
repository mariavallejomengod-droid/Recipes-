import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import Layout from './components/Layout'
import RecipeList from './pages/RecipeList'
import RecipeDetail from './pages/RecipeDetail'
import RecipeForm from './pages/RecipeForm'
import WeekPlanner from './pages/WeekPlanner'
import ShoppingList from './pages/ShoppingList'
import DietGuide from './pages/DietGuide'
import { getRecipes, saveRecipes } from './utils/storage'
import { getInitialRecipes } from './utils/initialRecipes'
import { getTranslatedRecipes } from './utils/recipeTranslations'
import { useTranslation } from './i18n'

const APP_VERSION = 5

function syncRecipes() {
  const currentVersion = parseInt(localStorage.getItem('recetario_version') || '0', 10)
  const defaults = getInitialRecipes()

  if (currentVersion < APP_VERSION) {
    // Force full reset of default recipes + remap plan IDs
    const stored = getRecipes()
    const defaultNames = new Set(defaults.map(r => r.nombre))
    const storedNames = new Map(stored.map(r => [r.nombre, r.id]))
    const idMap = new Map()

    for (const d of defaults) {
      const oldId = storedNames.get(d.nombre)
      if (oldId && oldId !== d.id) idMap.set(oldId, d.id)
    }

    // Keep user-created recipes, replace everything else with defaults
    const userRecipes = stored.filter(r => !defaultNames.has(r.nombre))
    const merged = [...defaults, ...userRecipes]
    saveRecipes(merged)

    // Remap IDs in weekly plans
    if (idMap.size > 0) {
      const plansRaw = localStorage.getItem('recetario_plans')
      if (plansRaw) {
        let updated = plansRaw
        for (const [oldId, newId] of idMap) {
          updated = updated.replaceAll(JSON.stringify(oldId), JSON.stringify(newId))
        }
        localStorage.setItem('recetario_plans', updated)
      }
    }

    localStorage.setItem('recetario_version', String(APP_VERSION))
    return merged
  }

  // Normal sync: just add any missing default recipes
  const stored = getRecipes()
  const storedIds = new Set(stored.map(r => r.id))
  const missing = defaults.filter(d => !storedIds.has(d.id))
  if (missing.length > 0) {
    const merged = [...stored, ...missing]
    saveRecipes(merged)
    return merged
  }

  return stored
}

export default function App() {
  const { lang } = useTranslation()
  const [recipes, setRecipes] = useState([])
  useEffect(() => {
    let stored = getRecipes()
    if (stored.length === 0) {
      const defaults = getInitialRecipes()
      saveRecipes(defaults)
      localStorage.setItem('recetario_version', String(APP_VERSION))
      stored = defaults
    } else {
      stored = syncRecipes()
    }
    setRecipes(stored)
  }, [])

  function refreshRecipes() {
    setRecipes(getRecipes())
  }

  // Translate built-in recipe names/descriptions based on current language
  const translatedRecipes = useMemo(() => getTranslatedRecipes(recipes, lang), [recipes, lang])

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<WeekPlanner recipes={translatedRecipes} />} />
          <Route path="recipes" element={<RecipeList recipes={translatedRecipes} onUpdate={refreshRecipes} />} />
          <Route path="recipes/new" element={<RecipeForm onSave={refreshRecipes} />} />
          <Route path="recipes/:id" element={<RecipeDetail recipes={translatedRecipes} onUpdate={refreshRecipes} />} />
          <Route path="recipes/:id/edit" element={<RecipeForm onSave={refreshRecipes} recipes={recipes} />} />
          <Route path="diet" element={<DietGuide />} />
          <Route path="shopping" element={<ShoppingList />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
