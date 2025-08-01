using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Context
{
    public static class MainAdminSeeder
    {
        public static async Task SeedAdminAsync(this IApplicationBuilder app)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

            string adminEmail = "ilgorelov5@gmail.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                var newAdmin = new AppUser
                {
                    UserName = "MainAdmin",
                    Email = adminEmail
                };

                var result = await userManager.CreateAsync(newAdmin, "StrongAdminPassword123)");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newAdmin, "MainAdmin");   
                }
            }
        }
    }
}