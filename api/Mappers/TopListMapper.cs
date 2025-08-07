using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TopList;
using api.Models;

namespace api.Mappers
{
    public static class TopListMapper
    {
        public static TopList ToListFromCreateDto(this CreateTopListDto dto)
        {
            return new TopList
            {
                Name = dto.Name,
            };
        }

        public static TopListDto ToDto(this TopList model)
        {
            return new TopListDto
            {
                Id = model.Id,
                Name = model.Name,
                TopListFilms = model.TopListFilms.Select(x => x.ToDto()).ToList(),
            };
        }
    }
}