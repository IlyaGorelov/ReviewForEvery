using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TopList;
using api.Mappers;
using api.Models;

namespace api.DTOs
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public List<ReviewFromOtherUserDto> Reviews { get; set; }=new();
        public List<TopListDto> TopLists { get; set; } = new();
    }
}