using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class TopListFilm
    {
        [Key]
        public int Id { get; set; }
        public int FilmId { get; set; }
        public int Position { get; set; }
        public string? Comment { get; set; }

        public int? TopListId { get; set; }
        public TopList? TopList { get; set; }
    }
}