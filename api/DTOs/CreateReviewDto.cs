using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.DTOs
{
    public class CreateReviewDto
    {
        [Required]
        [MinLength(1, ErrorMessage = "Title length must be at least 1")]
        public string Author { get; set; } = "";

        [Required]
        [MinLength(1, ErrorMessage = "Title length must be at least 1")]
        public string Text { get; set; } = "";

        [Required]
        [Range(1, 10, ErrorMessage = "Rating should be 1-10")]
        public int Rate { get; set; }

        [Required]
        [ForeignKey("Film")]
        public int FilmId { get; set; }
    }
}