import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Save } from 'lucide-react'
import { addRecipe, updateRecipe, getRecipeById } from '../utils/storage'
import { MEAL_CATEGORIES, RECIPE_TAGS, INGREDIENT_CATEGORIES, UNITS } from '../data/categories'
import { useTranslation } from '../i18n'

const emptyIngredient = { nombre: '', cantidad: '', unidad: 'g', categoria: 'other' }

export default function RecipeForm({ onSave, recipes }) {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    source: 'user',
    ingredientes: [{ ...emptyIngredient }],
    pasos: [''],
    tiempoMinutos: 30,
    raciones: 2,
    batchCooking: false,
    congelable: false,
    categorias: [],
    etiquetas: [],
    notas: '',
  })

  useEffect(() => {
    if (isEditing) {
      const recipe = getRecipeById(id)
      if (recipe) {
        setForm({
          nombre: recipe.nombre || '',
          descripcion: recipe.descripcion || '',
          source: recipe.source || 'user',
          ingredientes: recipe.ingredientes?.length > 0 ? recipe.ingredientes : [{ ...emptyIngredient }],
          pasos: recipe.pasos?.length > 0 ? recipe.pasos : [''],
          tiempoMinutos: recipe.tiempoMinutos || 30,
          raciones: recipe.raciones || 2,
          batchCooking: recipe.batchCooking || false,
          congelable: recipe.congelable || false,
          categorias: recipe.categorias || [],
          etiquetas: recipe.etiquetas || [],
          notas: recipe.notas || '',
        })
      }
    }
  }, [id, isEditing])

  function handleSubmit(e) {
    e.preventDefault()
    const cleanedForm = {
      ...form,
      ingredientes: form.ingredientes.filter(i => i.nombre.trim()),
      pasos: form.pasos.filter(p => p.trim()),
    }
    cleanedForm.ingredientes = cleanedForm.ingredientes.map(i => ({
      ...i,
      cantidad: i.cantidad ? Number(i.cantidad) : 0,
    }))
    if (isEditing) {
      updateRecipe(id, cleanedForm)
    } else {
      addRecipe(cleanedForm)
    }
    onSave()
    navigate('/recipes')
  }

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function toggleArrayItem(field, item) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }))
  }

  function updateIngredient(index, field, value) {
    const updated = [...form.ingredientes]
    updated[index] = { ...updated[index], [field]: value }
    updateField('ingredientes', updated)
  }

  function addIngredient() {
    updateField('ingredientes', [...form.ingredientes, { ...emptyIngredient }])
  }

  function removeIngredient(index) {
    if (form.ingredientes.length <= 1) return
    updateField('ingredientes', form.ingredientes.filter((_, i) => i !== index))
  }

  function updateStep(index, value) {
    const updated = [...form.pasos]
    updated[index] = value
    updateField('pasos', updated)
  }

  function addStep() {
    updateField('pasos', [...form.pasos, ''])
  }

  function removeStep(index) {
    if (form.pasos.length <= 1) return
    updateField('pasos', form.pasos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-black/40 hover:text-black">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold text-black">
          {isEditing ? t('form.editRecipe') : t('form.newRecipe')}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-warm-200 p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-black block mb-1">{t('form.name')}</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={e => updateField('nombre', e.target.value)}
              placeholder={t('form.namePlaceholder')}
              className="w-full px-3 py-2 border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-black block mb-1">{t('form.description')}</label>
            <textarea
              value={form.descripcion}
              onChange={e => updateField('descripcion', e.target.value)}
              placeholder={t('form.descriptionPlaceholder')}
              rows={2}
              className="w-full px-3 py-2 border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400 resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-black block mb-2">{t('form.source')}</label>
            <div className="flex gap-2">
              {[
                { value: 'user', label: t('form.sourceMine') },
                { value: 'default', label: t('form.sourceSuggested') },
                { value: 'dietpro', label: t('form.sourceDietpro') },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField('source', opt.value)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    form.source === opt.value
                      ? 'bg-sage-100 border-sage-400 text-sage-700'
                      : 'border-warm-300 text-black/60 hover:border-warm-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-black block mb-1">{t('form.time')}</label>
              <input
                type="number"
                min={1}
                value={form.tiempoMinutos}
                onChange={e => updateField('tiempoMinutos', Number(e.target.value))}
                className="w-full px-3 py-2 border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black block mb-1">{t('form.servings')}</label>
              <input
                type="number"
                min={1}
                value={form.raciones}
                onChange={e => updateField('raciones', Number(e.target.value))}
                className="w-full px-3 py-2 border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-base text-black/70">
              <input
                type="checkbox"
                checked={form.batchCooking}
                onChange={e => updateField('batchCooking', e.target.checked)}
                className="rounded"
              />
              {t('form.batchCooking')}
            </label>
            <label className="flex items-center gap-2 text-base text-black/70">
              <input
                type="checkbox"
                checked={form.congelable}
                onChange={e => updateField('congelable', e.target.checked)}
                className="rounded"
              />
              {t('form.freezable')}
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 p-4">
          <label className="text-sm font-medium text-black block mb-2">{t('form.categories')}</label>
          <div className="flex flex-wrap gap-2">
            {MEAL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleArrayItem('categorias', cat.id)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  form.categorias.includes(cat.id)
                    ? 'bg-sage-100 border-sage-400 text-sage-700'
                    : 'border-warm-300 text-black/60'
                }`}
              >
                {cat.emoji} {t(`cat.${cat.id}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 p-4">
          <label className="text-sm font-medium text-black block mb-2">{t('form.tags')}</label>
          <div className="flex flex-wrap gap-1.5">
            {RECIPE_TAGS.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleArrayItem('etiquetas', tag.id)}
                className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                  form.etiquetas.includes(tag.id) ? tag.color : 'bg-warm-100 text-black/50'
                }`}
              >
                {t(`tag.${tag.id}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 p-4 space-y-3">
          <label className="text-sm font-medium text-black block">{t('form.ingredients')}</label>
          {form.ingredientes.map((ing, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={ing.nombre}
                  onChange={e => updateIngredient(i, 'nombre', e.target.value)}
                  placeholder={t('form.ingredient')}
                  className="w-full px-2 py-1.5 border border-warm-200 rounded text-base text-black focus:outline-none focus:border-sage-400"
                />
              </div>
              <input
                type="number"
                value={ing.cantidad}
                onChange={e => updateIngredient(i, 'cantidad', e.target.value)}
                placeholder={t('form.qty')}
                className="w-16 px-2 py-1.5 border border-warm-200 rounded text-base text-black focus:outline-none focus:border-sage-400"
              />
              <select
                value={ing.unidad}
                onChange={e => updateIngredient(i, 'unidad', e.target.value)}
                className="w-24 px-2 py-1.5 border border-warm-200 rounded text-sm text-black focus:outline-none focus:border-sage-400 bg-white"
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <select
                value={ing.categoria}
                onChange={e => updateIngredient(i, 'categoria', e.target.value)}
                className="w-28 px-2 py-1.5 border border-warm-200 rounded text-sm text-black focus:outline-none focus:border-sage-400 bg-white hidden sm:block"
              >
                {INGREDIENT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{t(`ingcat.${c.id}`)}</option>)}
              </select>
              <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="text-black/30 hover:text-red-400 pt-1.5"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700"
          >
            <Plus size={14} /> {t('form.addIngredient')}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 p-4 space-y-3">
          <label className="text-sm font-medium text-black block">{t('form.steps')}</label>
          {form.pasos.map((paso, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sage-100 text-sage-700 text-sm font-semibold shrink-0 mt-1">
                {i + 1}
              </span>
              <textarea
                value={paso}
                onChange={e => updateStep(i, e.target.value)}
                placeholder={`${t('form.step')} ${i + 1}...`}
                rows={2}
                className="flex-1 px-2 py-1.5 border border-warm-200 rounded text-base text-black focus:outline-none focus:border-sage-400 resize-none"
              />
              <button
                type="button"
                onClick={() => removeStep(i)}
                className="text-black/30 hover:text-red-400 pt-1.5"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-1 text-sm text-sage-600 hover:text-sage-700"
          >
            <Plus size={14} /> {t('form.addStep')}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-warm-200 p-4">
          <label className="text-sm font-medium text-black block mb-1">{t('form.notes')}</label>
          <textarea
            value={form.notas}
            onChange={e => updateField('notas', e.target.value)}
            placeholder={t('form.notesPlaceholder')}
            rows={2}
            className="w-full px-3 py-2 border border-warm-200 rounded-lg text-base text-black focus:outline-none focus:border-sage-400 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-sage-600 text-white text-base py-3 rounded-xl hover:bg-sage-700 transition-colors font-medium"
        >
          <Save size={18} />
          {isEditing ? t('form.saveChanges') : t('form.createRecipe')}
        </button>
      </form>
    </div>
  )
}
