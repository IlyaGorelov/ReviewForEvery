using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Enums;
using api.Models;

namespace api.DTOs
{
    public class FilmDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = "";

        public string ImageUrl { get; set; }= "";
        public FilmType FilmType { get; set; }
        public FilmCategory FilmCategory { get; set; }

        public double Rating { get; set; }

        public List<ReviewDto>? Reviews { get; set; }
    }
}