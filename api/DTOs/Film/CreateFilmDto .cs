using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Enums;

namespace api.DTOs
{
    public class CreateFilmDto
    {
        [Required]
        [MinLength(1, ErrorMessage = "Title length must be at least 1")]
        public string Title { get; set; } = "";
        public FilmType FilmType { get; set; }
        [Required]
        public FilmCategory FilmCategory { get; set; }
        public string ImageUrl { get; set; } = "";

    }
}