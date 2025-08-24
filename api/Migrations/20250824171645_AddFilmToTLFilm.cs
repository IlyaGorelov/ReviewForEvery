using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddFilmToTLFilm : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TopListFIlms_FilmId",
                table: "TopListFIlms",
                column: "FilmId");

            migrationBuilder.AddForeignKey(
                name: "FK_TopListFIlms_Films_FilmId",
                table: "TopListFIlms",
                column: "FilmId",
                principalTable: "Films",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TopListFIlms_Films_FilmId",
                table: "TopListFIlms");

            migrationBuilder.DropIndex(
                name: "IX_TopListFIlms_FilmId",
                table: "TopListFIlms");
        }
    }
}
