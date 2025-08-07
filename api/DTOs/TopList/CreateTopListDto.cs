using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TopList
{
    public class CreateTopListDto
    {
        [Required]
        public string Name { get; set; } = "";
    }
}