import { createEffect, createMemo, createSignal, For } from 'solid-js';
import { useMainContext } from '../../hooks/MainContext';
import {
  calcTotalPages,
  filterByIncludesAny,
  paginateArray,
} from '../../utils/helpers';
import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from '../../components/Table';
import Modal from '../Modal';
import ModalHeader from '../Modal/ModalHeader';
import Pagination from '../Pagination';
import Tooltip from '../Tooltip';
import { useCalcContext } from '../../pages/PriceCalculator/context/CalcContext';
import Button from '../Button';
import Checkbox from '../Checkbox';
import { SpecificTagName } from '../../utils/constants';
const pageSize = 10;

export default () => {
  const {
    listProductsStore: {
      state,
      update: { hidePricesForFuelModal },
    },
  } = useCalcContext();

  const { allProductsInStores, currentCurrency, get, update, tagsResource } =
    useMainContext();
  const [currentPage, setCurrentPage] = createSignal(1);
  const [offersInCurrency, setOffersInCurrency] = createSignal(false);
  const [onlyBuyable, setOnlyBuyable] = createSignal(true);
  const products = createMemo(() =>
    get.itemsInTag(SpecificTagName.BurnableFuel)
  );
  const productNames = createMemo(() => products().map((t) => t.Name));

  const hasOffersInCurrency = createMemo(
    () =>
      allProductsInStores()?.some(
        (product) =>
          filterByIncludesAny(productNames(), [product.ItemName]) &&
          product.CurrencyName === currentCurrency()
      ) ?? false
  );
  createEffect(() => setOffersInCurrency(hasOffersInCurrency()));
  const filteredProducts = createMemo(() =>
    allProductsInStores()
      ?.filter(
        (product) =>
          filterByIncludesAny(productNames(), [product.ItemName]) &&
          (!currentCurrency() ||
            !offersInCurrency() ||
            product.CurrencyName === currentCurrency()) &&
          (!onlyBuyable() || (!product.Buying && product.Quantity > 0))
      )
      .map((product) => {
        const joules =
          (products().find((t) => t.Name === product.ItemName)?.Fuel ?? 0) * 2;
        return {
          ...product,
          Joules: joules,
          PricePer1kJ: (product.Price / joules) * 1000,
        };
      })
      .sort((a, b) => {
        if (a.Buying === b.Buying) {
          return a.PricePer1kJ - b.PricePer1kJ;
        }
        return !a.Buying ? -1 : 1;
      })
  );
  const paginatedProducts = createMemo(() =>
    paginateArray(currentPage(), pageSize, filteredProducts())
  );
  const totalPages = createMemo(() =>
    calcTotalPages(pageSize, filteredProducts())
  );
  return (
    <>
      {state.showPricesForFuelModal && (
        <Modal onClose={hidePricesForFuelModal}>
          <div class="sm:flex sm:items-start">
            <div class="flex-grow mt-3 text-center sm:mt-0 sm:text-left">
              <ModalHeader>Ingame prices for burnable fuel</ModalHeader>
              <div class="mt-1 flex">
                <Checkbox
                  label="Show only buyable products"
                  checked={onlyBuyable()}
                  onChange={(checked) => setOnlyBuyable(checked)}
                />
                <Checkbox
                  label="Show only offers in selected currency"
                  checked={offersInCurrency()}
                  onChange={(checked) => setOffersInCurrency(checked)}
                />
              </div>
              <div class="mt-4 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableHeaderCol>Product Name</TableHeaderCol>
                    <TableHeaderCol>Store Name</TableHeaderCol>
                    <TableHeaderCol>Store Owner</TableHeaderCol>
                    <TableHeaderCol>Quantity</TableHeaderCol>
                    <TableHeaderCol>Price</TableHeaderCol>
                    <TableHeaderCol>Joules</TableHeaderCol>
                    <TableHeaderCol>1k Joule price</TableHeaderCol>
                  </TableHeader>
                  <TableBody>
                    <For each={paginatedProducts()}>
                      {(product) => (
                        <tr>
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                            {product.ItemName}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                            {product.StoreName}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                            {product.StoreOwner}
                          </td>

                          <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
                            {product.Buying
                              ? `Buying ${product.Limit} for`
                              : `Selling ${product.MaxNumWanted} for`}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                            {product.Price}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                            {product.Joules} J
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm">
                            <Tooltip
                              noStyle
                              text="Click to set your personal fuel price"
                            >
                              <Button
                                onClick={() => {
                                  update.costPer1kJoule(product.PricePer1kJ);
                                }}
                              >
                                {`${product.PricePer1kJ} ${product.CurrencyName}`}
                              </Button>
                            </Tooltip>
                          </td>
                        </tr>
                      )}
                    </For>
                  </TableBody>
                </Table>
                <Pagination
                  currentPage={currentPage()}
                  totalPages={totalPages()}
                  onChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
