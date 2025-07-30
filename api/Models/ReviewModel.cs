using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class ReviewModel
    {
        [Key]
        public int Id { get; set; }

        public string Author { get; set; } = "";

        public string Text { get; set; } = "";

        public int Rate { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [ForeignKey("Film")]
        public int FilmId { get; set; }
        public FilmModel? film { get; set; }
    }
}