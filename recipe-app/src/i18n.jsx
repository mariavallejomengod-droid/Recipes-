import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
  // Layout
  'app.title': { en: 'My Recipes', es: 'Mis Recetas', pl: 'Moje Przepisy' },
  'app.subtitle': { en: 'Weekly planner', es: 'Planificador semanal', pl: 'Planer tygodniowy' },
  'nav.week': { en: 'Week', es: 'Semana', pl: 'Tydzień' },
  'nav.diet': { en: 'Diet', es: 'Dieta', pl: 'Dieta' },
  'nav.recipes': { en: 'Recipes', es: 'Recetas', pl: 'Przepisy' },
  'nav.shopping': { en: 'Shopping', es: 'Compra', pl: 'Zakupy' },

  // WeekPlanner
  'planner.title': { en: 'Planner', es: 'Planificador', pl: 'Planer' },
  'planner.add': { en: '+ Add', es: '+ Añadir', pl: '+ Dodaj' },
  'planner.selectRecipe': { en: 'Select recipe', es: 'Seleccionar receta', pl: 'Wybierz przepis' },
  'planner.typeYourMeal': { en: 'Type your meal', es: 'Escribe tu comida', pl: 'Wpisz swój posiłek' },
  'planner.searchRecipe': { en: 'Search recipe...', es: 'Buscar receta...', pl: 'Szukaj przepisu...' },
  'planner.freeText': { en: 'Type free text instead', es: 'Escribir texto libre', pl: 'Wpisz tekst ręcznie' },
  'planner.backToRecipes': { en: '← Back to recipes', es: '← Volver a recetas', pl: '← Wróć do przepisów' },
  'planner.add.btn': { en: 'Add', es: 'Añadir', pl: 'Dodaj' },
  'planner.noRecipes': { en: 'No recipes found', es: 'No se encontraron recetas', pl: 'Nie znaleziono przepisów' },
  'planner.freeTextPlaceholder': { en: 'e.g. Leftover pasta, Eating out, Salad...', es: 'Ej. Sobras de pasta, Comer fuera, Ensalada...', pl: 'Np. Resztki makaronu, Jedzenie na mieście, Sałatka...' },
  'planner.resetWeek': { en: 'Reset week', es: 'Reiniciar semana', pl: 'Resetuj tydzień' },
  'planner.resetConfirm': { en: 'Clear all meals for this week?', es: '¿Borrar todas las comidas de esta semana?', pl: 'Wyczyścić wszystkie posiłki na ten tydzień?' },
  'planner.copyAll': { en: 'Copy to all days', es: 'Copiar a todos los días', pl: 'Kopiuj na wszystkie dni' },
  'planner.addShoppingItems': { en: 'Add items to shopping list?', es: '¿Añadir artículos a la lista de la compra?', pl: 'Dodać produkty do listy zakupów?' },
  'planner.shoppingPlaceholder': { en: 'e.g. Bread, cheese, ham...', es: 'Ej. Pan, queso, jamón...', pl: 'Np. Chleb, ser, szynka...' },
  'planner.addItem': { en: 'Add', es: 'Añadir', pl: 'Dodaj' },
  'planner.done': { en: 'Done', es: 'Listo', pl: 'Gotowe' },
  'planner.skip': { en: 'Skip', es: 'Saltar', pl: 'Pomiń' },
  'planner.itemAdded': { en: 'added', es: 'añadido', pl: 'dodano' },

  // ShoppingList
  'shopping.title': { en: 'Shopping list', es: 'Lista de la compra', pl: 'Lista zakupów' },
  'shopping.addItem': { en: 'Add item', es: 'Añadir artículo', pl: 'Dodaj produkt' },
  'shopping.copy': { en: 'Copy', es: 'Copiar', pl: 'Kopiuj' },
  'shopping.copied': { en: 'Copied', es: 'Copiado', pl: 'Skopiowano' },
  'shopping.add': { en: 'Add', es: 'Añadir', pl: 'Dodaj' },
  'shopping.placeholder': { en: 'e.g. Kitchen paper, bin bags...', es: 'Ej. Papel de cocina, bolsas de basura...', pl: 'Np. Ręczniki papierowe, worki na śmieci...' },
  'shopping.empty': { en: 'No shopping list yet', es: 'Aún no hay lista de la compra', pl: 'Brak listy zakupów' },
  'shopping.emptyHint': { en: 'Plan your week first to generate the list, or add items manually', es: 'Planifica tu semana primero o añade artículos manualmente', pl: 'Najpierw zaplanuj tydzień lub dodaj produkty ręcznie' },
  'shopping.of': { en: 'of', es: 'de', pl: 'z' },
  'shopping.items': { en: 'items', es: 'artículos', pl: 'produktów' },
  'shopping.copyPrevious': { en: 'Copy from last week', es: 'Copiar de la semana anterior', pl: 'Kopiuj z ostatniego tygodnia' },
  'shopping.copiedPrevious': { en: 'Copied!', es: '¡Copiado!', pl: 'Skopiowano!' },
  'shopping.noPrevious': { en: 'No list from last week', es: 'No hay lista de la semana anterior', pl: 'Brak listy z ostatniego tygodnia' },
  'shopping.tabFood': { en: 'Food', es: 'Alimentación', pl: 'Żywność' },
  'shopping.tabHouse': { en: 'Household', es: 'Hogar', pl: 'Dom' },
  'shopping.download': { en: 'Download', es: 'Descargar', pl: 'Pobierz' },
  'shopping.housePlaceholder': { en: 'e.g. Toilet paper, soap, bin bags...', es: 'Ej. Papel higiénico, jabón, bolsas de basura...', pl: 'Np. Papier toaletowy, mydło, worki na śmieci...' },
  'shopping.houseEmpty': { en: 'No household items yet', es: 'Aún no hay artículos del hogar', pl: 'Brak artykułów domowych' },
  'shopping.houseEmptyHint': { en: 'Add items like cleaning supplies, paper goods, etc.', es: 'Añade artículos como productos de limpieza, papel, etc.', pl: 'Dodaj produkty takie jak środki czystości, papierowe itp.' },

  // RecipeList
  'recipes.title': { en: 'Recipes', es: 'Recetas', pl: 'Przepisy' },
  'recipes.new': { en: 'New', es: 'Nueva', pl: 'Nowy' },
  'recipes.search': { en: 'Search recipes...', es: 'Buscar recetas...', pl: 'Szukaj przepisów...' },
  'recipes.all': { en: 'All', es: 'Todas', pl: 'Wszystkie' },
  'recipes.mine': { en: 'Mine', es: 'Mías', pl: 'Moje' },
  'recipes.suggested': { en: 'Suggested', es: 'Sugeridas', pl: 'Sugerowane' },
  'recipes.fructose': { en: 'Fructose diet', es: 'Dieta fructosa', pl: 'Dieta fruktozowa' },
  'recipes.filters': { en: 'Filters', es: 'Filtros', pl: 'Filtry' },
  'recipes.batchOnly': { en: 'Batch cooking only', es: 'Solo batch cooking', pl: 'Tylko batch cooking' },
  'recipes.favoritesOnly': { en: 'Favorites only', es: 'Solo favoritas', pl: 'Tylko ulubione' },
  'recipes.tags': { en: 'Tags', es: 'Etiquetas', pl: 'Tagi' },
  'recipes.recipe': { en: 'recipe', es: 'receta', pl: 'przepis' },
  'recipes.recipes': { en: 'recipes', es: 'recetas', pl: 'przepisów' },
  'recipes.noResults': { en: 'No recipes found', es: 'No se encontraron recetas', pl: 'Nie znaleziono przepisów' },
  'recipes.clearFilters': { en: 'Clear filters', es: 'Limpiar filtros', pl: 'Wyczyść filtry' },

  // RecipeDetail
  'detail.notFound': { en: 'Recipe not found', es: 'Receta no encontrada', pl: 'Przepis nie znaleziony' },
  'detail.back': { en: 'Back to recipes', es: 'Volver a recetas', pl: 'Wróć do przepisów' },
  'detail.servings': { en: 'servings', es: 'raciones', pl: 'porcji' },
  'detail.batchCooking': { en: 'Batch cooking', es: 'Batch cooking', pl: 'Batch cooking' },
  'detail.freezable': { en: 'Freezable', es: 'Congelable', pl: 'Nadaje się do mrożenia' },
  'detail.ingredients': { en: 'Ingredients', es: 'Ingredientes', pl: 'Składniki' },
  'detail.instructions': { en: 'Instructions', es: 'Instrucciones', pl: 'Instrukcje' },
  'detail.edit': { en: 'Edit', es: 'Editar', pl: 'Edytuj' },
  'detail.delete': { en: 'Delete', es: 'Eliminar', pl: 'Usuń' },
  'detail.deleteConfirm': { en: 'Delete this recipe?', es: '¿Eliminar esta receta?', pl: 'Usunąć ten przepis?' },
  'detail.addToPlanner': { en: 'Add to planner', es: 'Añadir al planificador', pl: 'Dodaj do planera' },
  'detail.pickSlots': { en: 'Select days and meals', es: 'Selecciona días y comidas', pl: 'Wybierz dni i posiłki' },
  'detail.addSelected': { en: 'Add selected', es: 'Añadir seleccionados', pl: 'Dodaj wybrane' },
  'detail.added': { en: 'Added!', es: '¡Añadido!', pl: 'Dodano!' },
  'detail.selectAll': { en: 'Select all', es: 'Seleccionar todo', pl: 'Zaznacz wszystko' },

  // RecipeForm
  'form.editRecipe': { en: 'Edit recipe', es: 'Editar receta', pl: 'Edytuj przepis' },
  'form.newRecipe': { en: 'New recipe', es: 'Nueva receta', pl: 'Nowy przepis' },
  'form.source': { en: 'Source', es: 'Origen', pl: 'Źródło' },
  'form.sourceMine': { en: 'Mine', es: 'Mía', pl: 'Mój' },
  'form.sourceSuggested': { en: 'Suggested', es: 'Sugerida', pl: 'Sugerowany' },
  'form.sourceDietpro': { en: 'Fructose diet', es: 'Dieta fructosa', pl: 'Dieta fruktozowa' },
  'form.name': { en: 'Name *', es: 'Nombre *', pl: 'Nazwa *' },
  'form.namePlaceholder': { en: 'e.g. Lemon chicken with vegetables', es: 'Ej. Pollo al limón con verduras', pl: 'Np. Kurczak z cytryną i warzywami' },
  'form.description': { en: 'Description', es: 'Descripción', pl: 'Opis' },
  'form.descriptionPlaceholder': { en: 'Brief description of the recipe...', es: 'Breve descripción de la receta...', pl: 'Krótki opis przepisu...' },
  'form.time': { en: 'Time (min)', es: 'Tiempo (min)', pl: 'Czas (min)' },
  'form.servings': { en: 'Servings', es: 'Raciones', pl: 'Porcje' },
  'form.batchCooking': { en: 'Batch cooking', es: 'Batch cooking', pl: 'Batch cooking' },
  'form.freezable': { en: 'Freezable', es: 'Congelable', pl: 'Nadaje się do mrożenia' },
  'form.categories': { en: 'Categories', es: 'Categorías', pl: 'Kategorie' },
  'form.tags': { en: 'Tags', es: 'Etiquetas', pl: 'Tagi' },
  'form.ingredients': { en: 'Ingredients', es: 'Ingredientes', pl: 'Składniki' },
  'form.ingredient': { en: 'Ingredient', es: 'Ingrediente', pl: 'Składnik' },
  'form.qty': { en: 'Qty', es: 'Cant.', pl: 'Ilość' },
  'form.addIngredient': { en: 'Add ingredient', es: 'Añadir ingrediente', pl: 'Dodaj składnik' },
  'form.steps': { en: 'Steps', es: 'Pasos', pl: 'Kroki' },
  'form.step': { en: 'Step', es: 'Paso', pl: 'Krok' },
  'form.addStep': { en: 'Add step', es: 'Añadir paso', pl: 'Dodaj krok' },
  'form.notes': { en: 'Notes', es: 'Notas', pl: 'Notatki' },
  'form.notesPlaceholder': { en: 'Tips, variations, tricks...', es: 'Consejos, variaciones, trucos...', pl: 'Wskazówki, warianty, triki...' },
  'form.saveChanges': { en: 'Save changes', es: 'Guardar cambios', pl: 'Zapisz zmiany' },
  'form.createRecipe': { en: 'Create recipe', es: 'Crear receta', pl: 'Utwórz przepis' },

  // RecipeCard
  'card.mine': { en: 'Mine', es: 'Mía', pl: 'Mój' },
  'card.batch': { en: 'Batch', es: 'Batch', pl: 'Batch' },
  'card.serv': { en: 'serv.', es: 'rac.', pl: 'porc.' },

  // DietGuide
  'diet.title': { en: 'Diet guide', es: 'Guía de dieta', pl: 'Przewodnik dietetyczny' },
  'diet.subtitle': { en: 'Daily reference. Adapted for postpartum and breastfeeding.', es: 'Referencia diaria. Adaptada para posparto y lactancia.', pl: 'Codzienny przewodnik. Dostosowany do okresu poporodowego i karmienia piersią.' },
  'diet.keyPrinciples': { en: 'Key principles', es: 'Principios clave', pl: 'Kluczowe zasady' },
  'diet.dailyTarget': { en: 'Daily target (approx.)', es: 'Objetivo diario (aprox.)', pl: 'Cel dzienny (ok.)' },
  'diet.kcalDay': { en: 'kcal/day', es: 'kcal/día', pl: 'kcal/dzień' },
  'diet.protein': { en: 'protein', es: 'proteína', pl: 'białko' },
  'diet.carbs': { en: 'carbs', es: 'carbos', pl: 'węglowodany' },
  'diet.fat': { en: 'fat', es: 'grasa', pl: 'tłuszcz' },
  'diet.dailyNote': { en: 'Approximate values for gradual weight loss while breastfeeding. No need to count exact calories.', es: 'Valores aproximados para pérdida de peso gradual durante lactancia. No es necesario contar calorías exactas.', pl: 'Przybliżone wartości dla stopniowej utraty wagi podczas karmienia piersią. Nie trzeba liczyć dokładnych kalorii.' },
  'diet.hydration': { en: 'Hydration', es: 'Hidratación', pl: 'Nawodnienie' },
  'diet.hydrationText': { en: '2-3 liters of water per day. A good trick: drink a big glass every time you sit down to breastfeed. You can also have caffeine-free teas, lemon water or broth.', es: '2-3 litros de agua al día. Un buen truco: bebe un vaso grande cada vez que te sientes a dar el pecho. También puedes tomar infusiones sin cafeína, agua con limón o caldo.', pl: '2-3 litry wody dziennie. Dobra sztuczka: pij dużą szklankę za każdym razem, gdy siadasz do karmienia. Możesz też pić herbaty bezkofeinowe, wodę z cytryną lub bulion.' },
  'diet.whatToInclude': { en: 'What to include:', es: 'Qué incluir:', pl: 'Co uwzględnić:' },
  'diet.examples': { en: 'Examples:', es: 'Ejemplos:', pl: 'Przykłady:' },
  'diet.batchCookingDay': { en: 'Batch cooking day (Sunday)', es: 'Día de batch cooking (Domingo)', pl: 'Dzień batch cooking (Niedziela)' },
  'diet.batchCookingIntro': { en: 'Spend 1.5-2 hours on Sunday to prep meals for the week:', es: 'Dedica 1.5-2 horas el domingo a preparar comidas para la semana:', pl: 'Poświęć 1,5-2 godziny w niedzielę na przygotowanie posiłków na cały tydzień:' },

  // Diet meals
  'diet.breakfast.title': { en: 'Breakfast', es: 'Desayuno', pl: 'Śniadanie' },
  'diet.breakfast.time': { en: '~400-450 kcal', es: '~400-450 kcal', pl: '~400-450 kcal' },
  'diet.breakfast.guidelines': {
    en: ['Complex carbs: oats, whole wheat bread, whole grain toast', 'Protein: egg, Greek yogurt, cottage cheese', 'Healthy fat: avocado, nuts, olive oil', 'Fruit: banana, berries, apple, kiwi'],
    es: ['Carbohidratos complejos: avena, pan integral, tostadas integrales', 'Proteína: huevo, yogur griego, requesón', 'Grasa saludable: aguacate, frutos secos, aceite de oliva', 'Fruta: plátano, frutos rojos, manzana, kiwi'],
    pl: ['Węglowodany złożone: owsianka, chleb pełnoziarnisty, tosty pełnoziarniste', 'Białko: jajko, jogurt grecki, twaróg', 'Zdrowe tłuszcze: awokado, orzechy, oliwa z oliwek', 'Owoce: banan, jagody, jabłko, kiwi'],
  },
  'diet.breakfast.examples': {
    en: ['Oatmeal bowl + berries + walnuts + milk', 'Whole wheat toast + avocado + egg + tomato', 'Greek yogurt + sugar-free granola + banana'],
    es: ['Bol de avena + frutos rojos + nueces + leche', 'Tostada integral + aguacate + huevo + tomate', 'Yogur griego + granola sin azúcar + plátano'],
    pl: ['Owsianka + jagody + orzechy włoskie + mleko', 'Tost pełnoziarnisty + awokado + jajko + pomidor', 'Jogurt grecki + granola bez cukru + banan'],
  },
  'diet.breakfast.tip': { en: "Don't skip breakfast. It's key to maintaining energy while breastfeeding.", es: 'No te saltes el desayuno. Es clave para mantener la energía durante la lactancia.', pl: 'Nie pomijaj śniadania. To klucz do utrzymania energii podczas karmienia piersią.' },

  'diet.lunch.title': { en: 'Lunch', es: 'Comida', pl: 'Obiad' },
  'diet.lunch.time': { en: '~500-550 kcal', es: '~500-550 kcal', pl: '~500-550 kcal' },
  'diet.lunch.guidelines': {
    en: ['Protein (palm of your hand): chicken, turkey, fish, eggs, legumes', 'Vegetables (half the plate): broccoli, spinach, green beans, zucchini, salad', 'Complex carb (fist-sized): brown rice, whole wheat pasta, potato, sweet potato, quinoa', 'Fat: olive oil, avocado'],
    es: ['Proteína (palma de la mano): pollo, pavo, pescado, huevos, legumbres', 'Verduras (mitad del plato): brócoli, espinacas, judías verdes, calabacín, ensalada', 'Carbohidrato complejo (tamaño puño): arroz integral, pasta integral, patata, boniato, quinoa', 'Grasa: aceite de oliva, aguacate'],
    pl: ['Białko (dłoń): kurczak, indyk, ryba, jajka, rośliny strączkowe', 'Warzywa (połowa talerza): brokuły, szpinak, fasolka szparagowa, cukinia, sałatka', 'Węglowodany złożone (wielkość pięści): brązowy ryż, makaron pełnoziarnisty, ziemniak, batat, quinoa', 'Tłuszcz: oliwa z oliwek, awokado'],
  },
  'diet.lunch.examples': {
    en: ['Roasted chicken + potatoes + broccoli', 'Lentils with vegetables + whole wheat bread', 'Salmon + sweet potato + asparagus', 'Brown rice + turkey stir-fry + vegetables'],
    es: ['Pollo asado + patatas + brócoli', 'Lentejas con verduras + pan integral', 'Salmón + boniato + espárragos', 'Arroz integral + salteado de pavo + verduras'],
    pl: ['Pieczony kurczak + ziemniaki + brokuły', 'Soczewica z warzywami + chleb pełnoziarnisty', 'Łosoś + batat + szparagi', 'Brązowy ryż + smażony indyk + warzywa'],
  },
  'diet.lunch.tip': { en: 'Lunch is the most complete meal of the day. Always aim for protein + vegetables + carbs.', es: 'La comida es la comida más completa del día. Siempre apunta a proteína + verduras + carbohidratos.', pl: 'Obiad to najpełniejszy posiłek dnia. Zawsze staraj się o białko + warzywa + węglowodany.' },

  'diet.dinner.title': { en: 'Dinner', es: 'Cena', pl: 'Kolacja' },
  'diet.dinner.time': { en: '~400-450 kcal', es: '~400-450 kcal', pl: '~400-450 kcal' },
  'diet.dinner.guidelines': {
    en: ['Light protein: omelette, white fish, chicken, eggs', 'Plenty of vegetables: cream soups, salads, roasted vegetables', 'Light carb (optional): a bit of whole wheat bread, boiled potato', 'Avoid: heavy or large meals before bed'],
    es: ['Proteína ligera: tortilla, pescado blanco, pollo, huevos', 'Muchas verduras: cremas, ensaladas, verduras asadas', 'Carbohidrato ligero (opcional): un poco de pan integral, patata cocida', 'Evitar: comidas pesadas o abundantes antes de dormir'],
    pl: ['Lekkie białko: omlet, biała ryba, kurczak, jajka', 'Dużo warzyw: zupy krem, sałatki, warzywa pieczone', 'Lekkie węglowodany (opcjonalnie): trochę chleba pełnoziarnistego, gotowany ziemniak', 'Unikaj: ciężkich lub obfitych posiłków przed snem'],
  },
  'diet.dinner.examples': {
    en: ['Spinach omelette + salad', 'Butternut squash soup + whole wheat toast with cream cheese', 'Mushroom and asparagus scramble + whole wheat bread', 'Baked hake + roasted vegetables'],
    es: ['Tortilla de espinacas + ensalada', 'Crema de calabaza + tostada integral con queso crema', 'Revuelto de champiñones y espárragos + pan integral', 'Merluza al horno + verduras asadas'],
    pl: ['Omlet ze szpinakiem + sałatka', 'Zupa krem z dyni + tost pełnoziarnisty z serem kremowym', 'Jajecznica z pieczarkami i szparagami + chleb pełnoziarnisty', 'Pieczony morszczuk + warzywa pieczone'],
  },
  'diet.dinner.tip': { en: "Keep dinner light but sufficient. If you breastfeed at night, don't go to bed hungry.", es: 'Mantén la cena ligera pero suficiente. Si das el pecho por la noche, no te vayas a dormir con hambre.', pl: 'Kolacja powinna być lekka, ale wystarczająca. Jeśli karmisz w nocy, nie kładź się spać głodna.' },

  'diet.snack.title': { en: 'Snacks (mid-morning / afternoon)', es: 'Tentempiés (media mañana / tarde)', pl: 'Przekąski (drugie śniadanie / podwieczorek)' },
  'diet.snack.time': { en: '~150-200 kcal each', es: '~150-200 kcal cada uno', pl: '~150-200 kcal każda' },
  'diet.snack.guidelines': {
    en: ['Combine protein or fat with fruit or carbs to stay full', 'Fruit + nuts (small handful)', 'Plain Greek yogurt + fruit', 'Hummus + carrot or cucumber sticks', 'Small toast with cream cheese'],
    es: ['Combinar proteína o grasa con fruta o carbohidratos para saciarte', 'Fruta + frutos secos (un puñadito)', 'Yogur griego natural + fruta', 'Hummus + bastones de zanahoria o pepino', 'Tostada pequeña con queso crema'],
    pl: ['Połącz białko lub tłuszcz z owocami lub węglowodanami dla sytości', 'Owoce + orzechy (mała garść)', 'Jogurt grecki naturalny + owoce', 'Hummus + marchewka lub paski ogórka', 'Mały tost z serkiem kremowym'],
  },
  'diet.snack.examples': {
    en: ['Apple + handful of almonds', 'Greek yogurt + blueberries', 'Hummus + carrot sticks', 'Energy balls (dates + oats)', 'Banana + spoonful of peanut butter'],
    es: ['Manzana + puñado de almendras', 'Yogur griego + arándanos', 'Hummus + bastones de zanahoria', 'Energy balls (dátiles + avena)', 'Plátano + cucharada de mantequilla de cacahuete'],
    pl: ['Jabłko + garść migdałów', 'Jogurt grecki + borówki', 'Hummus + paski marchewki', 'Kulki energetyczne (daktyle + owsianka)', 'Banan + łyżka masła orzechowego'],
  },
  'diet.snack.tip': { en: "Having snacks ready prevents reaching for unhealthy options when you're tired.", es: 'Tener tentempiés listos evita recurrir a opciones poco saludables cuando estás cansada.', pl: 'Gotowe przekąski zapobiegają sięganiu po niezdrowe opcje, gdy jesteś zmęczona.' },

  // Diet principles
  'diet.principle.1.title': { en: 'No strict dieting', es: 'Sin dietas estrictas', pl: 'Bez ścisłych diet' },
  'diet.principle.1.desc': { en: 'While breastfeeding you need ~1800-2100 kcal/day. Cutting too much affects milk supply and your energy.', es: 'Durante la lactancia necesitas ~1800-2100 kcal/día. Recortar demasiado afecta la producción de leche y tu energía.', pl: 'Podczas karmienia piersią potrzebujesz ~1800-2100 kcal/dzień. Zbyt duże ograniczenia wpływają na produkcję mleka i Twoją energię.' },
  'diet.principle.2.title': { en: 'Protein at every meal', es: 'Proteína en cada comida', pl: 'Białko w każdym posiłku' },
  'diet.principle.2.desc': { en: 'Helps with satiety, maintaining muscle mass and postpartum recovery. Goal: ~80-100g/day.', es: 'Ayuda con la saciedad, mantener masa muscular y recuperación posparto. Objetivo: ~80-100g/día.', pl: 'Pomaga w sytości, utrzymaniu masy mięśniowej i regeneracji poporodowej. Cel: ~80-100g/dzień.' },
  'diet.principle.3.title': { en: 'Stay hydrated', es: 'Mantente hidratada', pl: 'Pij dużo wody' },
  'diet.principle.3.desc': { en: 'Drink 2-3 liters of water per day. Always keep a bottle handy, especially during feeds.', es: 'Bebe 2-3 litros de agua al día. Ten siempre una botella a mano, especialmente durante las tomas.', pl: 'Pij 2-3 litry wody dziennie. Zawsze miej butelkę pod ręką, szczególnie podczas karmienia.' },
  'diet.principle.4.title': { en: 'Prioritize iron and calcium', es: 'Prioriza hierro y calcio', pl: 'Priorytet: żelazo i wapń' },
  'diet.principle.4.desc': { en: 'Spinach, lentils, red meat (moderate), dairy, broccoli, nuts, seeds.', es: 'Espinacas, lentejas, carne roja (moderada), lácteos, brócoli, frutos secos, semillas.', pl: 'Szpinak, soczewica, czerwone mięso (umiarkowanie), nabiał, brokuły, orzechy, nasiona.' },
  'diet.principle.5.title': { en: 'Omega-3 for breastfeeding', es: 'Omega-3 para la lactancia', pl: 'Omega-3 dla karmienia piersią' },
  'diet.principle.5.desc': { en: 'Salmon, sardines, walnuts, chia and flax seeds. Aim for oily fish 2-3 times per week.', es: 'Salmón, sardinas, nueces, semillas de chía y lino. Intenta comer pescado azul 2-3 veces por semana.', pl: 'Łosoś, sardynki, orzechy włoskie, nasiona chia i lnu. Jedz tłuste ryby 2-3 razy w tygodniu.' },
  'diet.principle.6.title': { en: 'Gradual weight loss', es: 'Pérdida de peso gradual', pl: 'Stopniowa utrata wagi' },
  'diet.principle.6.desc': { en: "Realistic goal: ~0.5 kg per week (~2 kg per month). In 4-5 months you'll reach your target without forcing it.", es: 'Objetivo realista: ~0.5 kg por semana (~2 kg al mes). En 4-5 meses alcanzarás tu objetivo sin forzar.', pl: 'Realistyczny cel: ~0,5 kg tygodniowo (~2 kg miesięcznie). W 4-5 miesięcy osiągniesz cel bez wysiłku.' },

  // Diet batch cooking steps
  'diet.batchSteps': {
    en: [
      'Cook a large batch of protein: roast chicken, turkey strips or stew (4-5 servings)',
      'Prepare a base grain: brown rice, quinoa or whole wheat pasta',
      'Make a vegetable cream soup (4-5 servings, freeze half)',
      'Wash and chop vegetables for quick salads and stir-fries',
      'Make hummus or another snack for the week',
      'Prepare energy balls or batch snacks',
      'Set up overnight oats for 2-3 breakfasts',
    ],
    es: [
      'Cocinar una buena cantidad de proteína: pollo asado, tiras de pavo o guiso (4-5 raciones)',
      'Preparar una base de cereales: arroz integral, quinoa o pasta integral',
      'Hacer una crema de verduras (4-5 raciones, congelar la mitad)',
      'Lavar y cortar verduras para ensaladas rápidas y salteados',
      'Hacer hummus u otro tentempié para la semana',
      'Preparar energy balls o snacks en cantidad',
      'Preparar overnight oats para 2-3 desayunos',
    ],
    pl: [
      'Ugotuj dużą porcję białka: pieczony kurczak, paski z indyka lub gulasz (4-5 porcji)',
      'Przygotuj bazę zbożową: brązowy ryż, quinoa lub makaron pełnoziarnisty',
      'Zrób zupę krem z warzyw (4-5 porcji, połowę zamroź)',
      'Umyj i pokrój warzywa na szybkie sałatki i dania smażone',
      'Zrób hummus lub inną przekąskę na tydzień',
      'Przygotuj kulki energetyczne lub przekąski w większej ilości',
      'Przygotuj overnight oats na 2-3 śniadania',
    ],
  },

  // Categories
  'cat.breakfast': { en: 'Breakfast', es: 'Desayuno', pl: 'Śniadanie' },
  'cat.lunch': { en: 'Lunch', es: 'Comida', pl: 'Obiad' },
  'cat.dinner': { en: 'Dinner', es: 'Cena', pl: 'Kolacja' },
  'cat.snack': { en: 'Snack', es: 'Tentempié', pl: 'Przekąska' },

  // Days
  'day.monday': { en: 'Monday', es: 'Lunes', pl: 'Poniedziałek' },
  'day.tuesday': { en: 'Tuesday', es: 'Martes', pl: 'Wtorek' },
  'day.wednesday': { en: 'Wednesday', es: 'Miércoles', pl: 'Środa' },
  'day.thursday': { en: 'Thursday', es: 'Jueves', pl: 'Czwartek' },
  'day.friday': { en: 'Friday', es: 'Viernes', pl: 'Piątek' },
  'day.saturday': { en: 'Saturday', es: 'Sábado', pl: 'Sobota' },
  'day.sunday': { en: 'Sunday', es: 'Domingo', pl: 'Niedziela' },

  // Ingredient categories
  'ingcat.vegetables': { en: 'Vegetables', es: 'Verduras', pl: 'Warzywa' },
  'ingcat.fruits': { en: 'Fruits', es: 'Frutas', pl: 'Owoce' },
  'ingcat.protein': { en: 'Protein', es: 'Proteínas', pl: 'Białko' },
  'ingcat.dairy': { en: 'Dairy', es: 'Lácteos', pl: 'Nabiał' },
  'ingcat.grains': { en: 'Grains & legumes', es: 'Cereales y legumbres', pl: 'Zboża i rośliny strączkowe' },
  'ingcat.pantry': { en: 'Pantry', es: 'Despensa', pl: 'Spiżarnia' },
  'ingcat.frozen': { en: 'Frozen', es: 'Congelados', pl: 'Mrożonki' },
  'ingcat.other': { en: 'Other', es: 'Otros', pl: 'Inne' },

  // Tags
  'tag.high-protein': { en: 'High protein', es: 'Alta en proteína', pl: 'Wysokobiałkowe' },
  'tag.quick': { en: 'Quick (<20 min)', es: 'Rápida (<20 min)', pl: 'Szybkie (<20 min)' },
  'tag.breastfeeding': { en: 'Breastfeeding friendly', es: 'Apta lactancia', pl: 'Dobre przy karmieniu' },
  'tag.vegetarian': { en: 'Vegetarian', es: 'Vegetariana', pl: 'Wegetariańskie' },
  'tag.iron-rich': { en: 'Iron rich', es: 'Rica en hierro', pl: 'Bogate w żelazo' },
  'tag.calcium-rich': { en: 'Calcium rich', es: 'Rica en calcio', pl: 'Bogate w wapń' },
  'tag.high-fiber': { en: 'High fiber', es: 'Alta en fibra', pl: 'Wysokobłonnikowe' },
  'tag.omega-3': { en: 'Omega-3', es: 'Omega-3', pl: 'Omega-3' },
  'tag.gluten-free': { en: 'Gluten free', es: 'Sin gluten', pl: 'Bezglutenowe' },
  'tag.filling': { en: 'Filling', es: 'Saciante', pl: 'Sycące' },

  // Shopping list header & CSV
  'shopping.listHeader': { en: 'SHOPPING LIST', es: 'LISTA DE LA COMPRA', pl: 'LISTA ZAKUPÓW' },
  'shopping.csvCategory': { en: 'Category', es: 'Categoría', pl: 'Kategoria' },
  'shopping.csvItem': { en: 'Item', es: 'Artículo', pl: 'Produkt' },
  'shopping.csvQty': { en: 'Quantity', es: 'Cantidad', pl: 'Ilość' },
  'shopping.csvUnit': { en: 'Unit', es: 'Unidad', pl: 'Jednostka' },
  'shopping.csvRecipes': { en: 'Recipes', es: 'Recetas', pl: 'Przepisy' },
  'shopping.csvChecked': { en: 'Checked', es: 'Comprado', pl: 'Kupione' },
  'shopping.csvYes': { en: 'Yes', es: 'Sí', pl: 'Tak' },
  'shopping.csvNo': { en: 'No', es: 'No', pl: 'Nie' },
}

const LANGUAGES = ['en', 'es', 'pl']
const LANG_LABELS = { en: 'English', es: 'Español', pl: 'Polski' }
const LANG_SHORT = { en: 'EN', es: 'ES', pl: 'PL' }

const LangContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('recetario_lang') || 'en')

  const toggle = useCallback(() => {
    setLang(prev => {
      const idx = LANGUAGES.indexOf(prev)
      const next = LANGUAGES[(idx + 1) % LANGUAGES.length]
      localStorage.setItem('recetario_lang', next)
      return next
    })
  }, [])

  const changeLang = useCallback((newLang) => {
    if (LANGUAGES.includes(newLang)) {
      localStorage.setItem('recetario_lang', newLang)
      setLang(newLang)
    }
  }, [])

  const t = useCallback((key) => {
    const entry = translations[key]
    if (!entry) return key
    if (typeof entry === 'string') return entry
    return entry[lang] ?? entry.en ?? key
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, toggle, changeLang, t, LANGUAGES, LANG_LABELS, LANG_SHORT }}>
      {children}
    </LangContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LangContext)
}
