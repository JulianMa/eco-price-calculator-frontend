import { createEffect, createMemo } from 'solid-js';
import { OrderTypes } from '../../utils/constants';
import createDebounce from '../../hooks/createDebounce';
import { useMainContext } from '../../hooks/MainContext';
import { createLocalStore } from '../../utils/createLocalStore';
import { filterByText, sortByText } from '../../utils/helpers';

export enum SortableColumnsProductsTable {
  PRODUCT,
  STORE,
  QUANTITY,
  PRICE,
}
export enum SortableColumnsStoresTable {
  STORE,
  BALANCE,
  OFFERS,
}
type Store = {
  search: string;
  isStoresTable: boolean;
  filterOrderType: OrderTypes;
  storesPage: number;
  productsPage: number;
  filterByOwner: boolean;
  showStoreModal: string | undefined;
  sortingProducts: {
    column: SortableColumnsProductsTable;
    directionDesc: boolean;
  };
  sortingStores: {
    column: SortableColumnsStoresTable;
    directionDesc: boolean;
  };
  pageSize: number;
};

const sortByStoresColumn = (
  a: Stores,
  b: Stores,
  column: SortableColumnsStoresTable,
  directionDesc: boolean
) => {
  const direction = directionDesc ? -1 : 1;
  switch (column) {
    case SortableColumnsStoresTable.BALANCE:
      return (a.Balance - b.Balance) * direction;
    case SortableColumnsStoresTable.OFFERS:
      return (a.AllOffers.length - b.AllOffers.length) * direction;
    default:
      return sortByText(a.Name, b.Name) * direction;
  }
};
const sortByProductsColumn = (
  a: ProductOffer,
  b: ProductOffer,
  column: SortableColumnsProductsTable,
  directionDesc: boolean
) => {
  const direction = directionDesc ? -1 : 1;
  switch (column) {
    case SortableColumnsProductsTable.STORE:
      return sortByText(a.StoreName, b.StoreName) * direction;
    case SortableColumnsProductsTable.QUANTITY:
      return (a.Quantity - b.Quantity) * direction;
    case SortableColumnsProductsTable.PRICE:
      return (a.Price - b.Price) * direction;
    default:
      return sortByText(a.ItemName, b.ItemName) * direction;
  }
};

export default () => {
  const { storesResource, allProductsInStores, isLoadingResources, mainState, update, currentCurrency } =
    useMainContext();
  const [state, setState] = createLocalStore<Store>(
    {
      search: '',
      isStoresTable: true,
      filterOrderType: OrderTypes.BOTH,
      storesPage: 1,
      productsPage: 1,
      filterByOwner: false,
      showStoreModal: undefined,
      sortingProducts: {
        column: SortableColumnsProductsTable.PRODUCT,
        directionDesc: false,
      },
      sortingStores: {
        column: SortableColumnsStoresTable.STORE,
        directionDesc: false,
      },
      pageSize: 100,
    },
    'MarketStore'
  );

  const stores = createMemo(
    () =>
      storesResource?.()
        ?.Stores?.filter(
          (store) =>
            (filterByText(state.search, store.Name ?? '') ||
              filterByText(state.search, store.Owner ?? '')) &&
            filterByText(currentCurrency(), store.CurrencyName ?? '') &&
            (!state.filterByOwner ||
              mainState.userName.length === 0 ||
              filterByText(mainState.userName, store.Owner ?? ''))
        )
        .sort((a, b) =>
          sortByStoresColumn(
            a,
            b,
            state.sortingStores.column,
            state.sortingStores.directionDesc
          )
        )
        .slice(
          (state.storesPage - 1) * state.pageSize,
          state.storesPage * state.pageSize
        ) as Stores[]
  );
  const storesTotalPages = createMemo(() =>
    Math.ceil((storesResource?.()?.Stores?.length ?? 0) / state.pageSize)
  );

  const filteredProducts = createMemo(() =>
    (allProductsInStores() ?? []).filter(
      (product) =>
        (filterByText(state.search, product.ItemName ?? '') ||
          filterByText(state.search, product.StoreName ?? '') ||
          filterByText(state.search, product.StoreOwner ?? '')) &&
        filterByText(currentCurrency(), product.CurrencyName ?? '') &&
        (!state.filterByOwner ||
          mainState.userName.length === 0 ||
          filterByText(mainState.userName, product.StoreOwner ?? '')) &&
        (state.filterOrderType === OrderTypes.BOTH ||
          (state.filterOrderType === OrderTypes.BUY && product.Buying) ||
          (state.filterOrderType === OrderTypes.SELL && !product.Buying))
    )
  );
  const productsTotalPages = createMemo(() =>
    Math.ceil((filteredProducts()?.length ?? 0) / state.pageSize)
  );
  const products = createMemo(() =>
    filteredProducts()
      .sort((a, b) =>
        sortByProductsColumn(
          a,
          b,
          state.sortingProducts.column,
          state.sortingProducts.directionDesc
        )
      )
      .slice(
        (state.productsPage - 1) * state.pageSize,
        state.productsPage * state.pageSize
      )
  );
  const [setSearch] = createDebounce(
    (newValue: string) =>
      setState({ search: newValue, storesPage: 1, productsPage: 1 }),
    200
  );
  createEffect(() => {
    // We want to updated state when currency changes
    // TODO: is there a better way to do this?
    mainState.currency;
    setState({ storesPage: 1, productsPage: 1 });
  });
  return {
    state,
    stores,
    isLoadingResources,
    setSearch,
    setCurrencyFilter: (newValue: string) => update.currency(newValue),
    toggleTableType: () =>
      setState((prev) => ({ isStoresTable: !prev.isStoresTable })),
    setOrderType: (newType: OrderTypes) =>
      setState({ filterOrderType: newType }),
    setStoresPage: (pageNum: number) => setState({ storesPage: pageNum }),
    setPageSize: (newPageSize: number) => setState({ pageSize: newPageSize }),
    setProductsPage: (pageNum: number) => setState({ productsPage: pageNum }),
    setFilterByOwner: (filterByOwner: boolean) =>
      setState({ filterByOwner: filterByOwner }),
    setShowStoreModal: (storeName: string | undefined) =>
      setState({ showStoreModal: storeName }),
    toggleSortStoresTable: (column: SortableColumnsStoresTable) => {
      setState((prev) => ({
        sortingStores: {
          column,
          directionDesc:
            prev.sortingStores.column !== column
              ? false
              : !prev.sortingStores.directionDesc,
        },
      }));
    },
    toggleSortProductTable: (column: SortableColumnsProductsTable) => {
      setState((prev) => ({
        sortingProducts: {
          column,
          directionDesc:
            prev.sortingProducts.column !== column
              ? false
              : !prev.sortingProducts.directionDesc,
        },
      }));
    },
    products,
    storesTotalPages,
    productsTotalPages,
    clearFilters: () =>
      setState({
        search: '',
        storesPage: 1,
        productsPage: 1,
        filterByOwner: false,
      }),
  };
};
