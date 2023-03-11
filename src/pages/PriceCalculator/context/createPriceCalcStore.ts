import {
  getIngredientDisplayName,
  getIngredientId,
  getItemId,
  getRecipeEvenPercentages,
} from './../../../utils/helpers';
import {
  getFlatRecipeIngredients,
  RecipeNodeFlat,
} from './../../../utils/recipeHelper';
import { useMainContext } from './../../../hooks/MainContext/MainContext';
import { createLocalStore } from '../../../utils/createLocalStore';
import { Store } from 'solid-js/store';
import { Accessor, createMemo, createSignal } from 'solid-js';
import { getSelectedOrFirstRecipeVariant } from '../../../utils/recipeHelper';
import {
  calcAmmount,
  calcPrice,
  formatNumber,
  convertToMarginMultiplier,
} from '../../../utils/helpers';

type StoreType = {
  simpleMode: boolean;
  showRecipes: boolean;
  showPersonalPrices: boolean;
  showRecipeTree: boolean;
  focusedProdPath: string[];
};

type StoreUpdate = {
  toggleSimpleMode: () => void;
  setShowRecipes: (showRecipes: boolean) => void;
  setShowPersonalPrices: (showPersonalProces: boolean) => void;
  toggleShowRecipeTree: () => void;
  replaceFocusedProductPath: (focusedProductPath: string[]) => void;
  focusChildProduct: (focusedProd: string) => void;
};

type SelectedRecipes = {
  [key: string]: string;
};

const TableWatts = {
  'Bakery Oven': 10,
  'Blast Furnace': 50,
  'Bloomery': 10,
  'Campfire': 10,
  'Cast Iron Stove': 10,
  'Cement Kiln': 50,
  'Kiln': 50,
  'Oil Refinery': 50,
} as Record<string, number>;

export type PriceCalcStore = {
  state: Store<StoreType>;
  craftModule: Accessor<number>;
  craftAmmount: Accessor<number>;
  craftLavish: Accessor<boolean>;
  craftLevel: Accessor<number>;
  recipeMargin: Accessor<number>;
  focusedNode: Accessor<RecipeNodeFlat | undefined>;
  selectedVariant: Accessor<RecipeVariant | undefined>;
  recipe: Accessor<Recipe | undefined>;
  recipeSkill: Accessor<string>;
  variantId: Accessor<string>;
  recipeIngredients: Accessor<
    (RecipeIngredient & {
      calcQuantity: number;
      unitPrice: number;
      calcPrice: number;
    })[]
  >;
  recipeCalories: Accessor<number | undefined>;
  recipeCalorieCost: Accessor<number | undefined>;
  recipeCalorieTotalCost: Accessor<number | undefined>;
  recipeCraftTimeInSeconds: Accessor<number | undefined>;
  recipeJoules: Accessor<number | undefined>;
  recipeFuelCost: Accessor<number | undefined>;
  recipeFuelTotalCost: Accessor<number | undefined>;
  totalIngredientCost: Accessor<number>;
  unitCostWithProfit: Accessor<number>;
  recipeProducts: Accessor<
    {
      costPercentage: number;
      productionCost: number;
      retailPrice: number;
      Name: string;
      Ammount: number;
    }[]
  >;
  costPercentages: Accessor<
    {
      prod: string;
      perc: number;
    }[]
  >;
  selectedProduct: Accessor<string | undefined>;
  selectedRecipes: Accessor<SelectedRecipes>;
  setSelectedProduct: (prod: string | undefined) => void;
  setSelectedRecipes: SetSignal<SelectedRecipes>;
  update: StoreUpdate;
  calcExplanation: (prodName: string, currencyName: string) => string;
};

