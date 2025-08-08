using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;

namespace api.Mappers
{
    public static class UserMappers
    {
        public static UserDto ToUserDto(this AppUser appUser)
        {
            return new UserDto
            {
                Username = appUser.UserName!,
                Reviews = appUser.Reviews.Select(x => x.ToReviewFromOtherDTO()).ToList(),
                TopLists = appUser.TopLists.Select(x => x.ToDto()).ToList(),
            };
        }
    }
}