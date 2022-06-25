import { For } from 'solid-js';
import AveragePrice from '../../../../components/AveragePrice';
import NumericInput from '../../../../components/NumericInput';
import PersonalPrice from '../../../../components/PersonalPrice';
import { TooltipIcon } from '../../../../components/Svg';
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from '../../../../components/Table';
import Tooltip from '../../../../components/Tooltip';
import { useMainContext } from '../../../../hooks/MainContext';
import {
  filterUnique,
  formatNumber,
  getIngredientId,
  sortByText,
} from '../../../../utils/helpers';
import { useCalcContext } from '../../context/CalcContext';
import IngredientsCalcName from '../IngredientsCalcName';

export default () => {
  const { mainState, get, update, allCraftableProducts } = useMainContext();
  const { priceCalcStore, listProductsStore } = useCalcContext();
  const cellClass = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
  const a = Object.values(allCraftableProducts())
    .flatMap((prod) =>
      prod.RecipeVariants.flatMap((t) => t.Recipe.CraftStation)
    )
    .filter(filterUnique)
    .sort(sortByText);

  console.log(a);
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
              <Tooltip noStyle text="Price per 1000 calories.">
                <TooltipIcon />
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
              <TooltipIcon />
            </Tooltip>
          </td>
          <td class={cellClass}>
            {formatNumber(priceCalcStore.recipeCalorieTotalCost() ?? 0)}
          </td>
        </tr>
        {(priceCalcStore.recipeJoules() ?? 0) > 0 && (
          <tr>
            <td class={cellClass}>Fuel</td>
            <td class={cellClass}>
              <div>
                {(priceCalcStore.recipeCraftTimeInSeconds() ?? 0) *
                  priceCalcStore.craftAmmount()}{' '}
                seconds
              </div>
              <div>
                (
                {formatNumber(
                  (priceCalcStore.recipeJoules() ?? 0) *
                    priceCalcStore.craftAmmount()
                )}{' '}
                Joules)
              </div>
            </td>
            <td class={cellClass}></td>
            <td class={cellClass}>
              <div class="flex flex-row gap-2">
                <NumericInput
                  value={formatNumber(mainState.costPer1kJoule)}
                  onChange={(val) => update.costPer1kJoule(val)}
                />
                <Tooltip noStyle text="Price per 1000 Joules">
                  <TooltipIcon />
                </Tooltip>
              </div>
            </td>
            <td class={cellClass}>{priceCalcStore.recipeFuelCost}</td>
            <td class={cellClass}>{priceCalcStore.recipeFuelTotalCost}</td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
};