const moduleReductions = [1, 0.9, 0.75, 0.6, 0.55, 0.5];
export default (): PriceCalcStore => {
  const { mainState, get, allCraftableProducts, tagsResource, allItemsAndTagsWithPrice } =
    useMainContext();
  const [state, setState] = createLocalStore<StoreType>(
    {
      simpleMode: true,
      showRecipes: false,
      showPersonalPrices: false,
      showRecipeTree: false,
      focusedProdPath: [],
    },
    'PriceCalculatorPriceCalcStore'
  );

  const [selectedProduct, setSelectedProduct] = createSignal<string>();

  const [selectedRecipes, setSelectedRecipes] = createSignal<SelectedRecipes>(
    {}
  );

  // Ingredients for the selected product (NOT the focused product!)
  const flatRecipeIngredientsTree = createMemo(() =>
    getFlatRecipeIngredients(
      Object.values(allCraftableProducts()) ?? [],
      selectedRecipes(),
      tagsResource?.()?.Tags ?? {},
      selectedProduct() ?? ''
    )
  );

  const focusedProd = createMemo(() =>
    state.focusedProdPath.length === 0
      ? undefined
      : state.focusedProdPath[state.focusedProdPath.length - 1]
  );

  const focusedNode = createMemo(() =>
    flatRecipeIngredientsTree().find((t) => t.ingredientId == focusedProd())
  );

  const recipe = createMemo(() => focusedNode()?.selectedVariant?.Recipe);

  const recipeSkill = createMemo(() => recipe()?.SkillNeeds?.[0]?.Skill ?? '');

  const selectedVariant = createMemo(() =>
    getSelectedOrFirstRecipeVariant(
      focusedNode()?.recipeVariants ?? [],
      selectedRecipes()[focusedProd() ?? '']
    )
  );

  const variantId = createMemo(() => selectedVariant()?.Variant.Key ?? '');

  const craftModule = createMemo(() => state.simpleMode ? 0 : get.craftModule(variantId()));
  const craftAmmount = createMemo(() => state.simpleMode ? 1 : get.craftAmmount(variantId()));
  const craftLavish = createMemo(() => state.simpleMode ? false : get.craftLavish(variantId()));
  const craftLevel = createMemo(() => state.simpleMode ? 1 : get.craftLevel(recipeSkill()));
  const recipeMargin = createMemo(() => state.simpleMode ? 10 : get.recipeMargin(variantId()));

  const costPercentages = createMemo(() => {
    const variant = selectedVariant()?.Variant;
    if (variant == null) return [];
    return get.costPercentage(variant.Key) ?? getRecipeEvenPercentages(variant);
  });

  // This is the recipe ingredients for the focused product
  const recipeIngredients = createMemo(() => {
    const variant = selectedVariant();
    if (variant == undefined) return [];
    return variant.Variant.Ingredients.map((ingredient) => {
      const reduction =
        moduleReductions[craftModule()] * (craftLavish() ? 0.95 : 1);
      const quantity = formatNumber(
        ingredient.Ammount * (ingredient.IsStatic ? 1 : reduction)
      );
      const quantityBasedOnCraftAmmount = calcAmmount(quantity, craftAmmount());
      return {
        ...ingredient,
        calcQuantity: quantityBasedOnCraftAmmount,
        unitPrice: calcPrice(
          quantityBasedOnCraftAmmount / craftAmmount(),
          state.simpleMode ? allItemsAndTagsWithPrice()?.[getIngredientId(ingredient)]?.AvgPrice ?? 0 :
            get.personalPrice(getIngredientId(ingredient))
        ),
        calcPrice: calcPrice(
          quantityBasedOnCraftAmmount,
          state.simpleMode ? allItemsAndTagsWithPrice()?.[getIngredientId(ingredient)]?.AvgPrice ?? 0 :
            get.personalPrice(getIngredientId(ingredient))
        ),
      };
    });
  });

  const skillLevelReductions = [0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2];
  const reduction = createMemo(() => recipe()?.SkillNeeds.length ?? 0 > 0
    ? skillLevelReductions[craftLevel()]
    : 1);
  const recipeCalories = createMemo(() =>
    (recipe()?.BaseLaborCost ?? 0) * reduction()
  );
  const recipeCalorieCost = createMemo(
    () => (recipeCalories() / 1000) * mainState.calorieCost
  );
  const recipeCalorieTotalCost = createMemo(
    () => recipeCalorieCost() * craftAmmount()
  );

  const tableJouleConsumption = createMemo(() => TableWatts[recipe()?.CraftingTable ?? ''] ?? 0)

  const recipeCraftTimeInSeconds = createMemo(() =>
    (recipe()?.BaseCraftTime ?? 0) * 60 * reduction()
  );
  const recipeJoules = createMemo(() =>
    recipeCraftTimeInSeconds() * tableJouleConsumption()
  );
  const recipeFuelCost = createMemo(() =>
    recipeJoules() * mainState.costPer1kJoule / 1000
  );
  const recipeFuelTotalCost = createMemo(() =>
    recipeFuelCost() * craftAmmount()
  );

  const totalIngredientCost = createMemo(() =>
    formatNumber(
      (recipeIngredients()?.reduce((prev, next) => prev + next.calcPrice, 0) ??
        0) + recipeCalorieTotalCost() + recipeFuelTotalCost()
    )
  );

  const unitCostWithProfit = createMemo(() =>
    formatNumber(
      (totalIngredientCost() / craftAmmount()) *
      convertToMarginMultiplier(recipeMargin())
    )
  );

  const recipeProducts = createMemo(() => {
    const variant = selectedVariant();
    if (variant == undefined) return [];
    return variant.Variant.Products.map((product) => {
      const costPercentage =
        costPercentages().find((t) => t.prod === product.Name)?.perc ?? 0;
      return {
        ...product,
        costPercentage,
        productionCost: formatNumber(
          ((totalIngredientCost() / craftAmmount()) * (costPercentage / 100)) /
          product.Ammount
        ),
        retailPrice: formatNumber(
          (unitCostWithProfit() * (costPercentage / 100)) / product.Ammount
        ),
      };
    });
  });

  const calcExplanation =
    (productName: string, currencyName: string) => {
      const ingredients = recipeIngredients()
      const ingredientsStr = ingredients.map(ingredient => ` - ${ingredient.calcQuantity}(${craftAmmount() === 1 ? '' : craftAmmount() + 'x'}${ingredient.Ammount}${!ingredient.IsStatic ? 'x' + moduleReductions[craftModule()] : ''}${!ingredient.IsStatic && craftLavish() ? 'x0.95' : ''}) ${getIngredientDisplayName(ingredient)} @ ${get.personalPrice(getIngredientId(ingredient))} ${currencyName} = ${ingredient.calcPrice} ${currencyName}`)
      const product = recipeProducts().find(product => product.Name === productName)
      return [
        `Calculated cost of ${productName} = ${product?.productionCost} ${currencyName}`,
        `Using recipe ${focusedNode()?.selectedVariant?.Variant.Key} at table ${recipe()?.CraftingTable} with module lvl ${craftModule()}`,
        `From ${product?.Ammount !== 1 ? `1/${product?.Ammount} of ` : ''}${product?.costPercentage !== 100 ? `${product?.costPercentage}% of ` : ''}${formatNumber(totalIngredientCost() / craftAmmount())} ${currencyName} ${craftAmmount() > 1 ? `(total of ${totalIngredientCost()} each) ` : ''}from the sum of ingredients for ${craftAmmount()} repetition(s):`,
        ...ingredientsStr,
        recipeCalorieTotalCost() > 0 ?
          ` - Labor ${formatNumber(recipeCalorieTotalCost() ?? 0)} ${currencyName}` : undefined,
        recipeJoules() > 0 ? ` - Fuel ${formatNumber(recipeFuelTotalCost())} ${currencyName}` : undefined,
      ].filter(t => !!t).join('\n');
    }

  return {
    state,
    craftModule,
    craftAmmount,
    craftLavish,
    craftLevel,
    recipeMargin,
    recipeIngredients,
    recipeCalories,
    recipeCalorieCost,
    recipeCalorieTotalCost,
    recipeCraftTimeInSeconds,
    recipeJoules,
    recipeFuelCost,
    recipeFuelTotalCost,
    totalIngredientCost,
    unitCostWithProfit,
    recipeProducts,
    focusedNode,
    selectedVariant,
    recipe,
    recipeSkill,
    variantId,
    selectedProduct,
    selectedRecipes,
    costPercentages,
    setSelectedProduct: (prod: string | undefined) => {
      setSelectedProduct(prod);
      if (prod != undefined) setState({ focusedProdPath: [getItemId(prod)] });
    },
    setSelectedRecipes,
    update: {
      toggleSimpleMode: () => setState(prev => ({ simpleMode: !prev.simpleMode })),
      setShowRecipes: (newValue: boolean) =>
        setState({ showRecipes: newValue }),
      setShowPersonalPrices: (newValue: boolean) =>
        setState({ showPersonalPrices: newValue }),
      toggleShowRecipeTree: () =>
        setState((prev) => ({ showRecipeTree: !prev.showRecipeTree })),
      replaceFocusedProductPath: (focusedProductPath: string[]) =>
        setState({ focusedProdPath: focusedProductPath }),
      focusChildProduct: (focusedProd: string) =>
        setState((prev) => ({
          focusedProdPath: [...prev.focusedProdPath, focusedProd],
        })),
    } as StoreUpdate,
    calcExplanation,
  };
};
