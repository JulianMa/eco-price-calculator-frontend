import {
  Accessor,
  createMemo,
  JSXElement,
  createContext,
  useContext,
  createResource,
  Resource,
} from 'solid-js';
import { Store } from 'solid-js/store';
import { createLocalStore } from '../../utils/createLocalStore';
import {
  filterUnique,
  sortByText,
  sortByTextExcludingWord,
} from '../../utils/helpers';
import { getSelectedRecipeVariant } from '../../utils/recipeHelper';
import { getRecipes, getStores, getTags } from '../../utils/restDbSdk';

type MainContextType = {
  storesResource: Resource<StoresResponse | undefined>;
  recipesResource: Resource<RecipesResponse | undefined>;
  tagsResource: Resource<TagsResponse | undefined>;
  isLoadingResources: Accessor<boolean>;
  dbs: Accessor<DB[] | undefined>;
  currentCurrency: Accessor<string>;
  allCurrencies: Accessor<string[] | undefined>;
  allProfessions: Accessor<string[] | undefined>;
  allCraftStations: Accessor<string[] | undefined>;
  allProductsInStores: Accessor<ProductOffer[] | undefined>;
  allCraftableProducts: Accessor<CraftableProduct[] | undefined>;
  mainState: Store<MainStore>;
  refetch: () => void;
  get: {
    personalPrice: (productName?: string) => number;
    craftAmmount: (productName?: string) => number;
    craftModule: (productName?: string) => number;
    craftLavish: (productName?: string) => boolean;
    craftLevel: (productName?: string) => number;
    calorieCostPerRecipe: (productName?: string) => number;
    recipeMargin: (recipeKey?: string) => number;
    costPercentage: (variantKey?: string) => {
      prod: string;
      perc: number;
    }[];
  };
  update: {
    currency: (newCurrency: string) => void;
    userName: (username: string) => void;
    personalPrice: (
      product: string,
      currency: string,
      newPrice: number
    ) => void;
    craftAmmount: (product: string, ammount: number) => void;
    craftModule: (product: string, module: number) => void;
    craftLavish: (product: string, lavishEnabled: boolean) => void;
    craftLevel: (product: string, level: number) => void;
    recipeMargin: (recipeKey: string, margin: number) => void;
    costPercentage: (
      variantKey: string,
      percentages: {
        prod: string;
        perc: number;
      }[]
    ) => void;
    calorieCost: (cost: number) => void;
  };
};

const [storesResource, { refetch: refetchStores }] = createResource(getStores);
const [recipesResource, { refetch: refetchRecipes }] =
  createResource(getRecipes);
const [tagsResource, { refetch: refetchTags }] = createResource(getTags);

const isLoadingResources = createMemo(
  () => !storesResource() || !recipesResource() || !tagsResource()
);

const MainContext = createContext<MainContextType>({
  storesResource,
  recipesResource,
  tagsResource,
  isLoadingResources,
  dbs: () => [],
  currentCurrency: () => '',
  allCurrencies: () => [],
  allProfessions: () => [],
  allCraftStations: () => [],
  allProductsInStores: () => [],
  allCraftableProducts: () => [],
  mainState: {
    currency: '',
    userName: '',
    calorieCost: 0,
  },
  refetch: () => undefined,
  get: {
    personalPrice: (productName?: string) => 0,
    craftAmmount: (productName?: string) => 1,
    craftModule: (productName?: string) => 0,
    craftLavish: (productName?: string) => true,
    calorieCostPerRecipe: (productName?: string) => 0,
    recipeMargin: (recipeKey?: string) => 0,
    costPercentage: (variantKey?: string) => [],
    craftLevel: (productName?: string) => 0,
  },
  update: {
    currency: () => undefined,
    userName: () => undefined,
    personalPrice: (product: string, currency: string, newPrice: number) =>
      undefined,
    craftAmmount: (product: string, ammount: number) => undefined,
    craftModule: (product: string, module: number) => undefined,
    craftLavish: (product: string, lavishEnabled: boolean) => undefined,
    craftLevel: (product: string, level: number) => undefined,
    recipeMargin: (recipeKey: string, module: number) => undefined,
    costPercentage: () => undefined,
    calorieCost: (cost: number) => undefined,
  },
});
type Props = {
  children: JSXElement;
};
type MainStore = {
  currency: string;
  userName: string;
  calorieCost: number;
};

