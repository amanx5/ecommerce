import { isString } from "@/utils/data-types";
import { isTestMode } from "@/utils/environment";

/**
 * Base URL of the backend.
 *
 * The UI and API are deployed as one unit (Vercel monolith), so API calls and
 * image URLs are same-origin relative paths by default (`/api/...`,
 * `/images/...`). An absolute `VITE_BACKEND_URL` override is still honored
 * when set (e.g. local debugging against a remote API), but it is optional
 * and should normally be left unset.
 */
function getBackendUrl(): string {
  const override = import.meta.env["VITE_BACKEND_URL"];

  if (isString(override) && override.trim().length > 0) {
    // remove trailing slashes to avoid double slashes when joining with endpoint
    return override.trim().replace(/\/+$/, "");
  }

  return "";
}

export function getEndpointUrl<T extends string>(
  endpoint: T,
): `${string}/${string}` | T {
  if (!endpoint || isTestMode()) return endpoint;

  // Already absolute (http/https) — return as-is
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://"))
    return endpoint;

  // remove leading slashes to make the endpoint relative
  const relativeEndpoint = endpoint.replace(/^\/+/, "");

  // join with base backend url
  return `${getBackendUrl()}/${relativeEndpoint}`;
}


const AUTH_API_BASE = "/api/auth";
const CART_API_BASE = "/api/cartItems";
const ORDERS_API_BASE = "/api/orders";
const DELIVERYOPTIONS_API_BASE = "/api/deliveryOptions";

export const API_ENDPOINTS = {
  healthcheck: { GET: "/api/health" },

  auth: {
		register: { POST: `${AUTH_API_BASE}/register` },
    signIn: { POST: `${AUTH_API_BASE}/signIn` },
    signOut: { POST: `${AUTH_API_BASE}/signOut` },
    user: { GET: `${AUTH_API_BASE}/user` },
  },

  cart: {
    GET: CART_API_BASE,
    GETEXPANDED: `${CART_API_BASE}?expand=product`,
    POST: CART_API_BASE,
    DELETE: (productId: string) => `${CART_API_BASE}/${productId}`,
    PUT: (productId: string) => `${CART_API_BASE}/${productId}`,
  },

  deliveryOptions: {
    GET: DELIVERYOPTIONS_API_BASE,
		GETEXPANDED: `${DELIVERYOPTIONS_API_BASE}?expand=estimatedDeliveryTimeMs`
  },

  orders: {
    GET: ORDERS_API_BASE,
    GETEXPANDED: `${ORDERS_API_BASE}?expand=products`,
		GETBYID: (orderId: string) => `${ORDERS_API_BASE}/${orderId}`,
		GETBYIDEXPANDED,
    POST: ORDERS_API_BASE,
  },

  paymentSummary: { GET: "/api/paymentSummary" },

  products: {
    GET: "/api/products",
    GETQUERY: (query: string) =>
      `/api/products?search=${encodeURIComponent(query)}`,
  },
} as const;


function GETBYIDEXPANDED<ID extends string>(orderId: ID): `${typeof ORDERS_API_BASE}/${ID}?expand=products` {
	return `${ORDERS_API_BASE}/${orderId}?expand=products`;
}
