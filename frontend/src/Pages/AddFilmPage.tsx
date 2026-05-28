import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postFilmApi } from "../Services/FilmService";

export type AddFilmFormInput = {
  title: string;
  filmType: number;
  imageUrl: string;
  filmCategory: number;
};

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  filmType: yup
    .number()
    .oneOf([0, 1], "Select film type")
    .required("Type is required"),
  imageUrl: yup.string().required("Poster URL is required"),
  filmCategory: yup
    .number()
    .oneOf([0, 1, 2, 3, 4, 5], "Select category")
    .required("Category is required"),
});

export const AddFilmPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFilmFormInput>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      filmType: 0,
    },
  });

  const onSubmit = async (data: AddFilmFormInput) => {
    try {
      console.log(data.filmType);
      await postFilmApi(
        data.title,
        data.filmType,
        data.imageUrl,
        data.filmCategory,
      );
      toast.success("Film added successfully");
      navigate("/add");
    } catch (error) {
      toast.error("Error adding film");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Add Film
              </h1>
              <p className="mt-2 text-gray-500">Fill in the details below</p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Inception"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Film Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("filmType")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value={0}>No parts / standalone</option>
                  <option value={1}>Consists of parts (series, seasons)</option>
                </select>
                {errors.filmType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.filmType.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("filmCategory")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                >
                  <option value={0}>Movie</option>
                  <option value={1}>Series</option>
                  <option value={2}>Anime</option>
                  <option value={3}>Cartoon</option>
                  <option value={4}>Book</option>
                  <option value={5}>Game</option>
                </select>
                {errors.filmCategory && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.filmCategory.message}
                  </p>
                )}
              </div>

              {/* Poster URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Poster URL <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("imageUrl")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/poster.jpg"
                />
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
              >
                Add Film
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
