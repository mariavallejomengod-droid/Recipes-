import { Droplets, Sun, Utensils, Moon, Apple, AlertCircle, ChefHat } from 'lucide-react'
import { useTranslation } from '../i18n'

const mealKeys = ['breakfast', 'lunch', 'dinner', 'snack']
const mealIcons = { breakfast: Sun, lunch: Utensils, dinner: Moon, snack: Apple }
const mealColors = {
  breakfast: 'bg-yellow-50 border-yellow-200',
  lunch: 'bg-sage-50 border-sage-200',
  dinner: 'bg-indigo-50 border-indigo-200',
  snack: 'bg-peach-50 border-peach-200',
}
const mealIconColors = {
  breakfast: 'text-yellow-500',
  lunch: 'text-sage-600',
  dinner: 'text-indigo-500',
  snack: 'text-peach-500',
}

export default function DietGuide() {
  const { t } = useTranslation()

  const principles = Array.from({ length: 6 }, (_, i) => ({
    title: t(`diet.principle.${i + 1}.title`),
    desc: t(`diet.principle.${i + 1}.desc`),
  }))

  const batchSteps = t('diet.batchSteps')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">{t('diet.title')}</h1>
        <p className="text-base text-black/70 mt-1">{t('diet.subtitle')}</p>
      </div>

      {/* Key principles */}
      <div className="bg-white rounded-xl border border-warm-200 p-4">
        <h2 className="font-semibold text-black text-base mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-sage-600" />
          {t('diet.keyPrinciples')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {principles.map((p, i) => (
            <div key={i} className="bg-warm-50 rounded-lg p-3">
              <p className="text-sm font-semibold text-black">{p.title}</p>
              <p className="text-sm text-black/70 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily target */}
      <div className="bg-sage-50 rounded-xl border border-sage-200 p-4">
        <h2 className="font-semibold text-black text-base mb-2 flex items-center gap-2">
          <ChefHat size={18} />
          {t('diet.dailyTarget')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white rounded-lg p-2.5">
            <p className="text-xl font-bold text-black">~1900</p>
            <p className="text-xs text-black/60">{t('diet.kcalDay')}</p>
          </div>
          <div className="bg-white rounded-lg p-2.5">
            <p className="text-xl font-bold text-black">~90g</p>
            <p className="text-xs text-black/60">{t('diet.protein')}</p>
          </div>
          <div className="bg-white rounded-lg p-2.5">
            <p className="text-xl font-bold text-black">~220g</p>
            <p className="text-xs text-black/60">{t('diet.carbs')}</p>
          </div>
          <div className="bg-white rounded-lg p-2.5">
            <p className="text-xl font-bold text-black">~65g</p>
            <p className="text-xs text-black/60">{t('diet.fat')}</p>
          </div>
        </div>
        <p className="text-xs text-black/50 mt-2 text-center">{t('diet.dailyNote')}</p>
      </div>

      {/* Hydration */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 flex items-start gap-3">
        <Droplets size={22} className="text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-base font-semibold text-black">{t('diet.hydration')}</p>
          <p className="text-sm text-black/70 mt-1">{t('diet.hydrationText')}</p>
        </div>
      </div>

      {/* Meals */}
      {mealKeys.map(key => {
        const Icon = mealIcons[key]
        const guidelines = t(`diet.${key}.guidelines`)
        const examples = t(`diet.${key}.examples`)
        return (
          <div key={key} className={`rounded-xl border p-4 ${mealColors[key]}`}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={22} className={mealIconColors[key]} />
              <h2 className="font-semibold text-black text-base">{t(`diet.${key}.title`)}</h2>
              <span className="text-xs text-black/50 ml-auto">{t(`diet.${key}.time`)}</span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-black mb-1.5">{t('diet.whatToInclude')}</p>
                <ul className="space-y-1.5">
                  {Array.isArray(guidelines) && guidelines.map((g, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-black/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/30 shrink-0 mt-2" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-black mb-1.5">{t('diet.examples')}</p>
                <ul className="space-y-1">
                  {Array.isArray(examples) && examples.map((e, j) => (
                    <li key={j} className="text-sm text-black/70 pl-3.5">{e}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/60 rounded-lg px-3 py-2">
                <p className="text-sm text-black/70 italic">{t(`diet.${key}.tip`)}</p>
              </div>
            </div>
          </div>
        )
      })}

      {/* Batch cooking day */}
      <div className="bg-warm-100 rounded-xl border border-warm-200 p-4">
        <h2 className="font-semibold text-black text-base mb-2 flex items-center gap-2">
          <ChefHat size={18} className="text-warm-700" />
          {t('diet.batchCookingDay')}
        </h2>
        <p className="text-sm text-black/70 mb-3">{t('diet.batchCookingIntro')}</p>
        <ol className="space-y-2">
          {Array.isArray(batchSteps) && batchSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-black/80">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-warm-200 text-black text-xs font-semibold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
