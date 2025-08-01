using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs
{
    public class ReviewDto
    {
        public int Id { get; set; }

        public string Author { get; set; } = "";

        public string Text { get; set; } = "";

        public int Rate { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        public int FilmId { get; set; }
    }
}