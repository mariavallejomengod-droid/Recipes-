import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { getWeeklyPlan, saveWeeklyPlan, getMonday, formatWeekKey } from '../utils/storage'
import { useTranslation } from '../i18n'

const DAY_IDS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const SLOT_IDS = ['breakfast', 'lunch', 'dinner', 'snack']

export default function PlannerModal({ recipe, onClose }) {
  const { t } = useTranslation()
  const [selected, setSelected] = useState({})
  const [addedMsg, setAddedMsg] = useState(false)

  const recipeSlots = new Set(recipe.categorias || [])
  const hasSelected = Object.values(selected).some(v => v)

  function toggleSlot(dayId, slotId) {
    const key = `${dayId}-${slotId}`
    setSelected(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function selectAllForSlot(slotId) {
    const keys = DAY_IDS.map(d => `${d}-${slotId}`)
    const allSelected = keys.every(k => selected[k])
    const updates = {}
    keys.forEach(k => { updates[k] = !allSelected })
    setSelected(prev => ({ ...prev, ...updates }))
  }

  function selectAllForDay(dayId) {
    const keys = SLOT_IDS.map(s => `${dayId}-${s}`)
    const allSelected = keys.every(k => selected[k])
    const updates = {}
    keys.forEach(k => { updates[k] = !allSelected })
    setSelected(prev => ({ ...prev, ...updates }))
  }

  function addToPlanner() {
    const monday = getMonday()
    const weekKey = formatWeekKey(monday)
    let plan = getWeeklyPlan(weekKey)
    if (!plan) {
      plan = {}
      DAY_IDS.forEach(d => {
        plan[d] = { breakfast: null, lunch: null, dinner: null, snack: null }
      })
    }

    Object.keys(selected).forEach(key => {
      if (!selected[key]) return
      const [dayId, slotId] = key.split('-')
      if (!plan[dayId]) plan[dayId] = { breakfast: null, lunch: null, dinner: null, snack: null }
      plan[dayId][slotId] = recipe.id
    })

    saveWeeklyPlan(weekKey, plan)
    setAddedMsg(true)
    setTimeout(() => onClose(), 1200)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-warm-200">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-black text-lg">{t('detail.pickSlots')}</h3>
            <p className="text-sm text-black/50 truncate">{recipe.nombre}</p>
          </div>
          <button onClick={onClose} className="text-black/40 hover:text-black ml-2 shrink-0">
            <X size={20} />
          </button>
        </div>

        {addedMsg ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={24} className="text-sage-600" />
            </div>
            <p className="text-lg font-medium text-sage-700">{t('detail.added')}</p>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-1">
              {/* Header row */}
              <div className="grid gap-1" style={{ gridTemplateColumns: 'minmax(90px, 1fr) repeat(4, 1fr)' }}>
                <div />
                {SLOT_IDS.map(slotId => {
                  const allDaysSelected = DAY_IDS.every(d => selected[`${d}-${slotId}`])
                  return (
                    <button
                      key={slotId}
                      onClick={() => selectAllForSlot(slotId)}
                      className={`text-xs font-semibold py-1.5 px-1 rounded-lg text-center transition-colors ${
                        allDaysSelected
                          ? 'bg-sage-100 text-sage-700'
                          : 'text-black/50 hover:bg-warm-50'
                      }`}
                    >
                      {t(`cat.${slotId}`)}
                    </button>
                  )
                })}
              </div>

              {/* Day rows */}
              {DAY_IDS.map(dayId => {
                const allSlotsSelected = SLOT_IDS.every(s => selected[`${dayId}-${s}`])
                return (
                  <div
                    key={dayId}
                    className="grid gap-1 items-center"
                    style={{ gridTemplateColumns: 'minmax(90px, 1fr) repeat(4, 1fr)' }}
                  >
                    <button
                      onClick={() => selectAllForDay(dayId)}
                      className={`text-sm font-medium py-2 px-2 rounded-lg text-left transition-colors ${
                        allSlotsSelected
                          ? 'bg-sage-50 text-sage-700'
                          : 'text-black/70 hover:bg-warm-50'
                      }`}
                    >
                      {t(`day.${dayId}`).slice(0, 3)}
                    </button>
                    {SLOT_IDS.map(slotId => {
                      const key = `${dayId}-${slotId}`
                      const isSelected = selected[key]
                      const isMatch = recipeSlots.has(slotId)
                      return (
                        <button
                          key={key}
                          onClick={() => toggleSlot(dayId, slotId)}
                          className={`h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-sage-500 border-sage-500 text-white'
                              : isMatch
                                ? 'border-sage-200 bg-sage-50/50 hover:border-sage-300'
                                : 'border-warm-200 hover:border-warm-300'
                          }`}
                        >
                          {isSelected && <Check size={16} />}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            <div className="p-4 border-t border-warm-200">
              <button
                onClick={addToPlanner}
                disabled={!hasSelected}
                className={`w-full py-3 rounded-xl text-base font-medium transition-colors ${
                  hasSelected
                    ? 'bg-sage-600 text-white hover:bg-sage-700'
                    : 'bg-warm-100 text-black/30 cursor-not-allowed'
                }`}
              >
                {t('detail.addSelected')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
