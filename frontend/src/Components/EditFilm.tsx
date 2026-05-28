import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { AddFilmFormInput } from "../Pages/AddFilmPage";
import { updateFilmApi } from "../Services/FilmService";

type Props = {
  filmId: number;
  initialFilm: AddFilmFormInput;
  onClose: () => void;
  onSuccess: () => void;
};

const validation = yup.object().shape({
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

const EditFilm = ({ filmId, initialFilm, onClose, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddFilmFormInput>({
    resolver: yupResolver(validation),
    defaultValues: {
      title: initialFilm.title,
      filmType: initialFilm.filmType,
      imageUrl: initialFilm.imageUrl,
      filmCategory: initialFilm.filmCategory,
    },
  });

  const onSubmit = async (form: AddFilmFormInput) => {
    try {
      await updateFilmApi(
        filmId,
        form.title,
        form.filmType,
        form.imageUrl,
        form.filmCategory,
      );
      toast.success("Film updated");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to update film");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[95%] max-w-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Edit Film
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("title")}
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
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Film Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("filmCategory")}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              type="text"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register("imageUrl")}
              placeholder="https://example.com/poster.jpg"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-sm"
            >
              Update Film
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditFilm;
