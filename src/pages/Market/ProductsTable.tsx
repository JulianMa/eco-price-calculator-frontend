import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from '../../components/Table';
import { Accessor, For } from 'solid-js';
import Tooltip from '../../components/Tooltip';
import Button from '../../components/Button';
import Highlight from '../../components/Highlight';
import { SortableColumnsProductsTable } from './createMarketStore';
import TableRowLoadingSpinner from '../../components/TableRowLoadingSpinner';

type Props = {
  products: Accessor<ProductOffer[] | undefined>;
  setSearch: (search: string) => void;
  isLoadingResources: Accessor<boolean>;
  setCurrencyFilter: (currency: string) => void;
  setShowStoreModal: (storeName: string) => void;
  currentSort: {
    column: SortableColumnsProductsTable;
    directionDesc: boolean;
  };
  toggleSortColumn: (column: SortableColumnsProductsTable) => void;
};
export default (props: Props) => (
  <Table>
    <TableHeader>
      <TableHeaderCol
        onSort={() =>
          props.toggleSortColumn(SortableColumnsProductsTable.PRODUCT)
        }
        directionDesc={
          props.currentSort.column === SortableColumnsProductsTable.PRODUCT
            ? props.currentSort.directionDesc
            : undefined
        }
      >
        Product Name
      </TableHeaderCol>
      <TableHeaderCol
        onSort={() =>
          props.toggleSortColumn(SortableColumnsProductsTable.STORE)
        }
        directionDesc={
          props.currentSort.column === SortableColumnsProductsTable.STORE
            ? props.currentSort.directionDesc
            : undefined
        }
      >
        Store Name
      </TableHeaderCol>
      <TableHeaderCol>Store Owner</TableHeaderCol>
      <TableHeaderCol
        onSort={() =>
          props.toggleSortColumn(SortableColumnsProductsTable.QUANTITY)
        }
        directionDesc={
          props.currentSort.column === SortableColumnsProductsTable.QUANTITY
            ? props.currentSort.directionDesc
            : undefined
        }
      >
        Quantity
      </TableHeaderCol>
      <TableHeaderCol
        onSort={() =>
          props.toggleSortColumn(SortableColumnsProductsTable.PRICE)
        }
        directionDesc={
          props.currentSort.column === SortableColumnsProductsTable.PRICE
            ? props.currentSort.directionDesc
            : undefined
        }
      >
        Price
      </TableHeaderCol>
    </TableHeader>
    <TableBody>
      <TableRowLoadingSpinner show={props.isLoadingResources} />
      <For each={props.products()}>
        {(product) => (
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Tooltip noStyle text="Click to filter by product name">
                <Button onClick={() => props.setSearch(product.ItemName)}>
                  {product.ItemName}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Tooltip noStyle text="Click to show store orders">
                <Button
                  onClick={() => props.setShowStoreModal(product.StoreName)}
                >
                  {product.StoreName}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Tooltip noStyle text="Click to filter by store owner">
                <Button onClick={() => props.setSearch(product.StoreOwner)}>
                  {product.StoreOwner}
                </Button>
              </Tooltip>
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-right">
              {product.Buying ? (
                <>
                  Buying <Highlight text={`${product.Limit}`} /> for
                </>
              ) : (
                <>
                  Selling <Highlight text={`${product.MaxNumWanted}`} /> for
                </>
              )}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Highlight text={`${product.Price}`} />
              &nbsp;
              {product.CurrencyName}
            </td>
          </tr>
        )}
      </For>
    </TableBody>
  </Table>
);
