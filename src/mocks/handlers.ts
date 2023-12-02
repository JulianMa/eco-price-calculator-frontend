import { rest } from 'msw';
import Servers from './data/Servers.json';
import Stores from './data/Stores.json';
import Recipes from './data/Recipes.json';
import Tags from './data/Tags.json';
import AllItems from './data/AllItems.json';
import CraftingTables from './data/CraftingTables.json';
import * as constants from '../utils/constants';

export const handlers = [
  // Handles Servers request
  rest.get('/.netlify/functions/servers', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(Servers))
  ),
  // Handles file requests
  rest.get('/.netlify/functions/files', (req, res, ctx) => {
    const file = req.url.searchParams.get('file');
    if (file === constants.Stores) {
      return res(ctx.status(200), ctx.json(Stores));
    }

    if (file === constants.Recipes)
      return res(ctx.status(200), ctx.json(Recipes));

    if (file === constants.Tags) return res(ctx.status(200), ctx.json(Tags));

    if (file === constants.AllItems)
      return res(ctx.status(200), ctx.json(AllItems));

    if (file === constants.CraftingTables)
      return res(ctx.status(200), ctx.json(CraftingTables));
  }),
];
