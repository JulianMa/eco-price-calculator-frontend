import Username from './components/Username';
import Dropdown from './components/Dropdown';
import { useMainContext } from './hooks/MainContext';
import LabeledField from './components/LabeledField';
import { createMemo } from 'solid-js';

type Props = {
  currentRoute: () =>
    | { text: string; description: string; includeHeaderFields?: boolean }
    | undefined;
};
export default (props: Props) => {
  const {
    serversResource,
    onlineServersResource,
    currentServer,
    currentCurrency,
    update,
    allCurrencies,
  } = useMainContext();
  const servers = createMemo(() => {
    const online =
      onlineServersResource?.()
        ?.filter((t) => t.isOnline)
        ?.map((server) => ({
          value: server.key,
          text: server.name,
        })) ?? [];
    if (online.find((s) => s.value === currentServer())) {
      return online;
    }
    // If selected server is not online, we added it to the list as the last position, so that it is shown on the list
    return [
      ...online,
      ...(serversResource?.()
        ?.filter((t) => t.key === currentServer())
        .map((server) => ({
          value: server.key,
          text: server.name,
        })) ?? []),
    ];
  });
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
                  {servers()?.length > 0 && (
                    <Dropdown
                      value={currentServer()}
                      values={[
                        { value: '', text: 'Select your server' },
                        ...servers(),
                        ...(onlineServersResource?.loading ?? true
                          ? [{ value: '', text: 'Loading online servers...' }]
                          : []),
                      ]}
                      onChange={(newValue) => {
                        if (newValue !== '') update.server(`${newValue}`);
                      }}
                      origin="SE"
                      direction="SW"
                    />
                  )}
                  {(onlineServersResource?.loading ?? true) &&
                    servers()?.length <= 0 &&
                    'loading...'}
                  {!(onlineServersResource?.loading ?? true) &&
                    servers()?.length <= 0 &&
                    'try again later'}
                </LabeledField>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
