import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Snowflake, Heart, ChefHat, CalendarPlus } from 'lucide-react'
import { RECIPE_TAGS, MEAL_CATEGORIES } from '../data/categories'
import { useTranslation } from '../i18n'
import PlannerModal from './PlannerModal'

export default function RecipeCard({ recipe, compact = false }) {
  const { t } = useTranslation()
  const [showPlanner, setShowPlanner] = useState(false)
  const tagData = RECIPE_TAGS.filter(t => recipe.etiquetas?.includes(t.id))
  const catData = MEAL_CATEGORIES.filter(c => recipe.categorias?.includes(c.id))

  return (
    <>
      <div className="relative bg-white rounded-xl border border-warm-200 hover:border-sage-300 hover:shadow-md transition-all">
        <Link
          to={`/recipes/${recipe.id}`}
          className="block p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-black text-base leading-snug pr-8">{recipe.nombre}</h3>
            {recipe.favorita && <Heart size={16} className="text-peach-500 fill-peach-500 shrink-0 mt-0.5" />}
          </div>

          {catData.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {catData.map(c => (
                <span key={c.id} className="text-xs px-1.5 py-0.5 rounded bg-warm-100 text-black/60">
                  {c.emoji} {t(`cat.${c.id}`)}
                </span>
              ))}
              {recipe.source === 'user' && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-sage-100 text-sage-700 font-medium">
                  {t('card.mine')}
                </span>
              )}
            </div>
          )}

          {!compact && recipe.descripcion && (
            <p className="text-sm text-black/60 mt-1.5 line-clamp-2">{recipe.descripcion}</p>
          )}

          <div className="flex items-center gap-3 mt-2.5 text-sm text-black/60">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {recipe.tiempoMinutos} min
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              {recipe.raciones} {t('card.serv')}
            </span>
            {recipe.batchCooking && (
              <span className="flex items-center gap-1 text-sage-700">
                <ChefHat size={14} />
                {t('card.batch')}
              </span>
            )}
            {recipe.congelable && (
              <span className="flex items-center gap-1 text-blue-600">
                <Snowflake size={14} />
              </span>
            )}
          </div>

          {!compact && tagData.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tagData.slice(0, 3).map(tag => (
                <span key={tag.id} className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${tag.color}`}>
                  {t(`tag.${tag.id}`)}
                </span>
              ))}
              {tagData.length > 3 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-warm-100 text-black/50">
                  +{tagData.length - 3}
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Add to planner button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowPlanner(true)
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-sage-50 border border-sage-200 flex items-center justify-center text-sage-600 hover:bg-sage-100 hover:text-sage-700 transition-colors"
          title={t('detail.addToPlanner')}
        >
          <CalendarPlus size={16} />
        </button>
      </div>

      {showPlanner && (
        <PlannerModal recipe={recipe} onClose={() => setShowPlanner(false)} />
      )}
    </>
  )
}
