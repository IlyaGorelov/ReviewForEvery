using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Context;
using api.DTOs;
using api.Extensions;
using api.Interfaces;
using api.Mappers;
using api.Models;
using api.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<AppUser> _signInManager;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, SignInManager<AppUser> signInManager)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto login)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == login.Email.ToLower());

            if (user == null) return Unauthorized("Invalid email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (!result.Succeeded) return Unauthorized("Invalid email or/and password");

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new NewUserDto
            {
                UserName = user.UserName!,
                Email = user.Email!,
                Token = _tokenService.CreateToken(user).Result,
                Role = roles[0],
                Reviews = user.Reviews.Select(x => x.ToReviewDTO()).ToList()
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var user = new AppUser
                {
                    UserName = registerDto.UserName,
                    Email = registerDto.Email,
                };

                var result = await _userManager.CreateAsync(user, registerDto.Password!);

                if (result.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, "User");
                    if (roleResult.Succeeded)
                        return Ok(new NewUserDto
                        {
                            UserName = user.UserName!,
                            Email = user.Email!,
                            Token = _tokenService.CreateToken(user).Result,
                            Role = "User",
                            Reviews = user.Reviews.Select(x => x.ToReviewDTO()).ToList()
                        });
                    else
                        return BadRequest(roleResult.Errors);
                }
                else
                {
                    return BadRequest(result.Errors);

                }
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [Authorize(Roles = "MainAdmin")]
        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterDto registerDto)
        {
            try
            {

                var user = new AppUser
                {
                    UserName = registerDto.UserName,
                    Email = registerDto.Email,
                };

                var result = await _userManager.CreateAsync(user, registerDto.Password!);

                if (result.Succeeded)
                {
                    var roleResult = await _userManager.AddToRoleAsync(user, "Admin");
                    if (roleResult.Succeeded)
                        return Ok(new NewUserDto
                        {
                            UserName = user.UserName!,
                            Email = user.Email!,
                            Token = _tokenService.CreateToken(user).Result,
                            Role = "Admin",
                            Reviews = user.Reviews.Select(x => x.ToReviewDTO()).ToList()
                        });
                    else
                        return BadRequest(roleResult.Errors);
                }
                else
                {
                    return BadRequest(result.Errors);

                }
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [Authorize(Roles = "MainAdmin")]
        [HttpDelete("admin/{username}")]
        public async Task<IActionResult> DeleteAccount(string username)
        {

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound("User not found");


            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
                return BadRequest("Error");

            return Ok("User deleted");
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteMyAccount()
        {
            var username = User.GetUsername();
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return BadRequest("No user");
            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
                return BadRequest("Error");

            return Ok("User deleted");
        }

    }
}