import SearchInput from '../../components/SearchInput';
import createMarketStore from './createMarketStore';
import StoresTable from './StoresTable';
import RadioToggle from '../../components/RadioToggle';
import { Show } from 'solid-js';
import ProductsTable from './ProductsTable';
import Pagination from '../../components/Pagination';
import PageSize from '../../components/PageSize';
import Tooltip from '../../components/Tooltip';
import Checkbox from '../../components/Checkbox';
import Button from '../../components/Button';
import { OrderTypes } from '../../utils/constants';
import StoreModal from '../../components/StoreModal';

export default () => {
  const {
    state,
    stores,
    setSearch,
    setCurrencyFilter,
    toggleTableType,
    setOrderType,
    products,
    storesTotalPages,
    productsTotalPages,
    setStoresPage,
    setProductsPage,
    setFilterByOwner,
    setShowStoreModal,
    setPageSize,
    toggleSortStoresTable,
    toggleSortProductTable,
    clearFilters,
  } = createMarketStore();

  return (
    <div>
      <div class="flex justify-between">
        <div>
          <Tooltip
            text="click to filter by stores owned by you (set your name in the header above)"
            origin="NW"
            direction="NE"
          >
            <Checkbox
              label="Only show my store's"
              checked={state.filterByOwner}
              onChange={(checked) => setFilterByOwner(checked)}
            />
          </Tooltip>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <SearchInput value={state.search} onChange={setSearch} />
          <RadioToggle
            options={[
              { text: 'Stores', value: 'Stores' },
              { text: 'Products', value: 'Products' },
            ]}
            onChange={() => toggleTableType()}
            selected={state.isStoresTable ? 'Stores' : 'Products'}
          />
          <Show when={!state.isStoresTable}>
            <RadioToggle
              options={[
                { text: 'Buy', value: OrderTypes.BUY },
                { text: 'Sell', value: OrderTypes.SELL },
                { text: 'Both', value: OrderTypes.BOTH },
              ]}
              onChange={(value) => setOrderType(Number(value))}
              selected={state.filterOrderType}
            />
          </Show>
          <Button onClick={() => clearFilters()}>Clear filters</Button>
          <PageSize pageSize={state.pageSize} onChange={setPageSize} />
        </div>
      </div>
      <Show when={state.isStoresTable}>
        <StoresTable
          stores={stores}
          setSearch={setSearch}
          setCurrencyFilter={setCurrencyFilter}
          setShowStoreModal={setShowStoreModal}
          currentSort={state.sortingStores}
          toggleSortColumn={toggleSortStoresTable}
        />
        <Pagination
          currentPage={state.storesPage}
          totalPages={storesTotalPages()}
          onChange={setStoresPage}
        />
      </Show>
      <Show when={!state.isStoresTable}>
        <ProductsTable
          products={products}
          setSearch={setSearch}
          setCurrencyFilter={setCurrencyFilter}
          setShowStoreModal={setShowStoreModal}
          currentSort={state.sortingProducts}
          toggleSortColumn={toggleSortProductTable}
        />
        <Pagination
          currentPage={state.productsPage}
          totalPages={productsTotalPages()}
          onChange={setProductsPage}
        />
      </Show>

      <StoreModal
        storeName={state.showStoreModal}
        hideModal={() => setShowStoreModal(undefined)}
      />
    </div>
  );
};
