import useTargetView from "../hooks/useTargetView";

export default function Cart() {
  useTargetView("cart");

  return (
    <div className="page">
      <h1>Cart</h1>
      <div id="cart-message" className="card">
        Your cart is empty
      </div>
    </div>
  );
}