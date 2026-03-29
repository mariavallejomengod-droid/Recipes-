import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Users, Snowflake, Heart, ChefHat, Edit, Trash2, CalendarPlus } from 'lucide-react'
import { RECIPE_TAGS, MEAL_CATEGORIES } from '../data/categories'
import { toggleFavorite, deleteRecipe } from '../utils/storage'
import { formatQuantity } from '../utils/shoppingList'
import { useTranslation } from '../i18n'
import PlannerModal from '../components/PlannerModal'

export default function RecipeDetail({ recipes, onUpdate }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const recipe = recipes.find(r => r.id === id)

  const [showPlanner, setShowPlanner] = useState(false)

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-black/60">{t('detail.notFound')}</p>
        <Link to="/recipes" className="text-sage-600 text-sm underline mt-2 block">{t('detail.back')}</Link>
      </div>
    )
  }

  function handleToggleFavorite() {
    toggleFavorite(recipe.id)
    onUpdate()
  }

  function handleDelete() {
    if (window.confirm(t('detail.deleteConfirm'))) {
      deleteRecipe(recipe.id)
      onUpdate()
      navigate('/recipes')
    }
  }

  const tagData = RECIPE_TAGS.filter(tg => recipe.etiquetas?.includes(tg.id))
  const catData = MEAL_CATEGORIES.filter(c => recipe.categorias?.includes(c.id))

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <button onClick={() => navigate(-1)} className="mt-1 text-black/40 hover:text-black">
          <ArrowLeft size={22} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-black">{recipe.nombre}</h1>
          {recipe.descripcion && (
            <p className="text-base text-black/60 mt-1">{recipe.descripcion}</p>
          )}
        </div>
        <button onClick={handleToggleFavorite} className="mt-1">
          <Heart
            size={24}
            className={recipe.favorita ? 'text-peach-500 fill-peach-500' : 'text-warm-300 hover:text-peach-400'}
          />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-base text-black/70">
        <span className="flex items-center gap-1.5">
          <Clock size={18} /> {recipe.tiempoMinutos} min
        </span>
        <span className="flex items-center gap-1.5">
          <Users size={18} /> {recipe.raciones} {t('detail.servings')}
        </span>
        {recipe.batchCooking && (
          <span className="flex items-center gap-1.5 text-sage-700">
            <ChefHat size={18} /> {t('detail.batchCooking')}
          </span>
        )}
        {recipe.congelable && (
          <span className="flex items-center gap-1.5 text-blue-600">
            <Snowflake size={18} /> {t('detail.freezable')}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {catData.map(c => (
          <span key={c.id} className="text-sm px-2.5 py-1 rounded-full bg-warm-100 text-black/70">
            {c.emoji} {t(`cat.${c.id}`)}
          </span>
        ))}
        {tagData.map(tg => (
          <span key={tg.id} className={`text-sm px-2.5 py-1 rounded-full font-medium ${tg.color}`}>
            {t(`tag.${tg.id}`)}
          </span>
        ))}
      </div>

      {/* Add to planner button */}
      <button
        onClick={() => setShowPlanner(true)}
        className="flex items-center gap-2 w-full justify-center bg-sage-50 border border-sage-200 text-sage-700 text-base px-4 py-3 rounded-xl hover:bg-sage-100 transition-colors font-medium"
      >
        <CalendarPlus size={20} />
        {t('detail.addToPlanner')}
      </button>

      <div className="bg-white rounded-xl border border-warm-200 p-4">
        <h2 className="font-semibold text-black text-base mb-3">{t('detail.ingredients')}</h2>
        <ul className="space-y-2.5">
          {recipe.ingredientes?.map((ing, i) => (
            <li key={i} className="flex items-center gap-2 text-base">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500 shrink-0" />
              <span className="text-black">{ing.nombre}</span>
              {(ing.cantidad || ing.unidad) && (
                <span className="text-black/50 text-sm ml-auto">
                  {formatQuantity(ing.cantidad, ing.unidad)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-warm-200 p-4">
        <h2 className="font-semibold text-black text-base mb-3">{t('detail.instructions')}</h2>
        <ol className="space-y-3">
          {recipe.pasos?.map((paso, i) => (
            <li key={i} className="flex gap-3 text-base">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sage-100 text-sage-700 text-sm font-semibold shrink-0">
                {i + 1}
              </span>
              <p className="text-black/80 pt-0.5">{paso}</p>
            </li>
          ))}
        </ol>
      </div>

      {recipe.notas && (
        <div className="bg-peach-50 rounded-xl border border-peach-200 p-4">
          <p className="text-base text-black/70">{recipe.notas}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          to={`/recipes/${recipe.id}/edit`}
          className="flex items-center gap-1.5 bg-sage-600 text-white text-base px-4 py-2.5 rounded-lg hover:bg-sage-700 transition-colors"
        >
          <Edit size={18} /> {t('detail.edit')}
        </Link>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 text-red-500 text-base px-4 py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={18} /> {t('detail.delete')}
        </button>
      </div>

      {showPlanner && (
        <PlannerModal recipe={recipe} onClose={() => setShowPlanner(false)} />
      )}
    </div>
  )
}
