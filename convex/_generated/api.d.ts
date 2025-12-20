/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as affirmations from "../affirmations.js";
import type * as collectionSuggestions from "../collectionSuggestions.js";
import type * as collections from "../collections.js";
import type * as http from "../http.js";
import type * as notes from "../notes.js";
import type * as users from "../users.js";
import type * as verseSuggestions from "../verseSuggestions.js";
import type * as verses from "../verses.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  affirmations: typeof affirmations;
  collectionSuggestions: typeof collectionSuggestions;
  collections: typeof collections;
  http: typeof http;
  notes: typeof notes;
  users: typeof users;
  verseSuggestions: typeof verseSuggestions;
  verses: typeof verses;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
