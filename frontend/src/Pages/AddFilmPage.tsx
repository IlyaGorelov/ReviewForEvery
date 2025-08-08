import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postFilmApi } from "../Services/FilmService";
//import { addFilmApi } from "@/api/filmApi"; // Создай этот метод для POST запроса

export type AddFilmFormInput = {
  title: string;
  filmType: number;
  imageUrl: string;
  filmCategory: number;
};

const validationSchema = yup.object().shape({
  title: yup.string().required("Введите название"),
  filmType: yup
    .number()
    .oneOf([0, 1], "Выберите тип фильма")
    .required("Тип обязателен"),
  imageUrl: yup.string().required("Введите URL постера"),
  filmCategory: yup
    .number()
    .oneOf([0, 1, 2, 3, 4], "Выберите категорию фильма")
    .required("Категория обязательна"),
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
        data.filmCategory
      );
      toast.success("Фильм добавлен");
      navigate("/add");
    } catch (error) {
      toast.error("Ошибка при добавлении фильма");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Добавить фильм</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Название</label>
          <input
            {...register("title")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Тип</label>
          <select
            {...register("filmType")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value={0}>Нет частей</option>
            <option value={1}>Состоит из частей</option>
          </select>
          {errors.filmType && (
            <p className="text-red-500 text-sm">{errors.filmType.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Категория</label>
          <select
            {...register("filmCategory")}
            className="w-full border px-3 py-2 rounded"
          >
            <option value={0}>Фильм</option>
            <option value={1}>Сериал</option>
            <option value={2}>Аниме</option>
            <option value={3}>Мультик</option>
            <option value={4}>Книга</option>
          </select>
          {errors.filmType && (
            <p className="text-red-500 text-sm">{errors.filmType.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">URL постера</label>
          <input
            {...register("imageUrl")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Добавить фильм
        </button>
      </form>
    </div>
  );
};
