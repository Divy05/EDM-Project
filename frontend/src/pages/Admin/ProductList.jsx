import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

return (
<div className="container xl:mx-[9rem] sm:mx-[0]">
  <div className="flex flex-col md:flex-row">
    <AdminMenu />
    <div className="md:w-3/4 p-3">
      <div className="h-12 text-2xl font-semibold mb-4">Create Product</div>

      {imageUrl && (
        <div className="text-center mb-4">
          <img
            src={imageUrl}
            alt="product"
            className="block mx-auto max-h-[200px]"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
          {image ? image.name : "Upload Image"}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={uploadFileHandler}
            className={!image ? "hidden" : "text-white"}
          />
        </label>
      </div>

      <div className="p-3">
        <div className="flex flex-wrap mb-4">
          <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
            <label htmlFor="name" className="block">Name</label>
            <input
              type="text"
              className="p-4 w-full border rounded-lg bg-[#101011] text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2 pl-2">
            <label htmlFor="price" className="block">Price</label>
            <input
              type="number"
              className="p-4 w-full border rounded-lg bg-[#101011] text-white"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap mb-4">
          <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
            <label htmlFor="quantity" className="block">Quantity</label>
            <input
              type="number"
              className="p-4 w-full border rounded-lg bg-[#101011] text-white"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2 pl-2">
            <label htmlFor="brand" className="block">Brand</label>
            <input
              type="text"
              className="p-4 w-full border rounded-lg bg-[#101011] text-white"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block">Description</label>
          <textarea
            type="text"
            className="p-4 w-full bg-[#101011] border rounded-lg text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="flex flex-wrap mb-4">
          <div className="w-full md:w-1/2 pr-2 mb-4 md:mb-0">
            <label htmlFor="stock" className="block">Count In Stock</label>
            <input
              type="number"
              className="p-4 w-full border rounded-lg bg-[#101011] text-white"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2 pl-2">
            <label htmlFor="category" className="block">Category</label>
            <select
              className="p-4 w-full border rounded-lg bg-[#101011] text-white"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ProductList;