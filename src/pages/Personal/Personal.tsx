import { createEffect, createMemo, For } from 'solid-js';
import Table, {
  TableHeader,
  TableHeaderCol,
  TableHeaderColAction,
  TableBody,
} from '../../components/Table';
import * as constants from '../../utils/constants';
import RawDataRow from './PersonalRow';
import { useMainContext } from '../../hooks/MainContext';
import {
  formatNumber,
  getIngredientById,
  getIngredientDisplayName,
  sortByText,
} from '../../utils/helpers';
import NumericInput from '../../components/NumericInput';
import ClearButton from '../../components/ClearButton';
import Tooltip from '../../components/Tooltip';
import Button from '../../components/Button';
import { unwrap } from 'solid-js/store';
export default () => {
  const { getState, update, clear } = useMainContext();

  const currencies = createMemo(() =>
    [
      ...new Set(
        Object.entries(getState.personalPrice).flatMap(([_, value]) =>
          Object.keys(value)
        )
      ),
    ].sort(sortByText)
  );
  createEffect(() => console.log('personal', unwrap(getState.personalPrice)));

  return (
    <Table>
      <TableHeader>
        <TableHeaderCol>Item name</TableHeaderCol>
        <For each={currencies()}>
          {(currency) => (
            <TableHeaderCol>
              <div class="group flex items-center">
                {currency}
                <Tooltip
                  noStyle
                  text="Click to delete all personal prices in this currency"
                >
                  <ClearButton
                    class="opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      clear.personalCurrency(currency);
                    }}
                  />
                </Tooltip>
              </div>
            </TableHeaderCol>
          )}
        </For>
      </TableHeader>
      <TableBody>
        <For
          each={Object.entries(getState.personalPrice).sort((a, b) =>
            sortByText(a[0], b[0])
          )}
        >
          {([productId, valuePerCurrency]) => (
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group flex">
                {getIngredientDisplayName(getIngredientById(productId))}
                <Tooltip
                  noStyle
                  text="Click to delete all personal prices for this item"
                >
                  <ClearButton
                    class="opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      clear.personalPriceProduct(productId);
                    }}
                  />
                </Tooltip>
              </td>
              <For each={currencies()}>
                {(currency) => (
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 group">
                    {valuePerCurrency[currency] === undefined && (
                      <Button
                        class="opacity-0 group-hover:opacity-100"
                        onClick={() =>
                          update.personalPrice(productId, currency, 0)
                        }
                      >
                        Set price
                      </Button>
                    )}

                    {valuePerCurrency[currency] !== undefined && (
                      <div class="flex items-start">
                        <NumericInput
                          value={valuePerCurrency[currency]}
                          onChange={(newValue) =>
                            update.personalPrice(productId, currency, newValue)
                          }
                        />

                        <Tooltip
                          noStyle
                          text="Click to delete this personal price"
                        >
                          <ClearButton
                            class="opacity-0 group-hover:opacity-100"
                            onClick={() => {
                              clear.personalPriceCurrency(productId, currency);
                            }}
                          />
                        </Tooltip>
                      </div>
                    )}
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </TableBody>
    </Table>
  );
};
