using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;

namespace api.Mappers
{
    public static class FilmMappers
    {
        public static FilmDto ToFilmDto(this FilmModel model)
        {
            return new FilmDto
            {
                Id = model.Id,
                Title = model.Title,
                ImageUrl = model.ImageUrl,
                Rating = GetRating(model.Reviews!),
                FilmType = model.FilmType,
                FilmCategory = model.FilmCategory,
                Reviews = model.Reviews!.Select(x => x.ToReviewDTO()).ToList()
            };
        }

        private static double GetRating(List<ReviewModel> list)
        {
            double rate = 0;
            foreach (var item in list)
            {
                if (item.Rate != null && item.TakeInRating)
                    rate += (double)item.Rate;
            }

            int count = list.Where(x => x.Rate != null && x.TakeInRating).ToList().Count;
            if (rate > 0)
                rate /= count;

            return Math.Round(rate, 2);

        }

        public static FilmModel ToFilmFromCreateDTO(this CreateFilmDto model)
        {
            return new FilmModel
            {
                Title = model.Title,
                FilmType = model.FilmType,
                FilmCategory = model.FilmCategory,
                ImageUrl = model.ImageUrl,
            };
        }

        public static FilmForReviewDto ToFilmForReviewDto(this FilmModel model)
        {
            return new FilmForReviewDto
            {
                Id = model.Id,
                Title = model.Title,
                ImageUrl = model.ImageUrl,
                FilmCategory = model.FilmCategory,
                FilmType = model.FilmType
            };
        }
    }
}