import { Product } from "@/types";
import { useCart } from "@/hooks/cart";
import { useQueryUser } from "@/hooks/user/useQueryUser";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Spinner } from "@/components/Spinner";
import { useMutationState } from "@tanstack/react-query";
import {
  useIsCartUpdating,
  useUpdateCartItem,
  useDeleteCartItem,
  useAddToCart,
} from "@/hooks/cart";

interface AddToCartProps {
  product: Product;
}

export function AddToCart(props: AddToCartProps) {
  const { data: user } = useQueryUser();

  if (!user) return <UnauthenticatedAddToCart />;
  return <AuthenticatedAddToCart {...props} />;
}

function UnauthenticatedAddToCart() {
  const navigate = useNavigate();
  return <AddToCartButton onClick={() => navigate("/login")} />;
}

function AuthenticatedAddToCart({ product }: AddToCartProps) {
  const productId = product.id;
  const { data: cart = [] } = useCart();
  const currentQuantity =
    cart.find((item) => item.productId === productId)?.quantity || 0;

  const addMutation = useAddToCart();
  const isGlobalUpdating = useIsCartUpdating();

  // Check if THIS specific item is being added
  const pendingMutations = useMutationState({
    filters: { status: "pending" },
    select: (mutation) => ({
      key: mutation.options.mutationKey?.[0],
      variables: mutation.state.variables as any,
    }),
  });

  const isThisItemUpdating = pendingMutations.some(
    (m) => m.key === "cartAdd" && m.variables?.productId === productId,
  );

  if (currentQuantity === 0) {
    return (
      <AddToCartButton
        isLoading={isGlobalUpdating}
        isThisItemUpdating={isThisItemUpdating}
        onClick={() => addMutation.mutate({ productId, quantity: 1 })}
      />
    );
  }

  return (
    <QuantityChange
      productId={productId}
      currentQuantity={currentQuantity}
      isGlobalUpdating={isGlobalUpdating}
    />
  );
}

function QuantityChange({
  productId,
  currentQuantity,
  isGlobalUpdating,
}: {
  productId: string;
  currentQuantity: number;
  isGlobalUpdating: boolean;
}) {
  const updateMutation = useUpdateCartItem();
  const deleteMutation = useDeleteCartItem();

  // Check if THIS specific item is being updated or deleted
  const pendingMutations = useMutationState({
    filters: { status: "pending" },
    select: (mutation) => ({
      key: mutation.options.mutationKey?.[0],
      variables: mutation.state.variables as any,
    }),
  });

  const isThisItemUpdating = pendingMutations.some(
    (m) =>
      (m.key === "cartUpdate" && m.variables?.productId === productId) ||
      (m.key === "cartDelete" && m.variables === productId),
  );

  return (
    <div className="flex items-center justify-between w-full h-8.5 mt-0.5 border border-(--primary-green)/30 rounded-[5px] overflow-hidden shadow-[0_2px_5px_rgba(220,220,220,0.5)] bg-white">
      <button
        disabled={isGlobalUpdating}
        onClick={() =>
          currentQuantity === 1
            ? deleteMutation.mutate(productId)
            : updateMutation.mutate({
                productId,
                payload: { quantity: currentQuantity - 1 },
              })
        }
        className="flex items-center justify-center w-10 h-full bg-white hover:bg-green-50 active:bg-green-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default"
      >
        {currentQuantity === 1 ? (
          <DeleteOutlineIcon className="text-red-600" sx={{ fontSize: 18 }} />
        ) : (
          <RemoveIcon
            className="text-(--primary-green)"
            sx={{ fontSize: 18 }}
          />
        )}
      </button>

      <span className="flex-1 flex items-center justify-center font-bold text-[15px] select-none text-gray-800 h-full">
        {isThisItemUpdating ? (
          <Spinner size={16} sx={{ color: "var(--primary-green)" }} />
        ) : (
          currentQuantity
        )}
      </span>

      <button
        disabled={isGlobalUpdating}
        onClick={() =>
          updateMutation.mutate({
            productId,
            payload: { quantity: currentQuantity + 1 },
          })
        }
        className="flex items-center justify-center w-10 h-full bg-white hover:bg-green-50 active:bg-green-100 transition-colors cursor-pointer border-l border-gray-100 disabled:opacity-50 disabled:cursor-default"
      >
        <AddIcon className="text-(--primary-green)" sx={{ fontSize: 18 }} />
      </button>
    </div>
  );
}

function AddToCartButton({
  onClick,
  isLoading,
  isThisItemUpdating,
}: {
  onClick: () => void;
  isLoading?: boolean;
  isThisItemUpdating?: boolean;
}) {
  return (
    <button
      className="w-full h-8.5 mt-0.5 button-primary select-none disabled:opacity-75 disabled:cursor-default flex items-center justify-center"
      data-testid="AddToCart"
      disabled={isLoading}
      onClick={onClick}
    >
      {isThisItemUpdating ? (
        <Spinner size={16} color="inherit" />
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}
