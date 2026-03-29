// Translation map for built-in recipe names and descriptions
// Key = recipe id, value = { es: { nombre, descripcion }, pl: { nombre, descripcion } }
// English is the base language stored in initialRecipes.js
// User recipes (source: 'user') and dietpro recipes keep their original language

const recipeTranslations = {
  // --- Default (suggested) recipes ---
  'oatmeal-bowl': {
    es: { nombre: 'Bol de avena con frutos rojos y nueces', descripcion: 'Desayuno completo, saciante y nutritivo. Rico en fibra, calcio y grasas saludables.' },
    pl: { nombre: 'Owsianka z jagodami i orzechami', descripcion: 'Kompletne, sycące i pożywne śniadanie. Bogate w błonnik, wapń i zdrowe tłuszcze.' },
  },
  'avocado-toast': {
    es: { nombre: 'Tostada de aguacate con huevo y tomate', descripcion: 'Desayuno rápido rico en grasas saludables, proteína y vitaminas.' },
    pl: { nombre: 'Tost z awokado, jajkiem i pomidorem', descripcion: 'Szybkie śniadanie bogate w zdrowe tłuszcze, białko i witaminy.' },
  },
  'butternut-squash-soup': {
    es: { nombre: 'Crema de calabaza y zanahoria', descripcion: 'Reconfortante, suave y perfecta para batch cooking. Rica en vitamina A y fibra.' },
    pl: { nombre: 'Zupa krem z dyni i marchewki', descripcion: 'Rozgrzewająca, kremowa i idealna do batch cooking. Bogata w witaminę A i błonnik.' },
  },
  'lemon-chicken': {
    es: { nombre: 'Pollo al limón con patatas y brócoli', descripcion: 'Plato completo, nutritivo y fácil de preparar en una sola bandeja.' },
    pl: { nombre: 'Kurczak z cytryną, ziemniakami i brokułami', descripcion: 'Kompletne, pożywne i łatwe danie z jednej blachy.' },
  },
  'quick-lentils': {
    es: { nombre: 'Lentejas rápidas con verduras', descripcion: 'Nutritivas, ricas en hierro y proteína vegetal. Perfectas para batch cooking.' },
    pl: { nombre: 'Szybka soczewica z warzywami', descripcion: 'Pożywna, bogata w żelazo i białko roślinne. Idealna do batch cooking.' },
  },
  'baked-salmon': {
    es: { nombre: 'Salmón al horno con boniato y espárragos', descripcion: 'Rico en omega-3. Comida completa con proteína, carbohidratos y verduras.' },
    pl: { nombre: 'Pieczony łosoś z batatami i szparagami', descripcion: 'Bogaty w omega-3. Kompletny posiłek z białkiem, węglowodanami i warzywami.' },
  },
  'spinach-feta-omelette': {
    es: { nombre: 'Tortilla de espinacas y queso feta', descripcion: 'Cena rápida rica en calcio, hierro y proteína.' },
    pl: { nombre: 'Omlet ze szpinakiem i fetą', descripcion: 'Szybka kolacja bogata w wapń, żelazo i białko.' },
  },
  'chicken-avocado-wrap': {
    es: { nombre: 'Wrap de pollo con aguacate', descripcion: 'Comida para llevar fácil de preparar. Rica en proteína y grasas saludables.' },
    pl: { nombre: 'Wrap z kurczakiem i awokado', descripcion: 'Łatwy do przygotowania posiłek na wynos. Bogaty w białko i zdrowe tłuszcze.' },
  },
  'chickpea-spinach-saute': {
    es: { nombre: 'Salteado de garbanzos y espinacas', descripcion: 'Plato vegetariano rico en proteína vegetal, hierro y fibra.' },
    pl: { nombre: 'Smażona ciecierzyca ze szpinakiem', descripcion: 'Danie wegetariańskie bogate w białko roślinne, żelazo i błonnik.' },
  },
  'chicken-veggie-rice': {
    es: { nombre: 'Arroz integral con pollo y verduras', descripcion: 'Plato equilibrado, rápido de preparar. Rico en proteína y fibra.' },
    pl: { nombre: 'Brązowy ryż z kurczakiem i warzywami', descripcion: 'Zbilansowane danie, szybkie w przygotowaniu. Bogate w białko i błonnik.' },
  },
  'quinoa-salad-bowl': {
    es: { nombre: 'Bowl de ensalada de quinoa', descripcion: 'Bol completo y equilibrado. Rico en proteína y grasas saludables.' },
    pl: { nombre: 'Sałatka z quinoa', descripcion: 'Kompletny i zbilansowany bowl. Bogaty w białko i zdrowe tłuszcze.' },
  },
  'pasta-broccoli-pesto': {
    es: { nombre: 'Pasta integral con brócoli y pesto', descripcion: 'Comida rápida y completa. Fácil de preparar.' },
    pl: { nombre: 'Makaron pełnoziarnisty z brokułami i pesto', descripcion: 'Szybki i kompletny posiłek. Łatwy w przygotowaniu.' },
  },
  'homemade-hummus': {
    es: { nombre: 'Hummus casero con crudités', descripcion: 'Tentempié saciante rico en proteína vegetal y fibra.' },
    pl: { nombre: 'Domowy hummus z warzywami', descripcion: 'Sycąca przekąska bogata w białko roślinne i błonnik.' },
  },
  'greek-yogurt-granola': {
    es: { nombre: 'Yogur griego con granola y frutas', descripcion: 'Desayuno o tentempié rápido, rico en proteína y calcio.' },
    pl: { nombre: 'Jogurt grecki z granolą i owocami', descripcion: 'Szybkie śniadanie lub przekąska, bogata w białko i wapń.' },
  },
  'baked-hake': {
    es: { nombre: 'Merluza al horno con verduras', descripcion: 'Cena ligera y completa. Rica en proteína de calidad.' },
    pl: { nombre: 'Pieczony morszczuk z warzywami', descripcion: 'Lekka i kompletna kolacja. Bogata w białko dobrej jakości.' },
  },
  'mushroom-asparagus-scramble': {
    es: { nombre: 'Revuelto de champiñones y espárragos', descripcion: 'Cena ligera rica en proteína y verduras.' },
    pl: { nombre: 'Jajecznica z pieczarkami i szparagami', descripcion: 'Lekka kolacja bogata w białko i warzywa.' },
  },
  'date-oat-energy-balls': {
    es: { nombre: 'Energy balls de dátiles y avena', descripcion: 'Tentempié saludable y energético. Sin cocinar.' },
    pl: { nombre: 'Kulki energetyczne z daktyli i owsianki', descripcion: 'Zdrowa i energetyczna przekąska. Bez gotowania.' },
  },
  'turkey-stir-fry': {
    es: { nombre: 'Salteado de pavo con verduras', descripcion: 'Comida rápida rica en proteína y baja en grasa.' },
    pl: { nombre: 'Smażony indyk z warzywami', descripcion: 'Szybki posiłek bogaty w białko i niskotłuszczowy.' },
  },
  'mixed-veggie-cream-soup': {
    es: { nombre: 'Crema de verduras variadas', descripcion: 'Ligera, nutritiva y perfecta para la cena. Rica en hierro y fibra.' },
    pl: { nombre: 'Zupa krem z mieszanych warzyw', descripcion: 'Lekka, pożywna i idealna na kolację. Bogata w żelazo i błonnik.' },
  },
  'white-rice': {
    es: { nombre: 'Arroz blanco', descripcion: 'Guarnición básica, versátil y fácil. Complemento perfecto para cualquier plato.' },
    pl: { nombre: 'Biały ryż', descripcion: 'Podstawowy, uniwersalny i łatwy dodatek. Idealne uzupełnienie każdego dania.' },
  },
  'grilled-pork-shoulder': {
    es: { nombre: 'Lomo de cerdo a la plancha', descripcion: 'Proteína sencilla y rápida. Se puede marinar o sazonar al gusto.' },
    pl: { nombre: 'Grillowana karkówka', descripcion: 'Proste i szybkie białko. Można marynować lub przyprawić do smaku.' },
  },
  'scrambled-eggs-mushrooms': {
    es: { nombre: 'Huevos revueltos con champiñones', descripcion: 'Desayuno o cena rápida, rica en proteína.' },
    pl: { nombre: 'Jajecznica z pieczarkami', descripcion: 'Szybkie śniadanie lub kolacja, bogata w białko.' },
  },
  'grilled-chicken-breast': {
    es: { nombre: 'Pechuga de pollo a la plancha', descripcion: 'Proteína básica versátil. Se puede sazonar de muchas formas.' },
    pl: { nombre: 'Grillowany filet z kurczaka', descripcion: 'Uniwersalne podstawowe białko. Można przyprawić na wiele sposobów.' },
  },
  'steamed-broccoli': {
    es: { nombre: 'Brócoli al vapor', descripcion: 'Guarnición nutritiva rápida. Rico en calcio, hierro y vitaminas.' },
    pl: { nombre: 'Brokuły na parze', descripcion: 'Szybki pożywny dodatek. Bogaty w wapń, żelazo i witaminy.' },
  },
  'pan-fried-eggs': {
    es: { nombre: 'Huevos fritos en sartén', descripcion: 'Proteína rápida y versátil. Perfecto para cualquier comida.' },
    pl: { nombre: 'Jajka sadzone', descripcion: 'Szybkie i uniwersalne białko. Idealne do każdego posiłku.' },
  },
  'green-beans-garlic': {
    es: { nombre: 'Judías verdes salteadas con ajo', descripcion: 'Guarnición ligera, rápida y rica en fibra.' },
    pl: { nombre: 'Fasolka szparagowa z czosnkiem', descripcion: 'Lekki, szybki i wysokobłonnikowy dodatek.' },
  },
  'basic-green-salad': {
    es: { nombre: 'Ensalada verde básica', descripcion: 'Ensalada fresca y sencilla, lista en 5 minutos.' },
    pl: { nombre: 'Podstawowa zielona sałatka', descripcion: 'Świeża i prosta sałatka, gotowa w 5 minut.' },
  },
  'whole-wheat-pasta': {
    es: { nombre: 'Pasta integral cocida', descripcion: 'Base versátil de carbohidratos complejos para cualquier salsa.' },
    pl: { nombre: 'Ugotowany makaron pełnoziarnisty', descripcion: 'Uniwersalna baza węglowodanów złożonych do każdego sosu.' },
  },
  'homemade-tomato-sauce': {
    es: { nombre: 'Salsa de tomate casera', descripcion: 'Salsa básica para pasta, pizza o acompañamiento. Fácil de congelar.' },
    pl: { nombre: 'Domowy sos pomidorowy', descripcion: 'Podstawowy sos do makaronu, pizzy lub jako dodatek. Łatwy do zamrożenia.' },
  },
  'roasted-sweet-potato': {
    es: { nombre: 'Boniato asado al horno', descripcion: 'Guarnición nutritiva y dulce natural. Rica en vitamina A y fibra.' },
    pl: { nombre: 'Pieczony batat', descripcion: 'Pożywny i naturalnie słodki dodatek. Bogaty w witaminę A i błonnik.' },
  },
  'canned-tuna-salad': {
    es: { nombre: 'Ensalada de atún en lata', descripcion: 'Comida rápida rica en proteína y omega-3. Sin cocción.' },
    pl: { nombre: 'Sałatka z tuńczykiem z puszki', descripcion: 'Szybki posiłek bogaty w białko i omega-3. Bez gotowania.' },
  },
  'boiled-eggs': {
    es: { nombre: 'Huevos cocidos', descripcion: 'Proteína básica fácil de preparar en cantidad. Perfecto para tentempiés.' },
    pl: { nombre: 'Jajka na twardo', descripcion: 'Podstawowe białko łatwe do przygotowania w większej ilości. Idealne na przekąskę.' },
  },
}

export function getTranslatedRecipe(recipe, lang) {
  if (!recipe) return recipe
  if (lang === 'en') return recipe
  const tr = recipeTranslations[recipe.id]
  if (!tr || !tr[lang]) return recipe
  return {
    ...recipe,
    nombre: tr[lang].nombre || recipe.nombre,
    descripcion: tr[lang].descripcion || recipe.descripcion,
  }
}

export function getTranslatedRecipes(recipes, lang) {
  if (lang === 'en') return recipes
  return recipes.map(r => getTranslatedRecipe(r, lang))
}
