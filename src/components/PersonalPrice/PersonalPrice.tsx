import { useMainContext } from '../../hooks/MainContext';
import NumericInput from '../NumericInput';
import {getAllItems, getPriceInEcoStore, getUsername, updatePriceInEcoStore} from "../../utils/restDbSdk";
import {AllItems} from "../../utils/constants";

type Props = {
  // this can either be a product name or a tag id. Use function getPersonalPriceId for ingredients or product.Name for products
  personalPriceId: string;
  class?: string;
};

export default (props: Props) => {
  const { currentCurrency, get, update } = useMainContext();
  
  const saveEcoValue = async (newValue: number) => {
      const response = await updatePriceInEcoStore({ItemId: props.personalPriceId, NewPrice: newValue })
  }
  
  if (!currentCurrency()) return <>"select currency"</>;
  return (
    <NumericInput
      value={get.personalPrice(props.personalPriceId)}
      onChange={(newValue) =>
        update.personalPrice(props.personalPriceId, currentCurrency(), newValue)
      }
      onSaveValueToEco={saveEcoValue}
      class={props.class}
    />
  );
};
