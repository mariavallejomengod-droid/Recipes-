import { Outlet, NavLink } from 'react-router-dom'
import { BookOpen, Calendar, ShoppingCart, Salad, Globe } from 'lucide-react'
import { useTranslation } from '../i18n'
import { useState, useRef, useEffect } from 'react'

export default function Layout() {
  const { lang, changeLang, t, LANGUAGES, LANG_LABELS, LANG_SHORT } = useTranslation()
  const [open, setOpen] = useState(false)
  const desktopRef = useRef(null)
  const mobileRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (
        desktopRef.current && desktopRef.current.contains(e.target) ||
        mobileRef.current && mobileRef.current.contains(e.target)
      ) return
      setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const navItems = [
    { to: '/', icon: Calendar, label: t('nav.week') },
    { to: '/diet', icon: Salad, label: t('nav.diet') },
    { to: '/recipes', icon: BookOpen, label: t('nav.recipes') },
    { to: '/shopping', icon: ShoppingCart, label: t('nav.shopping') },
  ]

  function selectLang(l) {
    changeLang(l)
    setOpen(false)
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:flex">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex md:flex-col md:w-56 md:fixed md:h-screen bg-white border-r border-warm-200 p-4">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold text-black">{t('app.title')}</h1>
          <p className="text-sm text-black/50 mt-1">{t('app.subtitle')}</p>
        </div>
        <div className="flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-sage-100 text-sage-700'
                    : 'text-black/60 hover:bg-warm-100 hover:text-black'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-warm-200 relative" ref={desktopRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-black/60 hover:bg-warm-100 hover:text-black transition-colors w-full"
          >
            <Globe size={18} />
            {LANG_LABELS[lang]}
          </button>
          {open && (
            <div className="absolute bottom-full left-0 mb-1 w-full bg-white border border-warm-200 rounded-lg shadow-lg overflow-hidden z-50">
              {LANGUAGES.map(l => (
                <button
                  key={l}
                  onClick={() => selectLang(l)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    l === lang
                      ? 'bg-sage-50 text-sage-700 font-medium'
                      : 'text-black/60 hover:bg-warm-50 hover:text-black'
                  }`}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-56">
        {/* Mobile language dropdown */}
        <div className="md:hidden flex justify-end px-4 pt-3">
          <div className="relative" ref={mobileRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 text-xs text-black/50 border border-warm-200 px-2.5 py-1.5 rounded-lg hover:bg-warm-50 transition-colors"
            >
              <Globe size={14} />
              {LANG_SHORT[lang]}
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-warm-200 rounded-lg shadow-lg overflow-hidden z-50 min-w-28">
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    onClick={() => selectLang(l)}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      l === lang
                        ? 'bg-sage-50 text-sage-700 font-medium'
                        : 'text-black/60 hover:bg-warm-50 hover:text-black'
                    }`}
                  >
                    {LANG_LABELS[l]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-warm-200 flex justify-around py-2 px-2 z-50">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'text-sage-600'
                  : 'text-black/40'
              }`
            }
          >
            <Icon size={22} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
