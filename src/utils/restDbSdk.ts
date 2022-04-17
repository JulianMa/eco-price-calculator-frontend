import { removeXmlTags } from './helpers';
import * as constants from './constants';

const endpoints = {
  readDB: (fileName: string) => `.netlify/functions/filesDb?file=${fileName}`,
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

export const readDB = (fileName: string) =>
  fetchAsync(endpoints.readDB(fileName));

export const getStores = (): Promise<StoresResponse | undefined> =>
  fetchAsync<StoresResponse>(endpoints.readDB(constants.Stores)).then(
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

export const getRecipes = (): Promise<RecipesResponse | undefined> =>
  fetchAsync<RecipesResponse>(endpoints.readDB(constants.Recipes));

export const getTags = () =>
  fetchAsync<TagsResponse>(endpoints.readDB(constants.Tags));
