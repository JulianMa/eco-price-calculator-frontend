import { useMainContext } from '../../hooks/MainContext';
import Tooltip from '../Tooltip';
import { createMemo } from 'solid-js';
import Button from '../Button';

type Props = {
  id: string;
  name: string;
  isSpecificItem: boolean;
  showPricesForProductsModal: (Name: string, IsSpecificItem: boolean) => void;
};
export default (props: Props) => {
  const {
    currentCurrency,
    tagsResource,
    allProductsInStores,
    allItemsAndTagsWithPrice,
  } = useMainContext();

  const avgPrice = createMemo(() => {
    const products = props.isSpecificItem
      ? [props.name]
      : tagsResource?.()?.Tags?.[props.name] ?? [];
    const prodOffersInStores =
      allProductsInStores()?.filter((t) => products.includes(t.ItemName)) ?? [];
    if (prodOffersInStores.length <= 0) return { errorMessage: 'no offers' };
    const offersInCurrency = !currentCurrency()
      ? []
      : prodOffersInStores.filter(
          (t) => t.CurrencyName === currentCurrency()
        ) ?? [];
    if (currentCurrency() && offersInCurrency.length === 0)
      return { calculatedPrice: 'no offers in currency' };

    return {
      calculatedPrice: !currentCurrency()
        ? 0
        : allItemsAndTagsWithPrice()?.[props.id]?.AvgPrice,
    };
  });

  if (avgPrice().errorMessage) {
    return <>{avgPrice().errorMessage}</>;
  }

  return (
    <Tooltip
      noStyle
      text="Click for ingame prices. Select currency for average."
    >
      <Button
        onClick={() =>
          props.showPricesForProductsModal(props.name, props.isSpecificItem)
        }
      >
        {!currentCurrency() && 'select currency'}
        {currentCurrency() &&
          avgPrice() &&
          `${avgPrice().calculatedPrice ?? '?'} ${currentCurrency()}`}
      </Button>
    </Tooltip>
  );
};
