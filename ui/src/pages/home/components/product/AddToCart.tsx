import { updateCart, deleteCartItem, addCartItem } from "@/utils";
import { Product } from "@/types";
import { useCart, useRefreshCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Spinner } from "@/components/Spinner";
import { useMutation } from "@tanstack/react-query";

interface AddToCartProps {
  product: Product;
}

export default function AddToCart(props: AddToCartProps) {
  const user = useUser();

  if (!user) return <UnauthenticatedAddToCart />;
  return <AuthenticatedAddToCart {...props} />;
}

function UnauthenticatedAddToCart() {
  const navigate = useNavigate();
  return <AddToCartButton onClick={() => navigate("/login")} />;
}

function AuthenticatedAddToCart({ product }: AddToCartProps) {
  const productId = product.id;
  const { data: cart = [], isFetching } = useCart();
  const currentQuantity =
    cart.find((item) => item.productId === productId)?.quantity || 0;
  const refreshCart = useRefreshCart();

  const addMutation = useMutation({
    mutationFn: () => addCartItem({ productId, quantity: 1 }, refreshCart),
  });

  const isLoading = addMutation.isPending;

  if (currentQuantity === 0) {
    return (
      <AddToCartButton
        isLoading={isLoading}
        onClick={() => addMutation.mutate()}
      />
    );
  }

  return (
    <QuantityChange productId={productId} currentQuantity={currentQuantity} />
  );
}

function QuantityChange({
  productId,
  currentQuantity,
}: {
  productId: string;
  currentQuantity: number;
}) {
  const refreshCart = useRefreshCart();

  const updateMutation = useMutation({
    mutationFn: (quantity: number) =>
      updateCart(productId, { quantity }, refreshCart),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCartItem(productId, refreshCart),
  });

  const isLoading = updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="flex items-center justify-between w-full h-8.5 mt-0.5 border border-(--primary-green)/30 rounded-[5px] overflow-hidden shadow-[0_2px_5px_rgba(220,220,220,0.5)] bg-white">
      <button
        disabled={isLoading}
        onClick={() =>
          currentQuantity === 1
            ? deleteMutation.mutate()
            : updateMutation.mutate(currentQuantity - 1)
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
        {isLoading ? (
          <Spinner size={16} sx={{ color: "var(--primary-green)" }} />
        ) : (
          currentQuantity
        )}
      </span>

      <button
        disabled={isLoading}
        onClick={() => updateMutation.mutate(currentQuantity + 1)}
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
}: {
  onClick: () => void;
  isLoading?: boolean;
}) {
  return (
    <button
      className="w-full h-8.5 mt-0.5 button-primary select-none disabled:opacity-75 disabled:cursor-default flex items-center justify-center"
      data-testid="AddToCart"
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Spinner size={16} color="inherit" />
      ) : (
        "Add to Cart"
      )}
    </button>
  );
}

