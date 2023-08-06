import {
  Accessor,
  createMemo,
  JSXElement,
  createContext,
  useContext,
  createResource,
  Resource,
} from 'solid-js';
import { produce, Store } from 'solid-js/store';
import { createLocalStore } from '../../utils/createLocalStore';
import {
  filterUnique,
  getItemId,
  getOffersAndCalculateAvgPrice,
  getTagId,
  sortByText,
  sortByTextExcludingWord,
} from '../../utils/helpers';
import {
  getServers,
  getRecipes,
  getStores,
  getTags,
  getAllItems,
  getCraftingTables,
  testServerOnline,
} from '../../utils/restDbSdk';

type MainContextType = {
  serversResource: Resource<ServersResponse[] | undefined> | undefined;
  onlineServersResource: Resource<OnlineServers[] | undefined> | undefined;
  storesResource: Resource<StoresResponse | undefined> | undefined;
  recipesResource: Resource<RecipesResponse | undefined> | undefined;
  tagsResource: Resource<TagsResponse | undefined> | undefined;
  craftingTablesResource:
    | Resource<CraftingTablesResponse | undefined>
    | undefined;
  currentServer: Accessor<string>;
  isLoadingResources: Accessor<boolean>;
  dbs: Accessor<DB[] | undefined>;
  currentCurrency: Accessor<string>;
  allCurrencies: Accessor<string[] | undefined>;
  allProfessions: Accessor<string[] | undefined>;
  allCraftingTables: Accessor<string[] | undefined>;
  allProductsInStores: Accessor<ProductOffer[] | undefined>;
  allCraftableProducts: Accessor<{ [key: string]: CraftableProduct }>;
  allCraftableProductsWithOffers: Accessor<
    CraftableProductWithOffers[] | undefined
  >;
  allItemsAndTagsWithPrice: Accessor<{ [key: string]: ItemOrTagPrice }>;
  allTablesPerUser: Accessor<{ [key: string]: CraftingTable[] }>;
  mainState: Store<MainStore>;
  forceRefetch: {
    servers: () => void;
    stores: () => void;
    recipes: () => void;
    tags: () => void;
    allItems: () => void;
    craftingTables: () => void;
  };
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
    itemsInTag: (tagName: string) => {
      Name: string;
      Tags: string[];
      Fuel: number;
    }[];
  };
  getState: {
    personalPrice: Store<PersonalPricesStore>;
  };
  update: {
    server: (newServer: string) => void;
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
    costPer1kJoule: (cost: number) => void;
  };
  clear: {
    personalPriceCurrency: (product: string, currency: string) => void;
    personalPriceProduct: (product: string) => void;
    personalCurrency: (currency: string) => void;
  };
};

