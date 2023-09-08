import Table, {
  TableHeader,
  TableHeaderCol,
  TableBody,
} from '../../components/Table';
import { Accessor, For } from 'solid-js';
import Tooltip from '../../components/Tooltip';
import Button from '../../components/Button';
import { SortableColumnsStoresTable } from './createMarketStore';
import TableRowLoadingSpinner from '../../components/TableRowLoadingSpinner';

type Props = {
  stores: Accessor<Stores[]>;
  isLoadingResource: Accessor<boolean>;
  setSearch: (search: string) => void;
  setCurrencyFilter: (currency: string) => void;
  setShowStoreModal: (storeName: string) => void;
  currentSort: { column: SortableColumnsStoresTable; directionDesc: boolean };
  toggleSortColumn: (column: SortableColumnsStoresTable) => void;
};
export default (props: Props) => (
  <Table>
    <TableHeader>
      <TableHeaderCol
        onSort={() => props.toggleSortColumn(SortableColumnsStoresTable.STORE)}
        directionDesc={
          props.currentSort.column === SortableColumnsStoresTable.STORE
            ? props.currentSort.directionDesc
            : undefined
        }
      >
        Store Name
      </TableHeaderCol>
      <TableHeaderCol>Store Owner</TableHeaderCol>
      <TableHeaderCol>Currency</TableHeaderCol>
      <TableHeaderCol
        onSort={() =>
          props.toggleSortColumn(SortableColumnsStoresTable.BALANCE)
        }
        directionDesc={
          props.currentSort.column === SortableColumnsStoresTable.BALANCE
            ? props.currentSort.directionDesc
            : undefined
        }
      >
        Balance
      </TableHeaderCol>
      <TableHeaderCol
        onSort={() => props.toggleSortColumn(SortableColumnsStoresTable.OFFERS)}
        directionDesc={
          props.currentSort.column === SortableColumnsStoresTable.OFFERS
            ? props.currentSort.directionDesc
            : undefined
        }
      >
        Offers
      </TableHeaderCol>
    </TableHeader>
    <TableBody>
      <TableRowLoadingSpinner show={props.isLoadingResource} />
      <For each={props.stores()}>
        {(store) => (
          <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Tooltip noStyle text="Click to show store orders">
                <Button onClick={() => props.setShowStoreModal(store.Name)}>
                  {store.Name}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Tooltip noStyle text="Click to filter by store owner">
                <Button onClick={() => props.setSearch(store.Owner)}>
                  {store.Owner}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <Tooltip noStyle text="Click to select this currency">
                <Button
                  onClick={() => props.setCurrencyFilter(store.CurrencyName)}
                >
                  {store.CurrencyName}
                </Button>
              </Tooltip>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">{store.Balance}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              {store.AllOffers.length}
            </td>
          </tr>
        )}
      </For>
    </TableBody>
  </Table>
);
