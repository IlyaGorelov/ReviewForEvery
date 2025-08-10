using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Enums;

namespace api.DTOs
{
    public class FilmForReviewDto
    {
        //You get this Dto with ReviewDto
        public int Id { get; set; }

        public string Title { get; set; } = "";

        public string ImageUrl { get; set; } = "";
        public FilmCategory FilmCategory { get; set; }
        public FilmType FilmType { get; set; }
    }
}