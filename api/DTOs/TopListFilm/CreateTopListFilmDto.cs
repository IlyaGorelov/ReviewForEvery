using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TopListFilm
{
    public class CreateTopListFilmDto
    {
        [Required]
        public int FilmId { get; set; }
        [Required]
        public int Position { get; set; }
        [Required]
        public int TopListId { get; set; }
        public string? Comment { get; set; }
    }
}