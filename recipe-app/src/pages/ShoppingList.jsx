import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Copy, Check, ShoppingCart, Plus, X, ClipboardCopy, Download, Minus, Home } from 'lucide-react'
import { getWeeklyPlan, getMonday, formatWeekKey, formatDateRange, getShoppingList, saveShoppingList, getRecipes, saveWeeklyPlan } from '../utils/storage'
import { generateShoppingList, formatQuantity, shoppingListToText } from '../utils/shoppingList'
import { INGREDIENT_CATEGORIES } from '../data/categories'
import { useTranslation } from '../i18n'

function buildItems(weekKey) {
  const recipes = getRecipes()
  const plan = getWeeklyPlan(weekKey)
  const savedList = getShoppingList(weekKey)

  let generated = []
  if (plan) {
    generated = generateShoppingList(plan, recipes)
  }

  if (savedList) {
    const savedMap = new Map(savedList.map(i => [i.nombre.toLowerCase(), i]))
    // Remove generated items that user has deleted (present in generated but absent from saved, when saved list exists)
    const savedKeys = new Set(savedList.map(i => i.nombre.toLowerCase()))
    generated = generated.filter(item => {
      const key = item.nombre.toLowerCase()
      if (savedMap.has(key)) {
        const saved = savedMap.get(key)
        item.comprado = saved.comprado
        if (saved.cantidadAjustada !== undefined) item.cantidadAjustada = saved.cantidadAjustada
        return true
      }
      // If saved list exists but doesn't have this item, user may have deleted it
      // Only filter out if the saved list was explicitly modified (has at least one non-manual item)
      const hasSavedGenerated = savedList.some(i => !i.manual)
      return !hasSavedGenerated
    })
    const generatedKeys = new Set(generated.map(i => i.nombre.toLowerCase()))
    const manualItems = savedList.filter(i => i.manual && !generatedKeys.has(i.nombre.toLowerCase()))
    generated = [...generated, ...manualItems]
  }

  return generated
}

