import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const ImageInput = ({ image, setImage }) => {
  const [preview, setPreview] = useState(image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="mt-3">
      <label className="input-label">Product Image</label>
      <div className="flex items-center gap-4 mt-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm"
        />
      </div>

      {preview && (
        <div className="relative w-40 h-40 mt-3">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded shadow"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
          >
            <MdClose className="text-red-500 text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageInput;
