import useTargetView from "../hooks/useTargetView";

export default function Products() {
  useTargetView("products");

  return (
    <div className="page">
      <h1>Products</h1>
      <div id="product-offer" className="card">
        Default Offer
      </div>
    </div>
  );
}