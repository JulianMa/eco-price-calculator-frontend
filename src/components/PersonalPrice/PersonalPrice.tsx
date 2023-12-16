import { useMainContext } from '../../hooks/MainContext';
import NumericInput from '../NumericInput';

type Props = {
  // this can either be a product name or a tag id. Use function getPersonalPriceId for ingredients or product.Name for products
  personalPriceId: string;
  class?: string;
};

export default (props: Props) => {
  const { currentCurrency, get, update } = useMainContext();
  
  if (!currentCurrency()) return <>"select currency"</>;
  return (
    <NumericInput
      value={get.personalPrice(props.personalPriceId)}
      onChange={(newValue) =>
        update.personalPrice(props.personalPriceId, currentCurrency(), newValue)
      }
      class={props.class}
    />
  );
};
