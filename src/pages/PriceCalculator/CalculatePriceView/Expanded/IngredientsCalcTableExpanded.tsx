import { For } from 'solid-js';
import AveragePrice from '../../../../components/AveragePrice';
import NumericInput from '../../../../components/NumericInput';
import PersonalPrice from '../../../../components/PersonalPrice';
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from '../../../../components/Table';
import Tooltip from '../../../../components/Tooltip';
import { useMainContext } from '../../../../hooks/MainContext';
import { formatNumber, getIngredientId } from '../../../../utils/helpers';
import { useCalcContext } from '../../context/CalcContext';
import IngredientsCalcName from '../IngredientsCalcName';

export default () => {
  const { mainState, get, update } = useMainContext();
  const { priceCalcStore, listProductsStore } = useCalcContext();
  const cellClass = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
  return (
    <Table>
      <TableHeader>
        <TableHeaderCol>Ingredient name</TableHeaderCol>
        <TableHeaderCol>Quantity</TableHeaderCol>
        <TableHeaderCol>Average price</TableHeaderCol>
        <TableHeaderCol>Personal price</TableHeaderCol>
        <TableHeaderCol>Unit price</TableHeaderCol>
        <TableHeaderCol>Total price</TableHeaderCol>
      </TableHeader>
      <TableBody>
        <For each={priceCalcStore.recipeIngredients()}>
          {(ingredient) => (
            <tr>
              <td class={cellClass}>
                <IngredientsCalcName ingredient={ingredient} />
              </td>
              <td class={cellClass}>{ingredient.calcQuantity}</td>
              <td class={cellClass}>
                <AveragePrice
                  id={getIngredientId(ingredient)}
                  name={
                    ingredient.IsSpecificItem ? ingredient.Name : ingredient.Tag
                  }
                  isSpecificItem={ingredient.IsSpecificItem}
                  showPricesForProductsModal={
                    listProductsStore.update.showPricesForProductsModal
                  }
                />
              </td>
              <td class={cellClass}>
                <PersonalPrice personalPriceId={getIngredientId(ingredient)} />
              </td>
              <td class={cellClass}>{formatNumber(ingredient.unitPrice)}</td>
              <td class={cellClass}>{formatNumber(ingredient.calcPrice)}</td>
            </tr>
          )}
        </For>
        <tr>
          <td class={cellClass}>Labor</td>
          <td class={cellClass}>
            <div>
              {(priceCalcStore.recipe()?.BaseLaborCost ?? 0) *
                priceCalcStore.craftAmmount()}
            </div>
            <div>
              (
              {formatNumber(
                (priceCalcStore.recipeCalories() ?? 0) *
                  priceCalcStore.craftAmmount()
              )}{' '}
              Calories)
            </div>
          </td>
          <td class={cellClass}></td>
          <td class={cellClass}>
            <div class="flex flex-row gap-2">
              <NumericInput
                value={formatNumber(mainState.calorieCost)}
                onChange={(val) => update.calorieCost(val)}
              />
              <Tooltip
                noStyle
                text="Labor cost is calculated using price per 1000 calories."
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 inline-block self-center"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </Tooltip>
            </div>
          </td>
          <td class={cellClass}>
            <Tooltip
              noStyle
              text="Labor cost is calculated using price per 1000 calories."
            >
              <span class="pr-1">
                {formatNumber(priceCalcStore.recipeCalorieCost() ?? 0)}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Tooltip>
          </td>
          <td class={cellClass}>
            {formatNumber(priceCalcStore.recipeCalorieTotalCost() ?? 0)}
          </td>
        </tr>
      </TableBody>
    </Table>
  );
};
