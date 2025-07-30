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
                Rating = model.Rating,
                Reviews = model.Reviews.ToList()
            };
        }

        public static FilmModel ToFilmFromCreateDTO(this CreateFilmDto model)
        {
            return new FilmModel
            {
                Title = model.Title,
                ImageUrl = model.ImageUrl,
                Rating = model.Rating
            };
        }
    }
}