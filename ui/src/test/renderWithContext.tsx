import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";
import { MemoryRouter } from "react-router";
import type { User } from "@/types";
import type { Cart } from "@/hooks/useCart";
import { AuthenticationLoader } from "@/components/AuthenticationLoader";

const SAMPLE_USER: User = {
  id: "test-user-id",
  email: "test@example.com",
};

type ExtendedRenderOptions = {
  renderOptions?: RenderOptions;
  route?: string;
  user?: User | null;
  useSampleUser?: boolean;
  cart?: Cart;
};

export function renderWithContext(
  ui: ReactElement,
  extendedRenderOptions?: ExtendedRenderOptions,
) {
  const {
    route = "/",
    renderOptions,
    user = extendedRenderOptions?.useSampleUser ? SAMPLE_USER : null,
    cart = [],
  } = extendedRenderOptions || {};

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Seed the TanStack Query cache with user and cart data
  queryClient.setQueryData(["user"], user);
  if (user) {
    queryClient.setQueryData(["cart", user.id], cart);
  }

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <AuthenticationLoader>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </AuthenticationLoader>
      </QueryClientProvider>,
      renderOptions,
    ),
    queryClient,
  };
}

