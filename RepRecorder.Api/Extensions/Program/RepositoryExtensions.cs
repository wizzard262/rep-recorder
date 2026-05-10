using Microsoft.Azure.Cosmos;

using RepRecorder.Api.Repositories;
using RepRecorder.Api.Services;

namespace RepRecorder.Api.Extensions.Program;

public static class RepositoryExtensions
{
    public static IServiceCollection AddRepositories(this IServiceCollection services, IConfiguration config, bool useFake)
    {
        if (useFake)
        {
            services.AddSingleton<IRepSetSchemeRepository, InMemoryRepSetSchemeRepository>();
        }
        else
        {
            services.AddSingleton<CosmosClient>(_ =>
            {
                var conn = config["CosmosDb:ConnectionString"];
                return new CosmosClient(conn);
            });

            services.AddScoped<IRepSetSchemeRepository, CosmosRepSetSchemeRepository>();
        }

        return services;
    }

    public static async Task SeedFakeRepoAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var repo = scope.ServiceProvider.GetRequiredService<IRepSetSchemeRepository>();

        foreach (var repSchemeSets in FakeRepSetScemeGenerator.GenerateFakeRepSchemeSets())
        {
            await repo.CreateAsync(repSchemeSets);
        }
    }
}
