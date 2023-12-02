declare interface Config {
  Dbs: DB[];
}

declare interface DB {
  Name: string;
  ExportedAt: ExportedAt;
}

declare interface Dictionary<T> {
  [key: string]: T;
}

declare interface ExportedAt {
  Year: number;
  Month: number;
  Day: number;
  Hour: number;
  Min: number;
  Sec: number;
  StringRepresentation: string;
  Ticks: number;
}

declare interface TypedResponse {
  PluginVersion: string;
  Version: number;
  ExportedAt: ExportedAt;
}

declare interface StoresResponse extends TypedResponse {
  Stores: Stores[];
}

declare interface Stores {
  Name: string;
  Owner: string;
  Balance: number;
  CurrencyName: string;
  Enabled: boolean;
  AllOffers: Offers[];
}

declare interface Offers {
  ItemName: string;
  Buying: boolean;
  Price: number;
  Quantity: number;
  Limit: number;
  MaxNumWanted: number;
  MinDurability: number;
}

declare interface ProductOffer extends Offers {
  StoreName: string;
  StoreOwner: string;
  CurrencyName: string;
}

declare interface RecipesResponse extends TypedResponse {
  Recipes: Recipe[];
}

declare interface Recipe {
  Key: string;
  Untranslated: string;
  BaseCraftTime: number;
  BaseLaborCost: number;
  BaseXPGain: number;
  CraftingTable: string;
  CraftingTableCanUseModules: boolean;
  DefaultVariant: string;
  NumberOfVariants: number;
  SkillNeeds: {
    Skill: string;
    Level: number;
  }[];
  Variants: Variant[];
}

declare interface Variant {
  Key: string;
  Name: string;
  Ingredients: RecipeIngredient[];
  Products: {
    Name: string;
    Ammount: number;
  }[];
}

declare interface RecipeIngredient {
  IsSpecificItem: boolean;
  Tag: string;
  Name: string;
  Ammount: number;
  IsStatic: boolean;
}

declare interface RecipeVariant {
  Recipe: Recipe;
  Variant: Variant;
}

declare interface CraftableProduct {
  Name: string;
  RecipeVariants: RecipeVariant[];
}

declare interface CraftableProductWithOffers {
  Name: string;
  RecipeVariants: RecipeVariant[];
  Offers: ProductOffer[];
}

declare interface SetSignal<T> {
  (t: T | ((prev: T) => T)): void;
}

declare interface TagsResponse extends TypedResponse {
  Tags: Record<string, string[]>;
}

declare interface AllItemsResponse extends TypedResponse {
  AllItems: Record<
    string,
    {
      Tags: string[];
      Fuel: number;
    }
  >;
}

declare interface CraftingTablesResponse extends TypedResponse {
  CraftingTables: Array<CraftingTable>;
}

declare interface ServersResponse {
  key: string;
  name: string;
  isOnline: boolean;
}

declare interface ItemWithRecipe {
  Name: string;
  RecipeVariants: RecipeVariant[];
}

declare interface ItemOrTagPrice {
  Name: string;
  IsSpecificItem: boolean;
  Offers: ProductOffer[];
  AvgPrice: number | null;
}

declare interface CraftingTable {
  TableName: string;
  ResourceEfficiencyModule: string;
  OwnerName: string;
  AllowedUpgrades: Array<string>;
  ModuleLevel: number;
  GenericMultiplier: number;
  SkillMultiplier: number;
}
