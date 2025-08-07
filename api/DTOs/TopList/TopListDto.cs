using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TopListFilm;
using api.Models;

namespace api.DTOs.TopList
{
    public class TopListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public List<TopListFilmDto> TopListFilms { get; set; } = new();
    }
}