type PersonalPricesStore = {
  [productName: string]: { [currency: string]: number };
};

type ProdNumberStore = {
  [productName: string]: number;
};

type ProdBoolStore = {
  [productName: string]: boolean;
};

type CostPercentagesStore = {
  [variantKey: string]: { prod: string; perc: number }[];
};

export const MainContextProvider = (props: Props) => {
  const [personalPricesState, setPersonalPricesState] =
    createLocalStore<PersonalPricesStore>({}, 'PersonalPricesStore');
  const [craftAmmoutState, setCraftAmmoutState] =
    createLocalStore<ProdNumberStore>({}, 'craftAmmountStore');
  const [craftModuleState, setCraftModuleState] =
    createLocalStore<ProdNumberStore>({}, 'craftModuleStore');
  const [craftLavishState, setCraftLavishState] =
    createLocalStore<ProdBoolStore>({}, 'craftLavishStore');
  const [craftLevelState, setCraftLevelState] =
    createLocalStore<ProdNumberStore>({}, 'craftLevelStore');
  const [recipeMarginState, setRecipeMarginState] =
    createLocalStore<ProdNumberStore>({}, 'recipeMarginStore');
  const [CostPercentagesState, setCostPercentagesState] =
    createLocalStore<CostPercentagesStore>({}, 'CostPercentagesStore');

  const [mainState, setState] = createLocalStore<MainStore>(
    {
      currency: '',
      userName: '',
      calorieCost: 0,
    },
    'MainStore'
  );

  const allCurrencies = createMemo(() =>
    storesResource()
      ?.Stores?.map((store) => store.CurrencyName)
      .filter(filterUnique)
      .sort(sortByTextExcludingWord('Credit'))
  );

  const currentCurrency = createMemo<string>(() => {
    // If there's a valid currency selected, use that one
    if (allCurrencies()?.includes(mainState.currency)) {
      return mainState.currency;
    }

    // Try to select the user's currency otherwise
    if (mainState.userName.length > 0) {
      const userPersonalCurrency = allCurrencies()?.find(
        (t) => t.indexOf(mainState.userName) === 1
      );
      if (userPersonalCurrency) {
        return userPersonalCurrency;
      }
    }

    // When everything else fails, just return the first valid one
    return allCurrencies()?.[0] ?? '';
  });

  const allProductsInStores = createMemo(() =>
    storesResource()
      ?.Stores?.map((store) =>
        store.AllOffers.map(
          (offer) =>
            ({
              ...offer,
              StoreName: store.Name,
              StoreOwner: store.Owner,
              CurrencyName: store.CurrencyName,
            } as ProductOffer)
        )
      )
      .flat()
      .sort((a, b) => {
        const nameSort = a.ItemName?.toLowerCase().localeCompare(
          b.ItemName?.toLowerCase()
        );
        if (nameSort !== 0) {
          return nameSort;
        }
        return a.Buying ? 1 : -1;
      })
  );
  const allCraftableProducts = createMemo(() => {
    const CraftableProductsDict =
      recipesResource()
        ?.Recipes?.map((recipe) =>
          recipe.Variants.map((variant) =>
            variant.Products.map((prod) => ({
              Name: prod.Name,
              Recipe: recipe,
              Variant: variant,
            }))
          )?.flat()
        )
        ?.flat()
        ?.reduce(
          (prev, next) => ({
            ...prev,
            [next.Name]: {
              Name: next.Name,
              RecipeVariants: [
                ...(prev[next.Name]?.RecipeVariants ?? []),
                { Recipe: next.Recipe, Variant: next.Variant },
              ],
            } as CraftableProduct,
          }),
          {} as { [name: string]: CraftableProduct }
        ) ?? {};

    return Object.values(CraftableProductsDict)
      .map(
        (prod) =>
          ({
            ...prod,
            Offers: allProductsInStores()?.filter(
              (t) => t.ItemName === prod.Name
            ),
          } as CraftableProduct)
      )
      .map((prod) => {
        for (let i = 0; i < prod.RecipeVariants.length; ++i) {
          const variant = prod.RecipeVariants[i];
          if (
            prod.RecipeVariants.findIndex(
              (v, j) => v.Variant.Key == variant.Variant.Key && i != j
            ) >= 0
          ) {
            variant.Variant.Key += '' + i;
          }
        }

        return prod;
      })
      .sort(
        (a, b) =>
          a.Name?.toLowerCase()?.localeCompare(b.Name?.toLowerCase() ?? '') ?? 0
      );
  });

  const allProfessions = createMemo(() =>
    recipesResource()
      ?.Recipes?.map((recipe) => recipe.SkillNeeds.map((t) => t.Skill))
      .flat()
      .filter(filterUnique)
      .sort(sortByText)
  );

  const allCraftStations = createMemo(() =>
    recipesResource()
      ?.Recipes?.map((recipe) => recipe.CraftStation)
      .flat()
      .filter(filterUnique)
      .sort(sortByText)
  );

  const value = {
    storesResource,
    recipesResource,
    tagsResource,
    isLoadingResources,
    currentCurrency,
    allCurrencies,
    allProfessions,
    allCraftStations,
    allProductsInStores,
    allCraftableProducts,
    mainState,
    refetch: () => {
      refetchStores();
      refetchRecipes();
      refetchTags();
    },
    get: {
      personalPrice: (productName?: string) =>
        personalPricesState[productName ?? '']?.[currentCurrency()],
      craftAmmount: (productName?: string) =>
        craftAmmoutState[productName ?? ''] ?? 1,
      craftModule: (productName?: string) =>
        craftModuleState[productName ?? ''] ?? 0,
      craftLavish: (productName?: string) =>
        craftLavishState[productName ?? ''],
      craftLevel: (productName?: string) =>
        craftLevelState[productName ?? ''] ?? 0,
      recipeMargin: (recipeKey?: string) =>
        recipeMarginState[recipeKey ?? ''] ?? 0,
      costPercentage: (variantKey?: string) =>
        CostPercentagesState[variantKey ?? ''],
    },
    update: {
      currency: (newCurrency: string) => setState({ currency: newCurrency }),
      userName: (username: string) => {
        // If no currency is selected, select the user's currency
        if (
          currentCurrency().length == 0 ||
          allCurrencies()?.filter((t) => t === currentCurrency()).length === 0
        ) {
          const userPersonalCurrency = allCurrencies()?.find(
            (t) => t.indexOf(username) === 1
          );
          if (userPersonalCurrency) {
            setState({ currency: userPersonalCurrency });
          }
        }
        setState({ userName: username });
      },
      personalPrice: (product: string, currency: string, newPrice: number) =>
        setPersonalPricesState((prev) => ({
          [product]: {
            ...(prev[product] ?? {}),
            [currency]: newPrice,
          },
        })),
      craftAmmount: (product: string, ammount: number) =>
        setCraftAmmoutState({ [product]: ammount }),
      craftModule: (product: string, module: number) =>
        setCraftModuleState({ [product]: module }),
      craftLavish: (product: string, lavishEnabled: boolean) =>
        setCraftLavishState({ [product]: lavishEnabled }),
      craftLevel: (product: string, level: number) =>
        setCraftLevelState({ [product]: level }),
      recipeMargin: (recipeKey: string, margin: number) =>
        setRecipeMarginState({ [recipeKey]: margin }),
      costPercentage: (
        variantKey: string,
        percentages: {
          prod: string;
          perc: number;
        }[]
      ) =>
        setCostPercentagesState((prev) => ({
          ...prev,
          [variantKey]: percentages,
        })),
      calorieCost: (cost: number) => setState({ calorieCost: cost }),
    },
  } as MainContextType;

  return (
    <MainContext.Provider value={value}>{props.children}</MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
