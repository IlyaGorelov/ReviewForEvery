using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TopListFilm
{
    public class ReorderListFilmsDto
    {
        public List<ReorderListFilmDto> Items { get; set; } = new();
    }
}