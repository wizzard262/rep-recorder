using RepRecorder.Api.Dtos;
using RepRecorder.Api.Enums;
using RepRecorder.Api.Helpers;
using RepRecorder.Api.Repositories;

namespace RepRecorder.Api;

public static class RepSetSchemeEndpoints
{
    public static RouteGroupBuilder MapRepSetSchemeEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/repsetscheme");

        group.MapGet("/", async (
            IRepSetSchemeRepository repo,
            int pageNumber,
            int pageSize,
            SortOrder sortOrder,
            SortBy sortBy) =>
        {
            var result = await repo.GetAllAsync(pageNumber, pageSize, sortOrder, sortBy);
            return Results.Ok(result);
        });

        group.MapGet("/{id:guid}", async (IRepSetSchemeRepository repo, Guid id) =>
        {
            var entity = await repo.GetByIdAsync(id);
            return entity is null ? Results.NotFound() : Results.Ok(entity);
        });

        group.MapDelete("/{id:guid}", async (IRepSetSchemeRepository repo, Guid id) =>
        {
            var deleted = await repo.DeleteByIdAsync(id);
            return deleted ? Results.Ok() : Results.NotFound();
        });

        group.MapPost("/", async (
            HttpContext http,
            IRepSetSchemeRepository repo,
            CreateRepSetSchemeRequest request) =>
        {
            if (http.Request.GetUserId() is not Guid userId)
            {
                return Results.Unauthorized();
            }

            var entity = request.ToEntity();
            var created = await repo.CreateAsync(entity);

            return Results.Created($"/api/repsetscheme/{created?.Id}", created);
        });

        return group;
    }
}

