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
                Status = model.Status,
                CreatedAt = model.CreatedAt,
                TakeInRating = model.TakeInRating,
                CountOfSeasons = model.CountOfSeasons,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                CountOfHoures = model.CountOfHoures,
                CountOfMinutes = model.CountOfMinutes,
                FilmId = model.FilmId,
                FilmCategory = model.film!.FilmCategory,
                Film = model.film.ToFilmForReviewDto(),
            };
        }

        public static ReviewFromOtherUserDto ToReviewFromOtherDTO(this ReviewModel model)
        {
            return new ReviewFromOtherUserDto
            {
                Id = model.Id,
                Text = model.Text,
                Rate = model.Rate,
                Status = model.Status,
                CreatedAt = model.CreatedAt,
                TakeInRating = model.TakeInRating,
                CountOfSeasons = model.CountOfSeasons,
                StartDate = model.StartDate,
                CountOfHoures = model.CountOfHoures,
                CountOfMinutes = model.CountOfMinutes,
                EndDate = model.EndDate,
                FilmId = model.FilmId,
                FilmCategory = model.film!.FilmCategory,
                Film = model.film.ToFilmForReviewDto(),
            };
        }

        public static ReviewModel ToReviewFromCreateDTO(this CreateReviewDto model)
        {
            return new ReviewModel
            {
                Text = model.Text,
                Status = model.Status,
                StartDate = model.StartDate != null ? DateTime.SpecifyKind(model.StartDate.Value, DateTimeKind.Utc) : DateTime.UtcNow.Date,
                EndDate = model.EndDate != null ? DateTime.SpecifyKind(model.EndDate.Value, DateTimeKind.Utc) : (model.StartDate == null ? DateTime.UtcNow.Date : null),
                TakeInRating = model.TakeInRating,
                CountOfHoures = model.CountOfHoures,
                CountOfMinutes = model.CountOfMinutes,
                CountOfSeasons = model.CountOfSeasons,
                Rate = model.Rate,
                FilmId = model.FilmId
            };
        }
    }
}