const MainContext = createContext<MainContextType>({
  serversResource: undefined,
  onlineServersResource: undefined,
  storesResource: undefined,
  recipesResource: undefined,
  tagsResource: undefined,
  craftingTablesResource: undefined,
  currentServer: () => '',
  isLoadingResources: () => true,
  dbs: () => [],
  currentCurrency: () => '',
  allCurrencies: () => [],
  allProfessions: () => [],
  allCraftingTables: () => [],
  allProductsInStores: () => [],
  allCraftableProducts: () => ({}),
  allCraftableProductsWithOffers: () => [],
  allItemsAndTagsWithPrice: () => ({}),
  allTablesPerUser: () => ({}),
  mainState: {
    server: '',
    currency: '',
    userName: '',
    calorieCost: 0,
    costPer1kJoule: 0,
  },
  forceRefetch: {
    servers: () => undefined,
    stores: () => undefined,
    recipes: () => undefined,
    tags: () => undefined,
    allItems: () => undefined,
    craftingTables: () => undefined,
  },
  get: {
    personalPrice: (productName?: string) => 0,
    craftAmmount: (productName?: string) => 1,
    craftModule: (productName?: string) => 0,
    craftLavish: (productName?: string) => true,
    calorieCostPerRecipe: (productName?: string) => 0,
    recipeMargin: (recipeKey?: string) => 0,
    costPercentage: (variantKey?: string) => [],
    craftLevel: (productName?: string) => 0,
    itemsInTag: (tagName: string) => [],
  },
  getState: {
    personalPrice: {},
  },
  update: {
    server: () => undefined,
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
    costPer1kJoule: (cost: number) => undefined,
  },
  clear: {
    personalPriceCurrency: (product: string, currency: string) => undefined,
    personalPriceProduct: (product: string) => undefined,
    personalCurrency: (currency: string) => undefined,
  },
});
type Props = {
  children: JSXElement;
};
type MainStore = {
  server: string;
  currency: string;
  userName: string;
  calorieCost: number;
  costPer1kJoule: number;
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
      server: 'local',
      currency: '',
      userName: '',
      calorieCost: 0,
      costPer1kJoule: 0,
    },
    'MainStore'
  );
  const [serversResource, { refetch: refetchServers }] =
    createResource(getServers);

  const [onlineServersResource] = createResource(
    serversResource,
    async (servers) => {
      // const serverTags = servers?.map(server => ({...server, tags: getTags(server.name)}))
      if (servers == undefined) {
        return undefined;
      }
      return await Promise.all(
        servers?.map((server) => testServerOnline(server.key, server.name))
      );
    }
  );

  const currentServer = createMemo<string>(() => {
    // If there's a server config, then always pick that server
    if (!!import.meta.env.VITE_SERVER && import.meta.env.VITE_SERVER !== true) {
      return import.meta.env.VITE_SERVER;
    }
    // If there's a valid server selected, use that one
    if (
      (serversResource?.() ?? [])?.map((t) => t.key).includes(mainState.server)
    ) {
      return mainState.server;
    }

    // Return the first valid one
    return onlineServersResource?.()?.length ?? 0 > 0
      ? onlineServersResource()?.[0].key ?? ''
      : mainState.server;
  });

  const [storesResource, { refetch: refetchStores }] = createResource(
    currentServer,
    getStores
  );
  const [recipesResource, { refetch: refetchRecipes }] = createResource(
    currentServer,
    getRecipes
  );
  const [tagsResource, { refetch: refetchTags }] = createResource(
    currentServer,
    getTags
  );
  const [allItemsResource, { refetch: refetchAllItems }] = createResource(
    currentServer,
    getAllItems
  );
  const [craftingTablesResource, { refetch: refetchCraftingTables }] =
    createResource(currentServer, getCraftingTables);

  const allTags = createMemo(() =>
    Object.entries(allItemsResource()?.AllItems ?? {}).reduce((tags, item) => {
      item[1]?.Tags?.forEach((tagName) => {
        tags[tagName] = [...(tags?.[tagName] ?? []), item[0]];
      });

      return tags;
    }, {} as Record<string, string[]>)
  );

  const isLoadingResources = createMemo(
    () =>
      !storesResource() ||
      !recipesResource() ||
      !tagsResource() ||
      !craftingTablesResource()
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

  const allCraftableProducts = createMemo(
    () =>
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
        ) ?? {}
  );

  const allCraftableProductsWithOffers = createMemo(() => {
    return Object.values(allCraftableProducts())
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

  const allCraftingTables = createMemo(() =>
    recipesResource()
      ?.Recipes?.map((recipe) => recipe.CraftingTable)
      .filter(filterUnique)
      .sort(sortByText)
  );

  // List of all available items and their recipes
  const allItemsWithRecipes = createMemo(() =>
    Object.keys(allItemsResource()?.AllItems ?? {}).reduce((agg, itemName) => {
      if (agg[itemName] === undefined) {
        agg[itemName] = {
          Name: itemName,
          RecipeVariants:
            allCraftableProducts()[itemName]?.RecipeVariants ?? [],
        };
      }

      return agg;
    }, {} as { [key: string]: ItemWithRecipe })
  );

  const allItemsWithPrice = createMemo(() =>
    Object.entries(allItemsWithRecipes()).reduce((agg, [itemName, item]) => {
      agg[getItemId(itemName)] = {
        Name: item.Name,
        IsSpecificItem: true,
        ...getOffersAndCalculateAvgPrice(
          allProductsInStores(),
          currentCurrency(),
          [item.Name]
        ),
      };
      return agg;
    }, {} as { [key: string]: ItemOrTagPrice })
  );

  const allTagsWithPrice = createMemo(() =>
    Object.entries(allTags()).reduce((agg, [tag, products]) => {
      agg[getTagId(tag)] = {
        Name: tag,
        IsSpecificItem: false,
        ...getOffersAndCalculateAvgPrice(
          allProductsInStores(),
          currentCurrency(),
          products
        ),
      };
      return agg;
    }, {} as { [key: string]: ItemOrTagPrice })
  );

  const allItemsAndTagsWithPrice = createMemo(() => ({
    ...allItemsWithPrice(),
    ...allTagsWithPrice(),
  }));

  const allTablesPerUser = createMemo(() =>
    craftingTablesResource()?.CraftingTables?.reduce((agg, table) => {
      agg[table.OwnerName] = [...(agg[table.OwnerName] ?? []), table];
      return agg;
    }, {} as { [key: string]: CraftingTable[] })
  );

  const value = {
    serversResource,
    onlineServersResource,
    storesResource,
    recipesResource,
    tagsResource,
    craftingTablesResource,
    currentServer,
    isLoadingResources,
    currentCurrency,
    allCurrencies,
    allProfessions,
    allCraftingTables,
    allProductsInStores,
    allCraftableProducts,
    allCraftableProductsWithOffers,
    allItemsAndTagsWithPrice,
    allTablesPerUser,
    mainState,
    forceRefetch: {
      servers: refetchServers,
      stores: refetchStores,
      recipes: refetchRecipes,
      tags: refetchTags,
      allItems: refetchAllItems,
      craftingTables: refetchCraftingTables,
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
      itemsInTag: (tagName: string) =>
        allTags()?.[tagName]?.map((itemName) => ({
          Name: itemName,
          ...allItemsResource()?.AllItems[itemName],
        })) ?? [],
    },
    getState: {
      personalPrice: personalPricesState,
    },
    update: {
      server: (newServer: string) => setState({ server: newServer }),
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
      costPer1kJoule: (cost: number) => setState({ costPer1kJoule: cost }),
    },
    clear: {
      personalPriceCurrency: (product: string, currency: string) =>
        setPersonalPricesState(
          produce<PersonalPricesStore>((s) => {
            // Delete currency in product
            delete s[product][currency];

            // Delete product when there is no other currency price on it
            if (Object.keys(s[product]).length === 0) {
              delete s[product];
            }
          })
        ),
      personalPriceProduct: (product: string) =>
        setPersonalPricesState(product, () => undefined),
      personalCurrency: (currency: string) =>
        setPersonalPricesState(
          produce<PersonalPricesStore>((s) => {
            Object.entries(s).forEach(([productId, value]) => {
              // Delete currency in product
              delete value[currency];

              // Delete product when there is no price set for it
              if (Object.keys(value).length === 0) {
                delete s[productId];
              }
            });
          })
        ),
    },
  } as MainContextType;

  return (
    <MainContext.Provider value={value}>{props.children}</MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
