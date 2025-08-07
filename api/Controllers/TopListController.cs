using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Context;
using api.DTOs.TopList;
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
    public class TopListController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public TopListController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMyTopLists()
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("User not found");
            var topLists = await _context.TopLists.Where(x => x.AppUserId == user.Id).Select(x => x.ToDto()).ToListAsync();

            return Ok(topLists);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetTopListById(int id)
        {
            var topList = await _context.TopLists
            .Include(x => x.TopListFilms)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (topList == null) return NotFound();

            return Ok(topList.ToDto());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateTopList(CreateTopListDto listDto)
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Not found user");

            var topList = listDto.ToListFromCreateDto();
            topList.AppUserId = user.Id;

            var exists = await _context.TopLists.FirstOrDefaultAsync(x => x.Name == topList.Name);

            if (exists != null) return BadRequest("This name is already taken");

            _context.TopLists.Add(topList);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTopListById), new { id = topList.Id }, topList);
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteTopList(int id)
        {
            var topList = await _context.TopLists.FindAsync(id);

            if (topList == null) return NotFound();

            _context.TopLists.Remove(topList);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> UpdateTopList(int id, [FromBody] CreateTopListDto dto)
        {
            var topList = await _context.TopLists.FindAsync(id);

            if (topList == null) return NotFound();

            topList.Name = dto.Name;

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}