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
        public static ReviewModel ToReviewFromCreateDTO(this CreateReviewDto model)
        {
            return new ReviewModel
            {
                Author = model.Author,
                Text = model.Text,
                Rate = model.Rate,
                FilmId = model.FilmId
            };
        }
    }
}