import { For } from 'solid-js';
import Button from '../../../../components/Button';
import NumericInput from '../../../../components/NumericInput';
import PersonalPrice from '../../../../components/PersonalPrice';
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from '../../../../components/Table';
import Tooltip from '../../../../components/Tooltip';
import { useMainContext } from '../../../../hooks/MainContext';
import {fixPercentages, getIngredientId, getItemId} from '../../../../utils/helpers';
import { useCalcContext } from '../../context/CalcContext';
import SyncPersonalPrice from "../../../../components/SyncPersonalPrice/SyncPersonalPrice";

export default () => {
  const { currentCurrency, update } = useMainContext();
  const { priceCalcStore } = useCalcContext();

  return (
    <Table>
      <TableHeader>
        <TableHeaderCol>Product name</TableHeaderCol>
        <TableHeaderCol>Amount</TableHeaderCol>
        <TableHeaderCol>Cost Percentage</TableHeaderCol>
        <TableHeaderCol>Production cost</TableHeaderCol>
        <TableHeaderCol>Retail price</TableHeaderCol>
        <TableHeaderCol>Personal price</TableHeaderCol>
      </TableHeader>
      <TableBody>
        <For each={priceCalcStore.recipeProducts()}>
          {(product) => (
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <Tooltip
                  noStyle
                  text="Click to copy this fancy math to clipboard"
                >
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        priceCalcStore.calcExplanation(
                          product.Name,
                          currentCurrency()
                        )
                      )
                    }
                  >
                    {product.Name}
                  </Button>
                </Tooltip>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {product.Ammount}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <NumericInput
                  value={product.costPercentage}
                  onChange={(newValue) =>
                    update.costPercentage(
                      priceCalcStore.variantId(),
                      fixPercentages(
                        priceCalcStore.costPercentages(),
                        product.Name,
                        newValue
                      )
                    )
                  }
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <Tooltip noStyle text="Click to set your personal price">
                  <Button
                    onClick={() =>
                      update.personalPrice(
                        getItemId(product.Name),
                        currentCurrency(),
                        product.productionCost
                      )
                    }
                  >
                    {`${product.productionCost} ${currentCurrency()}`}
                  </Button>
                </Tooltip>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <Tooltip noStyle text="Click to set your personal price">
                  <Button
                    class="px-2 py-1"
                    onClick={() =>
                      update.personalPrice(
                        getItemId(product.Name),
                        currentCurrency(),
                        product.retailPrice
                      )
                    }
                  >
                    {`${product.retailPrice} ${currentCurrency()}`}
                  </Button>
                </Tooltip>
              </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-row gap-2">
                        <PersonalPrice personalPriceId={getItemId(product.Name)}/>
                        <SyncPersonalPrice personalPriceId={getItemId(product.Name)}/>
                    </div>
                </td>
            </tr>
          )}
        </For>
      </TableBody>
    </Table>
  );
};
