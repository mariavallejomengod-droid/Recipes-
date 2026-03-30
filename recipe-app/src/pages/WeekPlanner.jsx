import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Type, RotateCcw, CopyPlus, ShoppingCart, Plus, Check } from 'lucide-react'
import { getWeeklyPlan, saveWeeklyPlan, getMonday, formatWeekKey, formatDateRange, getShoppingList, saveShoppingList } from '../utils/storage'
import { useTranslation } from '../i18n'

const FREETEXT_PREFIX = 'freetext:'

const DAY_IDS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const SLOT_IDS = ['breakfast', 'lunch', 'dinner', 'snack']

function isFreeText(value) {
  return typeof value === 'string' && value.startsWith(FREETEXT_PREFIX)
}

function getFreeText(value) {
  return value.slice(FREETEXT_PREFIX.length)
}

export default function WeekPlanner({ recipes }) {
  const { t, lang } = useTranslation()
  const [currentMonday, setCurrentMonday] = useState(() => getMonday())
  const [plan, setPlan] = useState({})
  const [selectingSlot, setSelectingSlot] = useState(null)
  const [recipeSearch, setRecipeSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [freeTextMode, setFreeTextMode] = useState(false)
  const [freeTextValue, setFreeTextValue] = useState('')
  // Shopping items step after free text
  const [shoppingStep, setShoppingStep] = useState(false)
  const [shoppingInput, setShoppingInput] = useState('')
  const [addedItems, setAddedItems] = useState([])

  const weekKey = formatWeekKey(currentMonday)

  useEffect(() => {
    const stored = getWeeklyPlan(weekKey)
    if (stored) {
      setPlan(stored)
    } else {
      const empty = {}
      DAY_IDS.forEach(d => {
        empty[d] = { breakfast: null, lunch: null, dinner: null, snack: null }
      })
      setPlan(empty)
    }
  }, [weekKey])

  function changeWeek(delta) {
    setCurrentMonday(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7 * delta)
      return d
    })
  }

  function assignRecipe(recipeId) {
    if (!selectingSlot) return
    const { day, slot } = selectingSlot
    const updated = {
      ...plan,
      [day]: { ...plan[day], [slot]: recipeId },
    }
    setPlan(updated)
    saveWeeklyPlan(weekKey, updated)
    closeModal()
  }

  function assignFreeText() {
    if (!selectingSlot || !freeTextValue.trim()) return
    const { day, slot } = selectingSlot
    const updated = {
      ...plan,
      [day]: { ...plan[day], [slot]: FREETEXT_PREFIX + freeTextValue.trim() },
    }
    setPlan(updated)
    saveWeeklyPlan(weekKey, updated)
    // Move to shopping items step instead of closing
    setShoppingStep(true)
    setAddedItems([])
    setShoppingInput('')
  }

  function addShoppingItem() {
    if (!shoppingInput.trim()) return
    const item = {
      nombre: shoppingInput.trim(),
      cantidad: 0,
      unidad: '',
      categoria: 'other',
      comprado: false,
      manual: true,
    }
    const currentList = getShoppingList(weekKey) || []
    saveShoppingList(weekKey, [...currentList, item])
    setAddedItems(prev => [...prev, shoppingInput.trim()])
    setShoppingInput('')
  }

  function closeModal() {
    setSelectingSlot(null)
    setRecipeSearch('')
    setSourceFilter('all')
    setFreeTextMode(false)
    setFreeTextValue('')
    setShoppingStep(false)
    setShoppingInput('')
    setAddedItems([])
  }

  function clearSlot(day, slot) {
    const updated = {
      ...plan,
      [day]: { ...plan[day], [slot]: null },
    }
    setPlan(updated)
    saveWeeklyPlan(weekKey, updated)
  }

  function copyToAllDays(day, slot) {
    const value = plan[day]?.[slot]
    if (!value) return
    const updated = { ...plan }
    DAY_IDS.forEach(d => {
      updated[d] = { ...updated[d], [slot]: value }
    })
    setPlan(updated)
    saveWeeklyPlan(weekKey, updated)
  }

  function resetWeek() {
    if (!window.confirm(t('planner.resetConfirm'))) return
    const empty = {}
    DAY_IDS.forEach(d => {
      empty[d] = { breakfast: null, lunch: null, dinner: null, snack: null }
    })
    setPlan(empty)
    saveWeeklyPlan(weekKey, empty)
  }

  function getRecipeName(recipeId) {
    const r = recipes.find(r => r.id === recipeId)
    return r ? r.nombre : '???'
  }

  const filteredRecipes = recipes.filter(r => {
    if (recipeSearch && !r.nombre.toLowerCase().includes(recipeSearch.toLowerCase())) return false
    if (sourceFilter !== 'all' && (r.source || 'default') !== sourceFilter) return false
    return true
  }).sort((a, b) => {
    if (!selectingSlot) return 0
    const slot = selectingSlot.slot
    const aMatch = a.categorias?.includes(slot) ? 0 : 1
    const bMatch = b.categorias?.includes(slot) ? 0 : 1
    return aMatch - bMatch
  })

  const hasAnyMeals = Object.values(plan).some(day =>
    Object.values(day).some(v => v !== null)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">{t('planner.title')}</h1>
        {hasAnyMeals && (
          <button
            onClick={resetWeek}
            className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <RotateCcw size={14} />
            {t('planner.resetWeek')}
          </button>
        )}
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => changeWeek(-1)} className="p-1.5 rounded-lg hover:bg-warm-100 text-black/50">
          <ChevronLeft size={22} />
        </button>
        <span className="text-base font-medium text-black min-w-44 text-center">
          {formatDateRange(currentMonday, lang)}
        </span>
        <button onClick={() => changeWeek(1)} className="p-1.5 rounded-lg hover:bg-warm-100 text-black/50">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Week grid */}
      <div className="space-y-2">
        {DAY_IDS.map(dayId => (
          <div key={dayId} className="bg-white rounded-xl border border-warm-200 p-3">
            <p className="text-sm font-semibold text-black mb-2">{t(`day.${dayId}`)}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SLOT_IDS.map(slotId => {
                const slotValue = plan[dayId]?.[slotId]
                const isText = isFreeText(slotValue)
                return (
                  <div key={slotId}>
                    <p className="text-xs text-black/40 mb-1">{t(`cat.${slotId}`)}</p>
                    {slotValue ? (
                      <div className={`flex items-start gap-1 rounded-lg px-2 py-1.5 border ${isText ? 'bg-amber-50 border-amber-200' : 'bg-sage-50 border-sage-200'}`}>
                        <span className="text-sm text-black leading-tight flex-1 line-clamp-2">
                          {isText ? getFreeText(slotValue) : getRecipeName(slotValue)}
                        </span>
                        <button
                          onClick={() => copyToAllDays(dayId, slotId)}
                          className="text-black/30 hover:text-sage-500 shrink-0"
                          title={t('planner.copyAll')}
                        >
                          <CopyPlus size={14} />
                        </button>
                        <button
                          onClick={() => clearSlot(dayId, slotId)}
                          className="text-black/30 hover:text-red-400 shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectingSlot({ day: dayId, slot: slotId })}
                        className="w-full text-left text-sm text-black/30 px-2 py-1.5 border border-dashed border-warm-200 rounded-lg hover:border-sage-400 hover:text-sage-600 transition-colors"
                      >
                        {t('planner.add')}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Recipe selector modal */}
      {selectingSlot && (
        <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-warm-200">
              <div>
                <h3 className="font-semibold text-black text-base">
                  {shoppingStep
                    ? t('planner.addShoppingItems')
                    : freeTextMode
                      ? t('planner.typeYourMeal')
                      : t('planner.selectRecipe')
                  }
                </h3>
                <p className="text-sm text-black/50">
                  {shoppingStep
                    ? freeTextValue
                    : `${t(`day.${selectingSlot.day}`)} - ${t(`cat.${selectingSlot.slot}`)}`
                  }
                </p>
              </div>
              <button onClick={closeModal} className="text-black/40">
                <X size={22} />
              </button>
            </div>

            {shoppingStep ? (
              /* Shopping items step */
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('planner.shoppingPlaceholder')}
                    value={shoppingInput}
                    onChange={e => setShoppingInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addShoppingItem() } }}
                    autoFocus
                    className="flex-1 px-3 py-2.5 border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400"
                  />
                  <button
                    onClick={addShoppingItem}
                    disabled={!shoppingInput.trim()}
                    className="px-4 py-2.5 rounded-lg bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Items already added */}
                {addedItems.length > 0 && (
                  <div className="space-y-1.5">
                    {addedItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-sage-700 bg-sage-50 rounded-lg px-3 py-2">
                        <Check size={14} className="shrink-0" />
                        <span>{item}</span>
                        <span className="text-sage-400 text-xs ml-auto">{t('planner.itemAdded')}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={closeModal}
                  className="w-full py-2.5 rounded-lg text-base font-medium transition-colors bg-sage-600 text-white hover:bg-sage-700"
                >
                  {t('planner.done')}
                </button>

                {addedItems.length === 0 && (
                  <button
                    onClick={closeModal}
                    className="w-full text-center text-sm text-black/40 hover:text-black/60 transition-colors"
                  >
                    {t('planner.skip')}
                  </button>
                )}
              </div>
            ) : freeTextMode ? (
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  placeholder={t('planner.freeTextPlaceholder')}
                  value={freeTextValue}
                  onChange={e => setFreeTextValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') assignFreeText() }}
                  autoFocus
                  className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-amber-400"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setFreeTextMode(false); setFreeTextValue('') }}
                    className="flex-1 px-3 py-2.5 rounded-lg border border-warm-200 text-base text-black/60 hover:bg-warm-50 transition-colors"
                  >
                    {t('planner.backToRecipes')}
                  </button>
                  <button
                    onClick={assignFreeText}
                    disabled={!freeTextValue.trim()}
                    className="flex-1 px-3 py-2.5 rounded-lg bg-amber-500 text-white text-base font-medium hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('planner.add.btn')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 space-y-2">
                  <input
                    type="text"
                    placeholder={t('planner.searchRecipe')}
                    value={recipeSearch}
                    onChange={e => setRecipeSearch(e.target.value)}
                    autoFocus
                    className="w-full px-3 py-2 border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400"
                  />
                  <div className="flex gap-1 bg-warm-100 rounded-lg p-0.5">
                    {[
                      { id: 'all', label: t('recipes.all') },
                      { id: 'user', label: t('recipes.mine') },
                      { id: 'default', label: t('recipes.suggested') },
                      { id: 'dietpro', label: t('recipes.fructose') },
                    ].map(sf => (
                      <button
                        key={sf.id}
                        onClick={() => setSourceFilter(sf.id)}
                        className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                          sourceFilter === sf.id
                            ? 'bg-white text-black shadow-sm'
                            : 'text-black/50 hover:text-black/70'
                        }`}
                      >
                        {sf.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setFreeTextMode(true)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-amber-300 text-amber-700 hover:bg-amber-50 transition-colors text-base"
                  >
                    <Type size={18} />
                    <span>{t('planner.freeText')}</span>
                  </button>
                </div>
                <div className="overflow-y-auto flex-1 p-3 pt-0 space-y-1">
                  {filteredRecipes.map(r => (
                    <button
                      key={r.id}
                      onClick={() => assignRecipe(r.id)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-sage-50 transition-colors"
                    >
                      <p className="text-base text-black">{r.nombre}</p>
                      <p className="text-sm text-black/50">
                        {r.tiempoMinutos} min | {r.raciones} {t('card.serv')}
                        {r.batchCooking && ` | ${t('card.batch')}`}
                      </p>
                    </button>
                  ))}
                  {filteredRecipes.length === 0 && (
                    <p className="text-sm text-black/40 text-center py-4">{t('planner.noRecipes')}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
