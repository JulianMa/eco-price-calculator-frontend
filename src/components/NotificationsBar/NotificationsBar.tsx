import classNames from 'classnames';
import { createMemo } from 'solid-js';
import { useMainContext } from '../../hooks/MainContext';
import * as constants from '../../utils/constants';
import { getDateFromExportedAt } from '../../utils/helpers';

const getLastUpdateInHours = (date: Date) => {
  const dateNow = new Date();
  return Math.round((dateNow.getTime() - date.getTime()) / 3600000);
};
enum LogLevel {
  Error,
  Warning,
  Info,
  None,
}

export const getLogLevel = ({
  hasNoData,
  hasOnlySomeData,
  lastUpdateInHours,
  isPluginOutdated,
}: {
  hasNoData: boolean;
  hasOnlySomeData: boolean;
  lastUpdateInHours: number;
  isPluginOutdated: boolean;
}) => {
  if (hasNoData || hasOnlySomeData) return LogLevel.Error;
  if (lastUpdateInHours > 4) return LogLevel.Warning;
  if (isPluginOutdated) return LogLevel.Info;
  return LogLevel.None;
};
export default () => {
  const { storesResource, recipesResource, tagsResource } = useMainContext();
  
  const calc = createMemo(() => {
    // Error
    const hasStoresData = !!storesResource()?.PluginVersion;
    const hasRecipesData = !!recipesResource()?.PluginVersion;
    const hasTagsData = !!tagsResource()?.PluginVersion;
    const hasNoData =
      !hasStoresData && !hasRecipesData && !hasTagsData;
    const hasOnlySomeData =
      !hasStoresData || !hasRecipesData || !hasTagsData;

    // Warning
    const exportedAt = storesResource()?.ExportedAt;
    const lastUpdateInHours = exportedAt
      ? getLastUpdateInHours(getDateFromExportedAt(exportedAt))
      : 0;

    // Info
    const pluginVersion = storesResource()?.PluginVersion;
    const isPluginOutdated = !!pluginVersion && pluginVersion !== constants.latestPluginVersion;

    return {
      loading:
        storesResource.loading ||
        recipesResource.loading ||
        tagsResource.loading,
      logLevel: getLogLevel({
        hasNoData,
        hasOnlySomeData,
        lastUpdateInHours,
        isPluginOutdated,
      }),
      hasNoData,
      hasOnlySomeData,
      lastUpdateInHours,
      isPluginOutdated,
      pluginVersion,
    };
  });
  return (
    <div
      class={classNames({
        'border-t border-b':
          !calc().loading && calc().logLevel != LogLevel.None,
        'bg-red-100 border-red-400 text-red-700':
          calc().logLevel === LogLevel.Error,
        'bg-yellow-100 border-yellow-500 text-yellow-700':
          calc().logLevel === LogLevel.Warning,
        'bg-blue-100 border-blue-500 text-blue-700':
          calc().logLevel === LogLevel.Info,
      })}
      role="alert"
    >
      {!calc().loading && calc().logLevel != LogLevel.None && (
        <div class="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
          {calc().logLevel === LogLevel.Error && (
            <p class="font-bold">Critical error found:</p>
          )}
          {calc().logLevel === LogLevel.Error && calc().hasNoData && (
            <p class="text-sm">
              Not connected to server files. Check if mod is installed and
              configured properly on your eco server.
            </p>
          )}
          {calc().logLevel === LogLevel.Error &&
            !calc().hasNoData &&
            calc().hasOnlySomeData && (
              <p class="text-sm">
                Not all files are being exported. Either restart the eco server
                or run commands /dumplivedata and /dumprecipes as admin.
              </p>
            )}

          {calc().logLevel === LogLevel.Warning && (
            <p class="font-bold">Warning:</p>
          )}
          {calc().logLevel === LogLevel.Warning && calc().lastUpdateInHours && (
            <p class="text-sm">
              Your server files haven't been updated in{' '}
              {calc().lastUpdateInHours} hours. Make sure the mod is running and
              configured properly on your eco server.
            </p>
          )}

          {calc().logLevel === LogLevel.Info && <p class="font-bold">Info:</p>}
          {calc().logLevel === LogLevel.Info && calc().isPluginOutdated && (
            <p class="text-sm">
              Eco server is running an outdated version of the required mod{' '}
              <i>Live data exporter</i>: {calc().pluginVersion}. Please download
              latest version {constants.latestPluginVersion} from{' '}
              <a
                className="underline"
                href="https://eco.mod.io/live-data-exporter"
                target="_blank"
              >
                https://eco.mod.io
              </a>
              .
            </p>
          )}
        </div>
      )}
    </div>
  );
};
