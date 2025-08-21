
using api.DTOs;
using api.Enums;
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
                Reviews = appUser.Reviews
                .OrderByDescending(x => x.Status == ReviewStatus.Planned)
                .ThenByDescending(x => x.StartDate).ThenByDescending(x => x.CreatedAt)
                .Select(x => x.ToReviewDtoFromOther()).ToList(),
                TopLists = appUser.TopLists.Select(x => x.ToDto()).ToList(),
            };
        }
    }
}