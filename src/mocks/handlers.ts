import { rest } from 'msw';
import Stores from './data/Stores.json';
import Recipes from './data/Recipes.json';
import Tags from './data/Tags.json';
import * as constants from '../utils/constants';

export const handlers = [
  // Handles a GET /user request
  rest.get('/.netlify/functions/filesDb', (req, res, ctx) => {
    const file = req.url.searchParams.get('file');
    if (file === constants.Stores) {
      return res(
        ctx.status(200),
        ctx.json(Stores),
      )
    }

    if (file === constants.Recipes)
      return res(
        ctx.status(200),
        ctx.json(Recipes),
      )

    if (file === constants.Tags)
      return res(
        ctx.status(200),
        ctx.json(Tags),
      )
  })
]