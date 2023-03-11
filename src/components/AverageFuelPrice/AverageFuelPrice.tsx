import { useMainContext } from '../../hooks/MainContext';
import Tooltip from '../Tooltip';
import { createEffect, createMemo } from 'solid-js';
import Button from '../Button';
import { SpecificTagName } from '../../utils/constants';
import { formatNumber, getItemId } from '../../utils/helpers';

type Props = {
  showPricesForFuelModal: () => void;
};
export default (props: Props) => {
  const {
    get,
    currentCurrency,
    allProductsInStores,
    allItemsAndTagsWithPrice,
  } = useMainContext();

  const avgFuelPrice = createMemo(() => {
    const products = get.itemsInTag(SpecificTagName.BurnableFuel);
    const productNames = products.map((t) => t.Name);
    const prodOffersInStores =
      allProductsInStores()?.filter((t) => productNames.includes(t.ItemName)) ??
      [];
    if (prodOffersInStores.length <= 0) return { errorMessage: 'no offers' };
    const offersInCurrency = !currentCurrency()
      ? []
      : prodOffersInStores.filter(
          (t) => t.CurrencyName === currentCurrency()
        ) ?? [];
    if (currentCurrency() && offersInCurrency.length === 0)
      return { calculatedPrice: 'no offers in currency' };

    const validOffersInCurrency = offersInCurrency.filter(
      (t) => !t.Buying && t.Quantity > 0
    );

    const cheaperAvgPricePerJoule = validOffersInCurrency.reduce(
      ({ ProdName, PricePerJoule }, prodOffer) => {
        const prodName = prodOffer.ItemName;
        const productAvgPrice =
          allItemsAndTagsWithPrice()[getItemId(prodName)]?.AvgPrice ?? 0;

        const joules =
          (products.find((t) => t.Name === prodName)?.Fuel ?? 0) * 2;

        const pricePerJoule = joules === 0 ? 0 : productAvgPrice / joules;

        if (ProdName.length === 0 || pricePerJoule < PricePerJoule)
          return {
            ProdName: prodName,
            PricePerJoule: pricePerJoule,
          };
        return { ProdName, PricePerJoule };
      },
      { ProdName: '', PricePerJoule: 0 }
    );

    if (cheaperAvgPricePerJoule.ProdName.length === 0) {
      return { calculatedPrice: 'no valid offers in currency' };
    }

    return {
      calculatedPrice: !currentCurrency()
        ? 0
        : formatNumber(cheaperAvgPricePerJoule.PricePerJoule * 1000),
    };
  });

  if (avgFuelPrice().errorMessage) {
    return <>{avgFuelPrice().errorMessage}</>;
  }

  return (
    <Tooltip
      noStyle
      text="Click for ingame fuel prices. Select currency for average."
    >
      <Button onClick={() => props.showPricesForFuelModal()}>
        {!currentCurrency() && 'select currency'}
        {currentCurrency() &&
          avgFuelPrice() &&
          `${avgFuelPrice().calculatedPrice ?? '?'} ${currentCurrency()}`}
      </Button>
    </Tooltip>
  );
};
