import Accordion from '../../../components/Accordion/Accordion';
import Checkbox from '../../../components/Checkbox';
import Highlight from '../../../components/Highlight';
import LabeledField from '../../../components/LabeledField';
import RadioToggle from '../../../components/RadioToggle';
import SkillLevelDropdown from '../../../components/SkillLevelDropdown/SkillLevelDropdown';
import { useMainContext } from '../../../hooks/MainContext';
import { formatNumber } from '../../../utils/helpers';
import { useCalcContext } from '../context/CalcContext';
import RecipePicker from './RecipePicker';
import IngredientsCalcTableExpanded from './Expanded/IngredientsCalcTableExpanded';
import IngredientsCalcTableSimple from './Simple/IngredientsCalcTableSimple';

export default () => {
  const { get, update } = useMainContext();
  const { priceCalcStore, listProductsStore } = useCalcContext();

  return (
    <>
      <Accordion
        notCollapsible
        startsOpen
        class="mt-4"
        headerText={
          <span>
            <span class="font-medium">Ingredients</span>: Calculating costs for{' '}
            <Highlight text={priceCalcStore.focusedNode()?.productName} /> using
            recipe
            <RecipePicker
              selectedValue={
                priceCalcStore.focusedNode()?.selectedVariant?.Variant.Key ?? ''
              }
              recipeVariants={
                priceCalcStore.focusedNode()?.recipeVariants ?? []
              }
              setSelected={(selected: string) =>
                priceCalcStore.setSelectedRecipes((prev) => ({
                  ...prev,
                  [priceCalcStore.focusedNode()?.ingredientId ?? '']: selected,
                }))
              }
            />
            {!!priceCalcStore.focusedNode()?.selectedVariant?.Variant.Key && (
              <>
                at table
                <Highlight
                  text={priceCalcStore.recipe()?.CraftingTable}
                  class="pl-2"
                />
              </>
            )}
          </span>
        }
      >
        {priceCalcStore.selectedVariant() && (
          <>
            {!priceCalcStore.state.simpleMode && (
              <div class="flex gap-5 flex-wrap">
                <LabeledField vertical text="Craft amount:">
                  <RadioToggle
                    options={[
                      { text: '1', value: 1 },
                      { text: '10', value: 10 },
                      { text: '100', value: 100 },
                    ]}
                    onChange={(selected: string | number) =>
                      update.craftAmmount(
                        priceCalcStore.variantId(),
                        Number(selected)
                      )
                    }
                    selected={get.craftAmmount(priceCalcStore.variantId())}
                  />
                </LabeledField>
                <LabeledField vertical text="Upgrade module in use:">
                  <RadioToggle
                    options={Array.from(new Array(6)).map((_, i) => ({
                      text: `M${i}`,
                      value: i,
                    }))}
                    onChange={(selected: string | number) =>
                      update.craftModule(
                        priceCalcStore.variantId(),
                        Number(selected)
                      )
                    }
                    selected={get.craftModule(priceCalcStore.variantId())}
                  />
                </LabeledField>
                <LabeledField vertical text="Lavish Talent:">
                  <Checkbox
                    label="Enabled"
                    onChange={(isChecked: boolean) =>
                      update.craftLavish(priceCalcStore.variantId(), isChecked)
                    }
                    checked={get.craftLavish(priceCalcStore.variantId())}
                  />
                </LabeledField>
                {(priceCalcStore.recipe()?.SkillNeeds.length ?? 0 > 0) && (
                  <LabeledField
                    vertical
                    text={priceCalcStore.recipeSkill() + ' Level:'}
                  >
                    <SkillLevelDropdown
                      level={priceCalcStore.craftLevel()}
                      onSelectLevel={(level) =>
                        update.craftLevel(priceCalcStore.recipeSkill(), level)
                      }
                    />
                  </LabeledField>
                )}
              </div>
            )}
            <div class="mt-8">
              {priceCalcStore.state.simpleMode && (
                <IngredientsCalcTableSimple />
              )}
              {!priceCalcStore.state.simpleMode && (
                <IngredientsCalcTableExpanded />
              )}
            </div>

            <div class="flex items-center mt-8">
              Recipe production cost is
              <Highlight
                class="pl-1"
                text={`${priceCalcStore.totalIngredientCost()}`}
              />
              {priceCalcStore.craftAmmount() > 1 &&
                (priceCalcStore.totalIngredientCost() ?? 0) > 0 && (
                  <>
                    , cost per repetition is
                    <Highlight
                      class="pl-1"
                      text={`${formatNumber(
                        (priceCalcStore.totalIngredientCost() ?? 0) /
                          priceCalcStore.craftAmmount()
                      )}`}
                    />
                  </>
                )}
            </div>
          </>
        )}
      </Accordion>
    </>
  );
};
