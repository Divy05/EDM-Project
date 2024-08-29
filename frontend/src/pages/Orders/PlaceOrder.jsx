import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

return (
<>
  <ProgressSteps step1 step2 step3 />

  <div className="container mx-auto mt-8 px-4" style={{ width: '90%' }}> {/* Set container width to 80% */}
    {cart.cartItems.length === 0 ? (
      <Message>Your cart is empty</Message>
    ) : (
      <div className="overflow-x-hidden">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <td className="px-2 py-1 text-left align-top">Image</td>
              <td className="px-2 py-1 text-left">Product</td>
              <td className="px-2 py-1 text-left">Quantity</td>
              <td className="px-2 py-1 text-left">Price</td>
              <td className="px-2 py-1 text-left">Total</td>
            </tr>
          </thead>

          <tbody>
            {cart.cartItems.map((item, index) => (
              <tr key={index}>
                <td className="p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                </td>

                <td className="p-2">
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </td>
                <td className="p-2">{item.qty}</td>
                <td className="p-2">{item.price.toFixed(2)}</td>
                <td className="p-2">
                  $ {(item.qty * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between rounded flex-wrap p-4 bg-[#181818]">
        <ul className="text-lg">
          <li>
            <span className="font-semibold">Items:</span> $
            {cart.itemsPrice}
          </li>
          <li>
            <span className="font-semibold">Shipping:</span> $
            {cart.shippingPrice}
          </li>
          <li>
            <span className="font-semibold">Tax:</span> $
            {cart.taxPrice}
          </li>
          <li>
            <span className="font-semibold">Total:</span> $
            {cart.totalPrice}
          </li>
        </ul>

        {error && <Message variant="danger">{error.data.message}</Message>}

        <div>
          <h2 className="text-xl font-semibold mb-2">Shipping</h2>
          <p>
            <strong>Address:</strong> {cart.shippingAddress.address},{" "}
            {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
            {cart.shippingAddress.country}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
          <strong>Method:</strong> {cart.paymentMethod}
        </div>
      </div>

      <button
        type="button"
        className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
        disabled={cart.cartItems.length === 0}
        onClick={placeOrderHandler}
      >
        Place Order
      </button>

      {isLoading && <Loader />}
    </div>
  </div>
</>



  );
};

export default PlaceOrder;
