import { useNavigate } from "react-router-dom";

// src/components/FilmCard.tsx
type FilmCardProps = {
  title: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
};

export default function FilmCard({ title, rating, reviewsCount, imageUrl }: FilmCardProps) {
  const navigate = useNavigate();
  return (
    <div className="relative group w-40 md:w-48 lg:w-56"
    onClick={() => navigate('/film/1')}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-auto rounded-lg shadow-md"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-center items-center text-white rounded-lg text-center px-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm mt-1">⭐ {rating.toFixed(1)} / 10</p>
        <p className="text-sm">{reviewsCount} отзывов</p>
      </div>
    </div>
  );
}
