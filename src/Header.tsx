import Username from './components/Username';
import Dropdown from './components/Dropdown';
import { useMainContext } from './hooks/MainContext';
import LabeledField from './components/LabeledField';

type Props = {
  currentRoute: () =>
    | { text: string; description: string; includeHeaderFields?: boolean }
    | undefined;
};
export default (props: Props) => {
  const {
    serversResource,
    currentServer,
    currentCurrency,
    update,
    allCurrencies,
  } = useMainContext();
  return (
    <header class="bg-white shadow relative">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {props.currentRoute()?.text}
          </h1>
          <span>{props.currentRoute()?.description}</span>
        </div>
        {props.currentRoute()?.includeHeaderFields && (
          <div class="flex justify-between pt-3">
            <LabeledField text="Username:" vertical>
              <Username />
            </LabeledField>
            <div class="flex gap-4">
              <LabeledField text="Currency:" vertical>
                <Dropdown
                  value={currentCurrency()}
                  values={[
                    { value: '', text: 'Select a currency' },
                    ...(allCurrencies()?.map((name) => ({
                      value: name,
                      text: name,
                    })) ?? []),
                  ]}
                  onChange={(newValue) => update.currency(`${newValue}`)}
                  origin="SE"
                  direction="SW"
                />
              </LabeledField>
              {!import.meta.env.VITE_SERVER && (
                <LabeledField text="Eco Server:" vertical>
                  <Dropdown
                    value={currentServer()}
                    values={[
                      { value: '', text: 'Select your server' },
                      ...(serversResource?.()?.map((server) => ({
                        value: server.key,
                        text: server.name,
                      })) ?? []),
                    ]}
                    onChange={(newValue) => update.server(`${newValue}`)}
                    origin="SE"
                    direction="SW"
                  />
                </LabeledField>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
