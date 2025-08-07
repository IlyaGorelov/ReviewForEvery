using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Context
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<FilmModel> Films { get; set; }

        public DbSet<ReviewModel> Reviews { get; set; }
        public DbSet<TopList> TopLists { get; set; }
        public DbSet<TopListFilm> TopListFIlms { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            List<IdentityRole> roles = [
                new IdentityRole{
                    Id = "Admin",
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole{
                    Id = "User",
                    Name = "User",
                    NormalizedName = "USER"
                },
                new IdentityRole{
                    Id = "MainAdmin",
                    Name = "MainAdmin",
                    NormalizedName = "MAINADMIN"
                }
            ];
            builder.Entity<IdentityRole>().HasData(roles);

            builder.Entity<ReviewModel>()
            .HasOne(r => r.AppUser)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ReviewModel>()
            .HasOne(r => r.film)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.FilmId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TopList>()
            .HasOne(r => r.AppUser)
            .WithMany(u => u.TopLists)
            .HasForeignKey(r => r.AppUserId)
            .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TopListFilm>()
            .HasOne(r => r.TopList)
            .WithMany(u => u.TopListFilms)
            .HasForeignKey(r => r.TopListId)
            .OnDelete(DeleteBehavior.Cascade);
        }
    }
}