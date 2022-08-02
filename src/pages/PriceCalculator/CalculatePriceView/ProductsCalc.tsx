import { For } from 'solid-js';
import Accordion from '../../../components/Accordion/Accordion';
import Button from '../../../components/Button';
import Highlight from '../../../components/Highlight';
import LabeledField from '../../../components/LabeledField';
import NumericInput from '../../../components/NumericInput';
import PersonalPrice from '../../../components/PersonalPrice';
import RadioToggle from '../../../components/RadioToggle';
import Table, {
  TableBody,
  TableHeader,
  TableHeaderCol,
} from '../../../components/Table';
import Tooltip from '../../../components/Tooltip';
import { useMainContext } from '../../../hooks/MainContext';
import { fixPercentages } from '../../../utils/helpers';
import { useCalcContext } from '../context/CalcContext';
import ProductsCalcTableExpanded from './Expanded/ProductsCalcTableExpanded';
import ProductsCalcTableSimple from './Simple/ProductsCalcTableSimple';

const recipeMargins = [0, 5, 10, 15, 20, 25, 30, 40, 50, 75].map((t) => ({
  value: t,
  text: `${t} %`,
}));

export default () => {
  const { mainState, update } = useMainContext();
  const { priceCalcStore } = useCalcContext();
  return (
    <Accordion
      notCollapsible
      startsOpen
      class="mt-6"
      headerText={
        <span>
          <span class="font-medium">Products</span>: Distribute recipe costs
          between resulting products
        </span>
      }
    >
      {priceCalcStore.selectedVariant() && (
        <>
          {!priceCalcStore.state.simpleMode && (
            <div class="flex gap-5 flex-wrap">
              <LabeledField vertical text="Recipe margin:">
                <RadioToggle
                  options={recipeMargins}
                  onChange={(selected: string | number) =>
                    update.recipeMargin(
                      priceCalcStore.variantId(),
                      Number(selected)
                    )
                  }
                  selected={priceCalcStore.recipeMargin()}
                />
              </LabeledField>
            </div>
          )}
          <div class="flex items-center mt-2">
            Cost per recipe with {priceCalcStore.recipeMargin()}% margin applied
            is{' '}
            <Highlight
              class="px-1"
              text={`${priceCalcStore.unitCostWithProfit()}`}
            />
            {mainState.currency}
          </div>
          <div class="mt-8">
            {priceCalcStore.state.simpleMode && ProductsCalcTableSimple}
            {!priceCalcStore.state.simpleMode && ProductsCalcTableExpanded}
          </div>
        </>
      )}
    </Accordion>
  );
};
