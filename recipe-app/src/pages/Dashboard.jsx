import { Link } from 'react-router-dom'
import { BookOpen, Calendar, ShoppingCart, Plus, Heart, ChefHat } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'
import { getWeeklyPlan, getMonday, formatWeekKey, formatDateRange } from '../utils/storage'

export default function Dashboard({ recipes }) {
  const monday = getMonday()
  const weekKey = formatWeekKey(monday)
  const plan = getWeeklyPlan(weekKey)

  const favorites = recipes.filter(r => r.favorita).slice(0, 4)
  const batchRecipes = recipes.filter(r => r.batchCooking).slice(0, 3)

  const plannedCount = plan
    ? Object.values(plan).reduce((sum, day) => sum + Object.values(day).filter(Boolean).length, 0)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Hello!</h1>
        <p className="text-black/60 text-base mt-1">
          Week of {formatDateRange(monday)}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/planner"
          className="flex items-center gap-3 p-4 bg-sage-50 rounded-xl border border-sage-200 hover:border-sage-400 transition-colors"
        >
          <Calendar size={24} className="text-sage-600" />
          <div>
            <p className="text-sm font-semibold text-black">Plan the week</p>
            <p className="text-sm text-black/50">
              {plannedCount > 0 ? `${plannedCount} meals planned` : 'Not planned yet'}
            </p>
          </div>
        </Link>
        <Link
          to="/shopping"
          className="flex items-center gap-3 p-4 bg-peach-50 rounded-xl border border-peach-200 hover:border-peach-400 transition-colors"
        >
          <ShoppingCart size={24} className="text-peach-600" />
          <div>
            <p className="text-sm font-semibold text-black">Shopping list</p>
            <p className="text-sm text-black/50">Generated from plan</p>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-warm-200 p-3 text-center">
          <p className="text-2xl font-bold text-black">{recipes.length}</p>
          <p className="text-sm text-black/60">Recipes</p>
        </div>
        <div className="bg-white rounded-xl border border-warm-200 p-3 text-center">
          <p className="text-2xl font-bold text-black">{recipes.filter(r => r.batchCooking).length}</p>
          <p className="text-sm text-black/60">Batch cooking</p>
        </div>
        <div className="bg-white rounded-xl border border-warm-200 p-3 text-center">
          <p className="text-2xl font-bold text-black">{recipes.filter(r => r.favorita).length}</p>
          <p className="text-sm text-black/60">Favorites</p>
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-black flex items-center gap-2">
              <Heart size={18} className="text-peach-500" /> Favorites
            </h2>
            <Link to="/recipes" className="text-sm text-sage-600 hover:underline">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map(r => <RecipeCard key={r.id} recipe={r} compact />)}
          </div>
        </div>
      )}

      {/* Batch cooking ideas */}
      {batchRecipes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-black flex items-center gap-2 mb-3">
            <ChefHat size={18} className="text-sage-600" /> Batch cooking ideas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {batchRecipes.map(r => <RecipeCard key={r.id} recipe={r} compact />)}
          </div>
        </div>
      )}

      {/* Add recipe CTA */}
      <Link
        to="/recipes/new"
        className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-warm-300 rounded-xl text-black/40 hover:border-sage-400 hover:text-sage-600 transition-colors"
      >
        <Plus size={20} />
        <span className="text-base font-medium">Add new recipe</span>
      </Link>
    </div>
  )
}
