using api.Context;
using api.DTOs;
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
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public ReviewsController(AppDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize(Roles = "Admin,MainAdmin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _context.Reviews.Include(x => x.AppUser)
            .Include(x => x.film)
            .Select(x => x.ToReviewDTO()).ToListAsync(); ;

            // var reviewsDto = reviews  

            return Ok(reviews);
        }

        [Authorize(Roles = "Admin,MainAdmin")]
        [HttpGet("admin/{id:int}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _context.Reviews
            .Include(x => x.AppUser).Include(x => x.film)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (review == null) return NotFound();

            return Ok(review.ToReviewDTO());
        }

        [Authorize(Roles = "Admin,MainAdmin")]
        [HttpDelete("admin/{id:int}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews
            .FirstOrDefaultAsync(x => x.Id == id);

            if (review == null)
                return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllMyReviews()
        {
            var username = User.GetUsername();
            var reviews = await _context.Reviews
            .Where(x => x.Author == username).Include(x => x.AppUser).Include(x => x.film)
            .Select(x => x.ToReviewDTO()).ToListAsync();

            return Ok(reviews);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMyReviewById(int id)
        {
            var username = User.GetUsername();
            var review = await _context.Reviews.Where(x => x.Author == username)
            .Include(x => x.AppUser).Include(x => x.film)
            .FirstOrDefaultAsync(x => x.Id == id);

            if (review == null) return NotFound();

            return Ok(review.ToReviewDTO());
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto reviewDto)
        {
            var filmModel = await _context.Films.FirstOrDefaultAsync(x => x.Id == reviewDto.FilmId);

            if (filmModel == null) return BadRequest("Film not found");

            var username = User.GetUsername();
            var appUser = await _userManager.FindByNameAsync(username);

            var review = reviewDto.ToReviewFromCreateDTO();
            review.Author = username;
            review.AppUserId = appUser!.Id;
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMyReviewById), new { id = review.Id }, review);

        }

        [Authorize]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMyReview(int id)
        {
            var username = User.GetUsername();
            var review = await _context.Reviews
            .FirstOrDefaultAsync(x => x.Id == id && x.Author == username);

            if (review == null)
                return NotFound();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMyReview(int id, [FromBody] UpdateReviewDto updateReview)
        {
            var username = User.GetUsername();
            var review = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == id && x.Author == username);

            if (review == null) return BadRequest("Review not found");

            review.Text = updateReview.Text;
            review.Rate = updateReview.Rate;
            review.Status = updateReview.Status;
            review.TakeInRating = updateReview.TakeInRating;
            review.CountOfSeasons = updateReview.CountOfSeasons;
            review.StartDate = updateReview.StartDate;
            review.EndDate = updateReview.EndDate;

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}