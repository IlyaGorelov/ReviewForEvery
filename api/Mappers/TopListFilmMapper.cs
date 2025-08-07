using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TopListFilm;
using api.Models;

namespace api.Mappers
{
    public static class TopListFilmMapper
    {
        public static TopListFilm ToFilmFromCreateDto(this CreateTopListFilmDto dto)
        {
            return new TopListFilm
            {
                FilmId = dto.FilmId,
                Position = dto.Position,
                TopListId = dto.TopListId,
                Comment = dto.Comment,
            };
        }

        public static TopListFilmDto ToDto(this TopListFilm model)
        {
            return new TopListFilmDto
            {
                Id = model.Id,
                FilmId = model.FilmId,
                Position = model.Position,
                Comment = model.Comment,
            };
        }
    }
}