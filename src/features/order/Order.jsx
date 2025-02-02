// Test ID: IIDSAT
import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";

import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utilities/helpers";
import OrderItem from "./OrderItem";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const order = useLoaderData();

  const fetcher = useFetcher();

  useEffect(
    function () {
      if (!fetcher.data && fetcher.state === "idle") fetcher.load("/menu");
    },
    [fetcher],
  );

  console.log(fetcher.data);

  // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  function statusColor() {
    if (status === "delivered") return "green-500";
    if (status === "preparing") return "yellow-500";
  }

  console.log(status);

  return (
    <div className='px-4 py-6 space-y-8'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-xl font-semibold'>Order #{id} status</h2>

        <div className='space-x-2'>
          {priority && (
            <span className='px-2 py-1 text-sm font-semibold tracking-wide uppercase bg-red-500 rounded-full text-red-50'>
              Priority
            </span>
          )}
          <span
            className={`px-2 py-1 text-sm font-semibold uppercase tracking-wide bg-${statusColor()} rounded-full text-red-50`}
          >
            {status} Order
          </span>
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3 px-5 py-5 bg-stone-200'>
        <p className='font-medium '>
          {deliveryIn >= 0
            ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className='text-xs text-stone-500'>
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      <ul className='border-t border-b divide-y divide-stone-200'>
        {cart.map((item) => (
          <OrderItem
            item={item}
            key={item.pizzaId}
            isLoadingIngredients={fetcher.state === "loading"}
            ingredients={
              fetcher.data?.find((el) => el.id === item.pizzaId).ingredients
            }
          />
        ))}
      </ul>

      <div className='px-6 py-5 space-y-2 bg-stone-200'>
        <p className='text-sm font-medium text-stone-500'>
          Pizza cost: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className='text-sm font-medium text-stone-500'>
            Priority cost: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className='font-bold'>
          To pay: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>
      {!priority && <UpdateOrder order={order} />}
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;
