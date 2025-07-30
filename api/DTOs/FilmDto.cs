using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.DTOs
{
    public class FilmDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = "";

        public string ImageUrl { get; set; }= "";

        public double Rating { get; set; }

        public List<ReviewModel>? Reviews { get; set; }
    }
}