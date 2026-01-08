using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Enums;
using api.Models;

namespace api.DTOs
{
    public class ReviewDto
    {
        public int Id { get; set; }

        public string Author { get; set; } = "";

        public string? Text { get; set; }

        public double? Rate { get; set; }
        public string? CountOfSeasons { get; set; } = "";
        public ReviewStatus Status { get; set; }
        [Required]
        public bool TakeInRating { get; set; }

        [DataType(DataType.Date)]
        public DateTime? StartDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime? EndDate { get; set; }
        public int? CountOfHoures { get; set; }
        public int? CountOfMinutes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

        public int FilmId { get; set; }
        public FilmCategory FilmCategory { get; set; }
        public FilmForReviewDto? Film { get; set; }
    }
}