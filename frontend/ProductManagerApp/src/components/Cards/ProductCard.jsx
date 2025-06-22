import { MdCreate, MdDelete } from "react-icons/md";
import placeholderImage from "../../assets/images/fallback.png";

const ProductCard = ({
  imageUrl,
  name,

  description,
  price,
  category,
  inStock,
  onEdit,
  onDelete,
}) => {
  // Truncate description to 100 characters
  const truncate = (text, length = 100) =>
    text.length > length ? text.substring(0, length) + "…" : text;

  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-xl transition-all ease-in-out border-gray-300 ">
      <div className=" h-48 overflow-hidden rounded-md">
        <img
          src={imageUrl || placeholderImage}
          alt={name}
          className="w-full h-full object-contain rounded-md"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h6 className="text-lg font-semibold text-slate-800">{name}</h6>
      
      </div>

      {category && (
        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {category}
        </span>
      )}

      <p className="text-sm text-slate-600 mt-2">{truncate(description)}</p>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-slate-900">EGP {price}</span>
          <span
            className={`ml-4 text-xs font-medium ${
              inStock ? "text-green-600" : "text-red-500"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <MdCreate
            className="text-xl text-slate-400 cursor-pointer hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="text-xl text-slate-400 cursor-pointer hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
