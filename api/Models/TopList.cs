using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class TopList
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public List<TopListFilm> TopListFilms { get; set; } = new();

        public string? AppUserId { get; set; }
        public AppUser? AppUser { get; set; }
    }
}