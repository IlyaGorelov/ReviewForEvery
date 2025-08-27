using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Context;
using api.DTOs;
using api.DTOs.TopListFilm;
using api.Extensions;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopListFilmController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public TopListFilmController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("getAll/{topListId:int}")]
        [Authorize]
        public async Task<IActionResult> GetAllTopFilms(int topListId)
        {
            var username = User.GetUsername();

            var topList = await _context.TopLists
            .Include(x => x.TopListFilms).ThenInclude(x => x.Film!)
            .ThenInclude(x => x!.Reviews.Where(x=>x.Author==username))
            .FirstOrDefaultAsync(x => x.Id == topListId);

            if (topList == null) return NotFound("No top list");

            

            return Ok(topList.TopListFilms);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetTopFilmById(int id)
        {
            var film = await _context.TopListFIlms.FindAsync(id);
            if (film == null) return NotFound();

            return Ok(film.ToDto());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateTopListFilm(CreateTopListFilmDto dto)
        {
            var topList = await _context.TopLists.FindAsync(dto.TopListId);

            if (topList == null) return NotFound("Top list not found");

            var topListFilm = dto.ToFilmFromCreateDto();
            topListFilm.TopList = topList;

            var exists = await _context.TopListFIlms.FirstOrDefaultAsync(x => x.Position == topListFilm.Position && x.TopListId == topListFilm.TopListId);

            if (exists != null) return BadRequest("Postion is already taken");

            _context.TopListFIlms.Add(topListFilm);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopFilmById), new { id = topListFilm.Id }, topListFilm);
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteTopListFilm(int id)
        {
            var topListFilm = await _context.TopListFIlms.FindAsync(id);

            if (topListFilm == null) return NotFound();

            _context.TopListFIlms.Remove(topListFilm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateTopLisFilm(int id, [FromBody] UpdateTopListFilmDto dto)
        {
            var topListFilm = await _context.TopListFIlms.FindAsync(id);

            if (topListFilm == null) return NotFound();

            topListFilm.Position = dto.Position;

            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}