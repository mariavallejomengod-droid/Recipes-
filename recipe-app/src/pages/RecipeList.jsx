import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Filter, X } from 'lucide-react'
import RecipeCard from '../components/RecipeCard'
import { MEAL_CATEGORIES, RECIPE_TAGS } from '../data/categories'
import { useTranslation } from '../i18n'

export default function RecipeList({ recipes }) {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [showBatchOnly, setShowBatchOnly] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sourceFilter, setSourceFilter] = useState('all')

  const SOURCE_FILTERS = [
    { id: 'all', label: t('recipes.all') },
    { id: 'user', label: t('recipes.mine') },
    { id: 'default', label: t('recipes.suggested') },
    { id: 'dietpro', label: t('recipes.fructose') },
  ]

  const filtered = recipes.filter(r => {
    if (search && !r.nombre.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedCategory && !r.categorias?.includes(selectedCategory)) return false
    if (selectedTags.length > 0 && !selectedTags.some(t => r.etiquetas?.includes(t))) return false
    if (showBatchOnly && !r.batchCooking) return false
    if (showFavoritesOnly && !r.favorita) return false
    if (sourceFilter !== 'all' && (r.source || 'default') !== sourceFilter) return false
    return true
  })

  const hasActiveFilters = selectedCategory || selectedTags.length > 0 || showBatchOnly || showFavoritesOnly || sourceFilter !== 'all'

  const userCount = recipes.filter(r => r.source === 'user').length
  const defaultCount = recipes.filter(r => !r.source || r.source === 'default').length
  const dietproCount = recipes.filter(r => r.source === 'dietpro').length

  function clearFilters() {
    setSelectedCategory(null)
    setSelectedTags([])
    setShowBatchOnly(false)
    setShowFavoritesOnly(false)
    setSourceFilter('all')
  }

  function toggleTag(tagId) {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">{t('recipes.title')}</h1>
        <Link
          to="/recipes/new"
          className="flex items-center gap-1.5 bg-sage-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-sage-700 transition-colors"
        >
          <Plus size={16} /> {t('recipes.new')}
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
        <input
          type="text"
          placeholder={t('recipes.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400"
        />
      </div>

      {/* Source tabs */}
      <div className="flex gap-1 bg-warm-100 rounded-lg p-1">
        {SOURCE_FILTERS.map(sf => (
          <button
            key={sf.id}
            onClick={() => setSourceFilter(sf.id)}
            className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${
              sourceFilter === sf.id
                ? 'bg-white text-black shadow-sm'
                : 'text-black/50 hover:text-black/70'
            }`}
          >
            {sf.label}
            <span className="ml-1 text-xs text-black/40">
              {sf.id === 'all' ? recipes.length : sf.id === 'user' ? userCount : sf.id === 'dietpro' ? dietproCount : defaultCount}
            </span>
          </button>
        ))}
      </div>

      {/* Meal category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border shrink-0 transition-colors ${
            (selectedTags.length > 0 || showBatchOnly || showFavoritesOnly) ? 'bg-sage-100 border-sage-400 text-sage-700' : 'border-warm-300 text-black/60 hover:border-warm-400'
          }`}
        >
          <Filter size={14} />
          {t('recipes.filters')}
          {(selectedTags.length > 0 || showBatchOnly || showFavoritesOnly) && (
            <button onClick={e => { e.stopPropagation(); clearFilters() }} className="ml-1">
              <X size={12} />
            </button>
          )}
        </button>
        {MEAL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
            className={`text-sm px-3 py-1.5 rounded-full border shrink-0 transition-colors ${
              selectedCategory === cat.id
                ? 'bg-sage-100 border-sage-400 text-sage-700'
                : 'border-warm-300 text-black/60 hover:border-warm-400'
            }`}
          >
            {cat.emoji} {t(`cat.${cat.id}`)}
          </button>
        ))}
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-warm-200 p-4 space-y-3">
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm text-black/70">
              <input
                type="checkbox"
                checked={showBatchOnly}
                onChange={e => setShowBatchOnly(e.target.checked)}
                className="rounded"
              />
              {t('recipes.batchOnly')}
            </label>
            <label className="flex items-center gap-2 text-sm text-black/70">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={e => setShowFavoritesOnly(e.target.checked)}
                className="rounded"
              />
              {t('recipes.favoritesOnly')}
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-black mb-2">{t('recipes.tags')}</p>
            <div className="flex flex-wrap gap-1.5">
              {RECIPE_TAGS.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                    selectedTags.includes(tag.id) ? tag.color : 'bg-warm-100 text-black/50'
                  }`}
                >
                  {t(`tag.${tag.id}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <p className="text-sm text-black/50">
        {filtered.length} {filtered.length !== 1 ? t('recipes.recipes') : t('recipes.recipe')}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-black/40">
          <p className="text-base">{t('recipes.noResults')}</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-sage-600 underline mt-2">
              {t('recipes.clearFilters')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
