import { removeXmlTags } from './helpers';
import * as constants from './constants';

const endpoints = {
  readServer: ".netlify/functions/servers",
  readDB: (serverName: string, fileName: string) => `.netlify/functions/files?server=${serverName}&file=${fileName}`,
};

async function fetchAsync<T>(url: string): Promise<T | undefined> {
  try {
    const response = await fetch(url);
    return (await response.json()) as T;
  } catch (e) {
    console.log(`Could not fetch from ${url}`);
  }
  return undefined;
}

export const readDB = (serverName: string, fileName: string) =>
  fetchAsync(endpoints.readDB(serverName, fileName));

export const getServers = () =>
  fetchAsync<ServersResponse[]>(endpoints.readServer);

export const getStores = (serverName: string): Promise<StoresResponse | undefined> =>
  fetchAsync<StoresResponse>(endpoints.readDB(serverName, constants.Stores)).then(
    (response) =>
      response
        ? {
          ...response,
          Stores: response?.Stores?.map((store) => ({
            ...store,
            Name: removeXmlTags(store.Name),
          })),
        }
        : undefined
  );

export const getRecipes = (serverName: string): Promise<RecipesResponse | undefined> =>
  fetchAsync<RecipesResponse>(endpoints.readDB(serverName, constants.Recipes));

export const getTags = (serverName: string) =>
  fetchAsync<TagsResponse>(endpoints.readDB(serverName, constants.Tags));

export const getAllItems = (serverName: string) =>
  fetchAsync<AllItemsResponse>(endpoints.readDB(serverName, constants.AllItems));

export const getCraftingTables = (serverName: string) =>
  fetchAsync<CraftingTablesResponse>(endpoints.readDB(serverName, constants.CraftingTables));
