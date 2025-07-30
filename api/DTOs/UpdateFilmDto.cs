using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs
{
    public class UpdateFilmDto
    {
        [Required]
        [MinLength(1, ErrorMessage = "Title length must be at least 1")]
        public string Title { get; set; } = "";

        public string ImageUrl { get; set; } = "";

        [Required]
        [Range(1, 10, ErrorMessage = "Rating should be 1-10")]
        public double Rating { get; set; }
    }
}