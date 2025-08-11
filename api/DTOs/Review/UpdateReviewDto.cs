using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using api.Enums;

namespace api.DTOs
{
    public class UpdateReviewDto
    {
        [MinLength(1, ErrorMessage = "Title length must be at least 1")]
        public string? Text { get; set; }

        [Required]
        public ReviewStatus Status { get; set; }
        public int? CountOfHoures { get; set; }
        public int? CountOfMinutes { get; set; }
        public string? CountOfSeasons { get; set; } = "";
        [Required]
        public bool TakeInRating { get; set; }

        [DataType(DataType.Date)]
        public DateTime? StartDate { get; set; }
        [DataType(DataType.Date)]
        public DateTime? EndDate { get; set; }

        [Range(1, 10, ErrorMessage = "Rating should be 1-10")]
        public double? Rate { get; set; }
    }
}