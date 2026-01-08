using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using api.Enums;

namespace api.Models
{
    public class ReviewModel
    {
        [Key]
        public int Id { get; set; }
        public string Author { get; set; } = "";
        public string? Text { get; set; } = "";
        public double? Rate { get; set; }
        public bool TakeInRating { get; set; } = true;

        public int? CountOfHoures { get; set; }
        public int? CountOfMinutes { get; set; }

        public ReviewStatus Status { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public string? CountOfSeasons { get; set; } = "";

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [ForeignKey("Film")]
        public int FilmId { get; set; }
        public FilmModel? film { get; set; }

        [ForeignKey("User")]
        public string? AppUserId { get; set; }
        public AppUser? AppUser { get; set; }
    }
}