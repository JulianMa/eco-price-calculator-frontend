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
    // Swallow error and return undefined
    // console.log(`Could not fetch from ${url}`);
  }
  return undefined;
}

export const readDB = (serverName: string, fileName: string) =>
  fetchAsync(endpoints.readDB(serverName, fileName));

export const getServers = () =>
  fetchAsync<ServersResponse[]>(endpoints.readServer);

export const getStores = (serverName: string): Promise<StoresResponse | undefined> =>
  fetchAsync<StoresResponse>("/data/Stores.json").then(
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
  fetchAsync<RecipesResponse>( "/data/Recipes.json");

export const getTags = (serverName: string) =>
  fetchAsync<TagsResponse>( "/data/Tags.json");

export const getAllItems = (serverName: string) =>
  fetchAsync<AllItemsResponse>("/data/AllItems.json");

export const getCraftingTables = (serverName: string) =>
  fetchAsync<CraftingTablesResponse>("/data/CraftingTables.json");
