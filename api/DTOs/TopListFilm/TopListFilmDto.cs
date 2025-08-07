using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TopListFilm
{
    public class TopListFilmDto
    {
        public int Id { get; set; }
        public int FilmId { get; set; }
        public int Position { get; set; }
        public string? Comment { get; set; }
    }
}