function getHouseItems(weekKey) {
  try {
    const data = localStorage.getItem('recetario_house_' + weekKey)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveHouseItems(weekKey, items) {
  localStorage.setItem('recetario_house_' + weekKey, JSON.stringify(items))
}

function getPreviousWeekKey(currentMonday) {
  const prev = new Date(currentMonday)
  prev.setDate(prev.getDate() - 7)
  return formatWeekKey(prev)
}

function downloadCSV(foodItems, houseItems, t) {
  const yes = t('shopping.csvYes')
  const no = t('shopping.csvNo')
  let csv = `"${t('shopping.csvCategory')}","${t('shopping.csvItem')}","${t('shopping.csvQty')}","${t('shopping.csvUnit')}","${t('shopping.csvRecipes')}","${t('shopping.csvChecked')}"\n`
  for (const item of foodItems) {
    const qty = item.cantidadAjustada !== undefined ? item.cantidadAjustada : item.cantidad
    const recipes = item.recetas?.join('; ') || ''
    csv += `"${t(`ingcat.${item.categoria}`)}","${item.nombre}","${qty || ''}","${item.unidad || ''}","${recipes}","${item.comprado ? yes : no}"\n`
  }
  if (houseItems.length > 0) {
    for (const item of houseItems) {
      csv += `"${t('shopping.tabHouse')}","${item.nombre}","${item.cantidad || ''}","${item.unidad || ''}","","${item.comprado ? yes : no}"\n`
    }
  }
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'shopping-list.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function ShoppingList() {
  const { t, lang } = useTranslation()
  const [currentMonday, setCurrentMonday] = useState(() => getMonday())
  const [copied, setCopied] = useState(false)
  const [copiedPrev, setCopiedPrev] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeTab, setActiveTab] = useState('food')
  const [, setTick] = useState(0)
  const rerender = useCallback(() => setTick(t => t + 1), [])

  const weekKey = formatWeekKey(currentMonday)
  const foodItems = buildItems(weekKey)
  const houseItems = getHouseItems(weekKey)

  function changeWeek(delta) {
    setCurrentMonday(prev => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 7 * delta)
      return d
    })
  }

  function toggleItem(index) {
    const updated = foodItems.map((item, i) =>
      i === index ? { ...item, comprado: !item.comprado } : item
    )
    saveShoppingList(weekKey, updated)
    rerender()
  }

  function adjustQuantity(index, delta) {
    const updated = foodItems.map((item, i) => {
      if (i !== index) return item
      const current = item.cantidadAjustada !== undefined ? item.cantidadAjustada : item.cantidad
      const step = item.unidad === 'unit' || item.unidad === 'units' || item.unidad === 'tbsp' || item.unidad === 'tsp' || item.unidad === 'can' ? 1
        : item.unidad === 'kg' || item.unidad === 'l' ? 0.25
        : item.unidad === 'g' || item.unidad === 'ml' ? 50
        : 1
      const newVal = Math.max(0, current + delta * step)
      return { ...item, cantidadAjustada: newVal }
    })
    saveShoppingList(weekKey, updated)
    rerender()
  }

  function addManualItem(e) {
    e.preventDefault()
    if (!newItem.trim()) return
    if (activeTab === 'house') {
      const item = { nombre: newItem.trim(), cantidad: 0, unidad: '', comprado: false }
      saveHouseItems(weekKey, [...houseItems, item])
    } else {
      const item = { nombre: newItem.trim(), cantidad: 0, unidad: '', categoria: 'other', comprado: false, manual: true }
      saveShoppingList(weekKey, [...foodItems, item])
    }
    setNewItem('')
    rerender()
  }

  function removeFoodItem(index) {
    saveShoppingList(weekKey, foodItems.filter((_, i) => i !== index))
    rerender()
  }

  function removeHouseItem(index) {
    saveHouseItems(weekKey, houseItems.filter((_, i) => i !== index))
    rerender()
  }

  function toggleHouseItem(index) {
    const updated = houseItems.map((item, i) =>
      i === index ? { ...item, comprado: !item.comprado } : item
    )
    saveHouseItems(weekKey, updated)
    rerender()
  }

  function copyToClipboard() {
    const text = shoppingListToText(foodItems)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function copyFromPreviousWeek() {
    const prevKey = getPreviousWeekKey(currentMonday)
    const prevPlan = getWeeklyPlan(prevKey)
    if (!prevPlan) {
      setCopiedPrev(true)
      setTimeout(() => setCopiedPrev(false), 2000)
      return
    }
    const currentPlan = getWeeklyPlan(weekKey)
    if (!currentPlan) {
      saveWeeklyPlan(weekKey, prevPlan)
    }
    const prevSavedList = getShoppingList(prevKey)
    if (prevSavedList) {
      const manualItems = prevSavedList.filter(i => i.manual).map(i => ({ ...i, comprado: false }))
      if (manualItems.length > 0) {
        const currentItems = buildItems(weekKey)
        const currentKeys = new Set(currentItems.map(i => i.nombre.toLowerCase()))
        const newManuals = manualItems.filter(i => !currentKeys.has(i.nombre.toLowerCase()))
        if (newManuals.length > 0) {
          saveShoppingList(weekKey, [...currentItems, ...newManuals])
        }
      }
    }
    // Also copy house items
    const prevHouse = getHouseItems(prevKey)
    if (prevHouse.length > 0) {
      const currentHouse = getHouseItems(weekKey)
      const currentNames = new Set(currentHouse.map(i => i.nombre.toLowerCase()))
      const newHouse = prevHouse.filter(i => !currentNames.has(i.nombre.toLowerCase())).map(i => ({ ...i, comprado: false }))
      if (newHouse.length > 0) {
        saveHouseItems(weekKey, [...currentHouse, ...newHouse])
      }
    }
    setCopiedPrev(true)
    setTimeout(() => setCopiedPrev(false), 2000)
    rerender()
  }

  // Group by category
  const grouped = INGREDIENT_CATEGORIES.map(cat => ({
    ...cat,
    items: foodItems.filter(i => i.categoria === cat.id),
  })).filter(g => g.items.length > 0)

  const totalFood = foodItems.length
  const checkedFood = foodItems.filter(i => i.comprado).length
  const totalHouse = houseItems.length
  const checkedHouse = houseItems.filter(i => i.comprado).length
  const totalItems = activeTab === 'food' ? totalFood : totalHouse
  const checkedItems = activeTab === 'food' ? checkedFood : checkedHouse

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">{t('shopping.title')}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 text-sm text-sage-600 border border-sage-300 px-3 py-1.5 rounded-lg hover:bg-sage-50 transition-colors"
          >
            <Plus size={14} /> {t('shopping.addItem')}
          </button>
          {(foodItems.length > 0 || houseItems.length > 0) && (
            <>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-sm text-sage-600 border border-sage-300 px-3 py-1.5 rounded-lg hover:bg-sage-50 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? t('shopping.copied') : t('shopping.copy')}
              </button>
              <button
                onClick={() => downloadCSV(foodItems, houseItems, t)}
                className="flex items-center gap-1.5 text-sm text-sage-600 border border-sage-300 px-3 py-1.5 rounded-lg hover:bg-sage-50 transition-colors"
              >
                <Download size={14} /> {t('shopping.download')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add manual item form */}
      {showAddForm && (
        <form onSubmit={addManualItem} className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            placeholder={activeTab === 'house' ? t('shopping.housePlaceholder') : t('shopping.placeholder')}
            autoFocus
            className="flex-1 px-3 py-2.5 bg-white border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400"
          />
          <button
            type="submit"
            className="bg-sage-600 text-white px-4 py-2.5 rounded-lg hover:bg-sage-700 transition-colors text-sm font-medium"
          >
            {t('shopping.add')}
          </button>
        </form>
      )}

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

      {/* Copy from previous week */}
      <div className="flex justify-center">
        <button
          onClick={copyFromPreviousWeek}
          className="flex items-center gap-1.5 text-sm text-black/50 hover:text-sage-600 transition-colors"
        >
          <ClipboardCopy size={14} />
          {copiedPrev ? t('shopping.copiedPrevious') : t('shopping.copyPrevious')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-warm-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('food')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-md font-medium transition-colors ${
            activeTab === 'food' ? 'bg-white text-black shadow-sm' : 'text-black/50 hover:text-black/70'
          }`}
        >
          <ShoppingCart size={16} />
          {t('shopping.tabFood')}
          {totalFood > 0 && <span className="text-xs text-black/40">({totalFood})</span>}
        </button>
        <button
          onClick={() => setActiveTab('house')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-md font-medium transition-colors ${
            activeTab === 'house' ? 'bg-white text-black shadow-sm' : 'text-black/50 hover:text-black/70'
          }`}
        >
          <Home size={16} />
          {t('shopping.tabHouse')}
          {totalHouse > 0 && <span className="text-xs text-black/40">({totalHouse})</span>}
        </button>
      </div>

      {/* Progress */}
      {totalItems > 0 && (
        <div className="bg-white rounded-xl border border-warm-200 p-3">
          <div className="flex items-center justify-between text-sm text-black/60 mb-2">
            <span>{checkedItems} {t('shopping.of')} {totalItems} {t('shopping.items')}</span>
            <span>{Math.round((checkedItems / totalItems) * 100)}%</span>
          </div>
          <div className="h-2 bg-warm-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sage-500 rounded-full transition-all duration-300"
              style={{ width: `${(checkedItems / totalItems) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Food tab */}
      {activeTab === 'food' && (
        <>
          {grouped.length > 0 ? (
            <div className="space-y-3">
              {grouped.map(group => (
                <div key={group.id} className="bg-white rounded-xl border border-warm-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-warm-50 border-b border-warm-200">
                    <h3 className="text-sm font-semibold text-black">
                      {group.emoji} {t(`ingcat.${group.id}`)}
                    </h3>
                  </div>
                  <div className="divide-y divide-warm-100">
                    {group.items.map((item, i) => {
                      const globalIndex = foodItems.indexOf(item)
                      const displayQty = item.cantidadAjustada !== undefined ? item.cantidadAjustada : item.cantidad
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-warm-50 transition-colors"
                        >
                          <button
                            onClick={() => toggleItem(globalIndex)}
                            className="flex items-center gap-3 flex-1 text-left min-w-0"
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                              item.comprado ? 'bg-sage-500 border-sage-500' : 'border-warm-300'
                            }`}>
                              {item.comprado && <Check size={12} className="text-white" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className={`text-base ${item.comprado ? 'line-through text-black/30' : 'text-black'}`}>
                                {item.nombre}
                              </span>
                              {item.recetas?.length > 0 && (
                                <p className="text-xs italic text-black/35 truncate">
                                  {item.recetas.join(', ')}
                                </p>
                              )}
                            </div>
                          </button>
                          {!item.manual && displayQty > 0 && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => adjustQuantity(globalIndex, -1)}
                                className="w-6 h-6 rounded-full border border-warm-300 flex items-center justify-center text-black/40 hover:bg-warm-100 hover:text-black/70 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm text-black/60 min-w-[3.5rem] text-center">
                                {formatQuantity(displayQty, item.unidad)}
                              </span>
                              <button
                                onClick={() => adjustQuantity(globalIndex, 1)}
                                className="w-6 h-6 rounded-full border border-warm-300 flex items-center justify-center text-black/40 hover:bg-warm-100 hover:text-black/70 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                          {!item.manual && !displayQty && item.unidad && (
                            <span className="text-sm text-black/50 shrink-0">
                              {formatQuantity(displayQty, item.unidad)}
                            </span>
                          )}
                          <button
                            onClick={() => removeFoodItem(globalIndex)}
                            className="text-black/20 hover:text-red-400 shrink-0"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart size={40} className="text-warm-200 mx-auto mb-3" />
              <p className="text-base text-black/40">{t('shopping.empty')}</p>
              <p className="text-sm text-black/30 mt-1">{t('shopping.emptyHint')}</p>
            </div>
          )}
        </>
      )}

      {/* House tab */}
      {activeTab === 'house' && (
        <>
          {houseItems.length > 0 ? (
            <div className="bg-white rounded-xl border border-warm-200 overflow-hidden">
              <div className="divide-y divide-warm-100">
                {houseItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-warm-50 transition-colors"
                  >
                    <button
                      onClick={() => toggleHouseItem(i)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        item.comprado ? 'bg-sage-500 border-sage-500' : 'border-warm-300'
                      }`}>
                        {item.comprado && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-base flex-1 ${item.comprado ? 'line-through text-black/30' : 'text-black'}`}>
                        {item.nombre}
                      </span>
                    </button>
                    <button
                      onClick={() => removeHouseItem(i)}
                      className="text-black/20 hover:text-red-400 shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Home size={40} className="text-warm-200 mx-auto mb-3" />
              <p className="text-base text-black/40">{t('shopping.houseEmpty')}</p>
              <p className="text-sm text-black/30 mt-1">{t('shopping.houseEmptyHint')}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
