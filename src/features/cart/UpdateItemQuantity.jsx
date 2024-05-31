import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

function UpdateItemQuantity({ pizzaId, itemQuantity }) {
  const dispatch = useDispatch();

  function handleDecreaseQuantity() {
    dispatch(decreaseItemQuantity(pizzaId));
  }

  function handleIncreaseQuantity() {
    dispatch(increaseItemQuantity(pizzaId));
  }

  return (
    <div className='flex items-center gap-2 md:gap-3'>
      <Button type='round' onClick={handleDecreaseQuantity}>
        -
      </Button>
      <span className='text-sm font-semibold'>
        {itemQuantity}
      </span>
      <Button type='round' onClick={handleIncreaseQuantity}>
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;
