using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Enums;

namespace api.Models
{
    public class FilmModel
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; } = "";

        public string ImageUrl { get; set; }= "";

        public double Rating { get; set; }
        public FilmType FilmType { get; set; }
        public List<ReviewModel>? Reviews { get; set; } = new();
    }
}