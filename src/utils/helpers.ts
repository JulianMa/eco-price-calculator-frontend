const removeTagsRegex = /(<([^>]+)>)/gi;
export const removeXmlTags = (name: string) =>
  name.replace(removeTagsRegex, '');

export const filterByText = (valueFilter: string, value: string) =>
  valueFilter.length === 0 ||
  value?.toLowerCase()?.indexOf(valueFilter?.toLowerCase()) >= 0;

export const filterByTextEqual = (valueFilter: string, value: string) =>
  valueFilter.length === 0 ||
  value?.toLowerCase() === valueFilter?.toLowerCase();

export const filterByIncludesAny = (
  valuesToFilter: string[],
  values: string[]
) =>
  valuesToFilter.length === 0 ||
  valuesToFilter[0].length === 0 ||
  valuesToFilter.some((t) => values.includes(t));

export const filterUnique = <T>(value: T, index: number, self: T[]) =>
  self.indexOf(value) === index;

export const paginateArray = <T>(
  currentPage: number,
  pageSize: number,
  items?: T[]
) => items?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

export const calcTotalPages = <T>(pageSize: number, items?: T[]) =>
  Math.ceil((items?.length ?? 0) / pageSize);

export const formatNumber = (num: number) => +num.toFixed(2);

export const sortByText = (a: string, b: string) =>
  a.toLowerCase().localeCompare(b.toLowerCase());
export const sortByTextFn =
  <T>(fn: (c: T) => string) =>
    (a: T, b: T) =>
      fn(a).toLowerCase().localeCompare(fn(b).toLowerCase());

export const sortByTextExcludingWord =
  (word: string) => (a: string, b: string) => {
    const aContainsWord = a.indexOf(word) >= 0;
    const bContainsWord = b.indexOf(word) >= 0;
    // aContainsWord XOR bContainsWord
    if ((aContainsWord && bContainsWord) || (!aContainsWord && !bContainsWord))
      return a.toLowerCase().localeCompare(b.toLowerCase());

    return aContainsWord ? 1 : -1;
  };

export const calcAvgPrice = (items: { price: number; quantity: number }[]) => {
  const avgCalc = items.reduce(
    (agg, next) => ({
      sum: agg.sum + next.price * next.quantity,
      count: agg.count + next.quantity,
    }),
    { sum: 0, count: 0 } as { sum: number; count: number }
  );
  return avgCalc.count > 0 ? formatNumber(avgCalc.sum / avgCalc.count) : null;
};

export const calcAmmount = (ammount: number, craftAmmout: number) => {
  return Math.ceil(ammount * craftAmmout);
};

export const calcPrice = (ammount: number, price?: number) =>
  !price ? 0 : formatNumber(ammount * price);

//https://www.xero.com/au/glossary/margin-vs-markup/
export const convertToMarginMultiplier = (margin: number) => 1 / (1 - margin / 100);

// When user hasn't picked cost percentages yet, we divide those percentages even
export const getRecipeEvenPercentages = (recipe: Variant) => {
  const evenPercent = Math.floor(100 / recipe.Products.length);
  return recipe.Products.map((prod, index) => ({
    prod: prod.Name,
    perc:
      index !== recipe.Products.length - 1
        ? evenPercent
        : 100 - (recipe.Products.length - 1) * evenPercent,
  }));
};

// Fixes percentages so that the sum is 100%
export const fixPercentages = (
  prevPercentages: {
    prod: string;
    perc: number;
  }[],
  prodName: string,
  newPercentage: number
) => {
  let sum = newPercentage;
  return prevPercentages.map((t, index) => {
    let percentage = t.prod === prodName ? newPercentage : t.perc;
    if (t.prod !== prodName) {
      if (sum + percentage > 100) {
        percentage = 100 - sum;
      }
      sum += percentage;
    }
    if (index === prevPercentages.length - 1) {
      percentage += 100 - sum;
    }
    return {
      ...t,
      perc: percentage,
    };
  });
};

export const getTagId = (tagName: string) => `T_${tagName}`;
export const getItemId = (itemName: string) => `I_${itemName}`;
export const getIngredientId = (ingredient: {
  IsSpecificItem: boolean;
  Tag: string;
  Name: string;
}): string =>
  ingredient.IsSpecificItem
    ? getItemId(ingredient.Name)
    : getTagId(ingredient.Tag);

export const getIngredient = (ingredient: {
  IsSpecificItem: boolean;
  Tag: string;
  Name: string;
}) => ({
  Name: ingredient.IsSpecificItem ? ingredient.Name : ingredient.Tag,
  IsSpecificItem: ingredient.IsSpecificItem
});

export const getIngredientDisplayName = (ingredient: {
  IsSpecificItem: boolean;
  Tag: string;
  Name: string;
}) => ingredient.IsSpecificItem ? ingredient.Name : `Tag ${ingredient.Tag}`;

export const getIngredientById = (id: string) => {
  if (id.startsWith(getItemId(''))) {
    return {
      IsSpecificItem: true,
      Name: id.substring(getItemId('').length),
      Tag: ''
    }
  }
  if (id.startsWith(getTagId(''))) {
    return {
      IsSpecificItem: false,
      Name: '',
      Tag: id.substring(getTagId('').length)
    }
  }
  return {
    IsSpecificItem: true,
    Name: 'old_' + id,
    Tag: ''
  }
}

export const getDateFromExportedAt = (date: ExportedAt) =>
  // Month - 1 because in javascript months are zero based
  new Date(date.Year, date.Month - 1, date.Day, date.Hour, date.Min, date.Sec);


export const getOffersAndCalculateAvgPrice = (allProductsInStores: ProductOffer[] | undefined, currentCurrency: string, productNames: string[]) => {
  const offersInCurrency =
    allProductsInStores?.filter(
      (t) =>
        productNames.includes(t.ItemName) &&
        t.CurrencyName === currentCurrency
    ) ?? [];
  const validOffersForAvg = offersInCurrency.filter(
    (t) => !t.Buying && t.Quantity > 0
  );
  return {
    Offers: offersInCurrency,
    AvgPrice: calcAvgPrice(
      validOffersForAvg?.map((offer) => ({
        price: offer.Price,
        quantity: offer.Quantity,
      })) ?? []
    ),
  };
};