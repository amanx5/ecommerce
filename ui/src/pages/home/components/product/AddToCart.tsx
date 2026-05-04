import { updateCart, deleteCartItem, addCartItem } from "@/utils";
import { Product } from "@/types";
import { useCart, useRefreshCart } from "@/hooks/useCart";
import { useToastSetter } from "@/hooks/useToastSetter";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router";

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
  const setToast = useToastSetter();
  const { data = [] } = useCart();
  const currentQuantity =
    data.find((item) => item.productId === productId)?.quantity || 0;
  const refreshCart = useRefreshCart();

  if (currentQuantity === 0) {
    return <AddToCartButton onClick={() => add()} />;
  }

  return <QuantityChange productId={productId} />;

  async function add() {
    await addCartItem({ productId, quantity: 1 }, setToast, refreshCart);
  }
}

function QuantityChange({ productId }: { productId: string }) {
  const setToast = useToastSetter();

  const { data = [] } = useCart();

  const currentQuantity =
    data.find((item) => item.productId === productId)?.quantity || 0;

  const refreshCart = useRefreshCart();

  return (
    <div>
      {currentQuantity === 1 ? (
        <button onClick={() => operation("delete")}>X</button>
      ) : (
        <button onClick={() => operation("decrease")}>-</button>
      )}
      {currentQuantity}
      <button onClick={() => operation("increase")}>+</button>
    </div>
  );

  function operation(op: "increase" | "decrease" | "delete") {
    if (op === "delete") {
      deleteCartItem(productId, setToast, refreshCart);
    } else {
      const quantity =
        op === "decrease" ? currentQuantity - 1 : currentQuantity + 1;
      updateCart(productId, { quantity }, setToast, refreshCart);
    }
  }
}

function AddToCartButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="w-full h-8.5 mt-0.5 button-primary"
      data-testid="AddToCart"
      onClick={onClick}
    >
      Add to Cart
    </button>
  );
}
