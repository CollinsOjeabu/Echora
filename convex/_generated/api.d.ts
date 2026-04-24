/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as canvas from "../canvas.js";
import type * as canvasChat from "../canvasChat.js";
import type * as canvasChatHelpers from "../canvasChatHelpers.js";
import type * as content from "../content.js";
import type * as generation from "../generation.js";
import type * as helpers from "../helpers.js";
import type * as ingestion from "../ingestion.js";
import type * as posts from "../posts.js";
import type * as users from "../users.js";
import type * as voiceDna from "../voiceDna.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  canvas: typeof canvas;
  canvasChat: typeof canvasChat;
  canvasChatHelpers: typeof canvasChatHelpers;
  content: typeof content;
  generation: typeof generation;
  helpers: typeof helpers;
  ingestion: typeof ingestion;
  posts: typeof posts;
  users: typeof users;
  voiceDna: typeof voiceDna;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
