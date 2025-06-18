interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
  disabled?: boolean;
}

function QuantityControl({ quantity, onQuantityChange, onRemove, disabled = false }: QuantityControlProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && !isNaN(value)) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="quantity-control">
      <div className="quantity-input-group">
        <button
          className="quantity-btn"
          onClick={handleDecrease}
          disabled={disabled || quantity <= 1}
        >
          −
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className="quantity-input"
          min="1"
          disabled={disabled}
        />
        <button
          className="quantity-btn"
          onClick={handleIncrease}
          disabled={disabled}
        >
          +
        </button>
      </div>
      <button
        className="remove-btn"
        onClick={onRemove}
        disabled={disabled}
        title="Remove from cart"
      >
        🗑️
      </button>
    </div>
  );
}

export default QuantityControl;
