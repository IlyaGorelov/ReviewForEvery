using api.Context;
using api.DTOs;
using api.Enums;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FilmsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetFilms(int page = 1, int pageSize = 20, string? search = null)
        {
            var query = _context.Films.AsQueryable();

            if (!string.IsNullOrEmpty(search))
                query = query.Where(x => x.Title.ToLower().Contains(search.ToLower()));

            var totalCount = await query.CountAsync();

            var films = await query.Include(f => f.Reviews!)
            .ThenInclude(x => x.AppUser).Select(x => x.ToFilmDto())
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync();

            return Ok(new
            {
                items = films,
                totalCount
            });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetFilmById(int id)
        {
            var film = await _context.Films.Include(f => f.Reviews!)
            .ThenInclude(x => x.AppUser)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (film == null) return NotFound();

            return Ok(film.ToFilmDto());
        }

        [Authorize(Roles = "Admin,MainAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateFilm([FromBody] CreateFilmDto filmDto)
        {
            var filmModel = filmDto.ToFilmFromCreateDTO();
            _context.Films.Add(filmModel);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFilmById), new { id = filmModel.Id }, filmModel);
        }

        [Authorize(Roles = "Admin,MainAdmin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateFilm(int id, [FromBody] UpdateFilmDto updateFilm)
        {
            var filmModel = await _context.Films.FirstOrDefaultAsync(f => f.Id == id);

            if (filmModel == null)
                return NotFound("Film not found");

            filmModel.Title = updateFilm.Title;
            filmModel.ImageUrl = updateFilm.ImageUrl;
            filmModel.FilmCategory = updateFilm.FilmCategory;
            filmModel.FilmType = updateFilm.FilmType;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "MainAdmin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteFilmById(int id)
        {
            var film = await _context.Films.FindAsync(id);
            if (film == null)
                return NotFound();

            _context.Films.Remove(film);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}