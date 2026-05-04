import useTargetView from "../hooks/useTargetView";

export default function Products() {
  useTargetView("products", "Products", {
    "profile.loginStatus": "false"
  });

  return (
    <div className="page">
      <h1>Products</h1>

      <div id="product-offer" className="card target-slot">
        Default Offer
      </div>
    </div>
  );
}
