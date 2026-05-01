import { addNewCartItem } from "@/utils";
import { Product } from "@/types";
import { useRefreshCart } from "@/hooks/useCart";
import { useToastSetter } from "@/hooks/useToastSetter";
import { useUser } from "@/hooks/useUser";
import { useNavigate } from "react-router";

interface AddToCartProps {
  product: Product;
  quantity: number;
}

export default function AddToCart(props: AddToCartProps) {
  const user = useUser();

  return user ? (
    <AuthenticatedAddToCart {...props} />
  ) : (
    <UnauthenticatedAddToCart />
  );
}

function UnauthenticatedAddToCart() {
  const navigate = useNavigate();
  return (
    <AddToCartButton
      onClick={() => {
        navigate("/login");
      }}
    />
  );
}

function AuthenticatedAddToCart({ product, quantity }: AddToCartProps) {
  const { id } = product;
  const setToast = useToastSetter();
  const refreshCart = useRefreshCart();

  return <AddToCartButton onClick={addToCartOnClick} />;

  async function addToCartOnClick() {
    const data = {
      productId: id,
      quantity,
    };

    const success = await addNewCartItem(data, setToast);
    if (success) {
      await refreshCart();
    }
  }
}

function AddToCartButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="add-to-cart-button button-primary"
      data-testid="AddToCart"
      onClick={onClick}
    >
      Add to Cart
    </button>
  );
}
