using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;

namespace api.Mappers
{
    public static class ReviewMappers
    {
        public static ReviewDto ToReviewDTO(this ReviewModel model)
        {
            return new ReviewDto
            {
                Id = model.Id,
                Author = model.AppUser!.UserName!,
                Text = model.Text,
                Rate = model.Rate,
                Date = model.Date,
                FilmId = model.FilmId
            };
        }

        public static ReviewModel ToReviewFromCreateDTO(this CreateReviewDto model)
        {
            return new ReviewModel
            {
                Text = model.Text,
                Rate = model.Rate,
                FilmId = model.FilmId
            };
        }
    }
}