import GamePricesModal from '../../components/GamePricesModal';
import ListProductsView from './ListProductsView';
import CalculatePriceView from './CalculatePriceView/CalculatePriceView';
import { CalcContextProvider } from './context/CalcContext';
import FuelPricesModal from '../../components/FuelPricesModal';

export default () => {
  return (
    <CalcContextProvider>
      <ListProductsView />
      <CalculatePriceView />
      <GamePricesModal />
      <FuelPricesModal />
    </CalcContextProvider>
  );
};
