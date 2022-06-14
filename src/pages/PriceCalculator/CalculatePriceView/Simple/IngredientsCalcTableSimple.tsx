import { For } from 'solid-js';
import AveragePrice from '../../../../components/AveragePrice';
import NumericInput from '../../../../components/NumericInput';
import PersonalPrice from '../../../../components/PersonalPrice';
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from '../../../../components/Table';
import { useMainContext } from '../../../../hooks/MainContext';
import {
  formatNumber,
  getIngredientDisplayName,
  getIngredientId,
} from '../../../../utils/helpers';
import { useCalcContext } from '../../context/CalcContext';
import IngredientsCalcName from '../IngredientsCalcName';

export default () => {
  const { priceCalcStore, listProductsStore } = useCalcContext();
  const cellClass = 'px-6 py-4 whitespace-nowrap text-sm text-gray-500';
  return (
    <Table>
      <TableHeader>
        <TableHeaderCol>Ingredient name</TableHeaderCol>
        <TableHeaderCol>Quantity</TableHeaderCol>
        <TableHeaderCol>Price</TableHeaderCol>
        <TableHeaderCol>Cost</TableHeaderCol>
      </TableHeader>
      <TableBody>
        <For each={priceCalcStore.recipeIngredients()}>
          {(ingredient) => (
            <tr>
              <td class={cellClass}>{getIngredientDisplayName(ingredient)}</td>
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
              <td class={cellClass}>{formatNumber(ingredient.unitPrice)}</td>
            </tr>
          )}
        </For>
      </TableBody>
    </Table>
  );
};
