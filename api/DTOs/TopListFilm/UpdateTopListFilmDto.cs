using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TopListFilm
{
    public class UpdateTopListFilmDto
    {
        [Required]
        public int Position { get; set; }
    }
}