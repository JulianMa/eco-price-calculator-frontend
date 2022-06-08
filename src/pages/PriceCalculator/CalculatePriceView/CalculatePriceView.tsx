import Button from '../../../components/Button';
import CalculatorRecipeTree from './CalculatorRecipeTree';
import { useCalcContext } from '../context/CalcContext';
import IngredientsCalc from './IngredientsCalc';
import ProductsCalc from './ProductsCalc';
import CalculatorRecipeBreadcrumb from './CalculatorRecipeBreadcrumb';
import RadioToggle from '../../../components/RadioToggle';

export default () => {
  const { priceCalcStore } = useCalcContext();

  return (
    <>
      {priceCalcStore.selectedProduct() !== undefined && (
        <>
          <div class="flex justify-between">
            <Button
              onClick={() => priceCalcStore.setSelectedProduct(undefined)}
            >
              Back
            </Button>
            <div class="flex gap-2">
              <RadioToggle
                options={[
                  { text: 'Simple', value: 'Simple' },
                  { text: 'Expanded', value: 'Expanded' },
                ]}
                onChange={priceCalcStore.update.toggleSimpleMode}
                selected={
                  priceCalcStore.state.simpleMode ? 'Simple' : 'Expanded'
                }
              />
              <RadioToggle
                options={[
                  { text: 'Breadcrumb', value: 'Breadcrumb' },
                  { text: 'Recipe tree', value: 'RecipeTree' },
                ]}
                onChange={priceCalcStore.update.toggleShowRecipeTree}
                selected={
                  priceCalcStore.state.showRecipeTree
                    ? 'RecipeTree'
                    : 'Breadcrumb'
                }
              />
            </div>
          </div>
          {priceCalcStore.state.showRecipeTree && <CalculatorRecipeTree />}
          {!priceCalcStore.state.showRecipeTree && (
            <CalculatorRecipeBreadcrumb />
          )}
          <IngredientsCalc />
          <ProductsCalc />
        </>
      )}
    </>
  );
};
