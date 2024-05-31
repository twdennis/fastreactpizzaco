// import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { formatCurrency } from "../../utilities/helpers";
import { useState } from "react";
import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const {
    username,
    status: addressStatus,
    position,
    address,
    error: addressError,
  } = useSelector((state) => state.user);

  const isLoadingAddress = addressStatus === "loading";

  const dispatch = useDispatch();

  const formErrors = useActionData();

  const labelStyle = "sm:basis-40";
  const inputStyle = "mb-5 flex gap-2 flex-col sm:flex-row sm:items-center";

  const cart = useSelector(getCart);

  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? Math.round(totalCartPrice * 0.2) : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  function capitalize(str) {
    if (!str) return;

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  if (!cart.length) return <EmptyCart />;
  return (
    <div className='px-4 py-6'>
      <h2 className='mb-8 text-xl font-semibold'>
        Ready to order? Let&apos;s go!
      </h2>

      <Form method='POST'>
        <div className={inputStyle}>
          <label className={labelStyle}>First Name</label>
          <input
            type='text'
            name='customer'
            required
            className='input grow'
            defaultValue={capitalize(username)}
          />
        </div>

        <div className={inputStyle}>
          <label className={labelStyle}>Phone number</label>
          <div className='grow'>
            <input type='tel' name='phone' required className='w-full input' />
            {formErrors?.phone && (
              <p className='p-2 mt-2 text-xs text-red-700 bg-red-300 rounded-xl'>
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className={`${inputStyle} relative`}>
          <label className={labelStyle}>Address</label>
          <div className='grow'>
            <input
              type='text'
              name='address'
              required
              className='w-full input'
              defaultValue={address ? address : ""}
              placeholder='Enter your address'
              disabled={isLoadingAddress}
            />
            {addressError && !address && (
              <p className='p-2 mt-2 text-xs text-red-700 bg-red-300 rounded-xl'>
                We couldn&apos;t access your location. Please enter manually.
              </p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className='absolute right-1 top-[37px] z-50 sm:top-[5px] md:top-[7px]'>
              <Button
                type='small'
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
                disabled={isLoadingAddress}
              >
                {isLoadingAddress ? "Loading..." : "get position"}
              </Button>
            </span>
          )}
        </div>

        <div className='flex gap-5 mb-12 font-semibold'>
          <input
            type='checkbox'
            name='priority'
            id='priority'
            className='w-6 h-6 accent-yellow-500 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2'
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority'>Want to prioritise your order?</label>
        </div>

        <div>
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />
          <input
            type='hidden'
            name='position'
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button type='primary' disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Submitting order..."
              : `Order now for ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      "Please use a valid phone number in case we need to contact you!";
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
