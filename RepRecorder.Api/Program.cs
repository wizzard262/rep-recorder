using Microsoft.Azure.Cosmos;
using RepRecorder.Api.Repositories;
using RepRecorder.Api.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var useFake = builder.Configuration.GetValue<bool>("UseFakeRepo");

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin() //ste:todo: change to ==>: WithOrigins("https://yourusername.github.io")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

builder.Services.AddOpenApi();

// ensure enums pass the text not the integer in API endpoints
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// ------------------------------------------------------------
// REGISTER REPOSITORY IMPLEMENTATION (FAKE OR COSMOS)
// ------------------------------------------------------------
if (useFake)
{
    builder.Services.AddSingleton<IRepSetSchemeRepository, InMemoryRepSetSchemeRepository>();
}
else
{
    builder.Services.AddSingleton<CosmosClient>(sp =>
    {
        var config = sp.GetRequiredService<IConfiguration>();
        var conn = config["Cosmos:ConnectionString"];
        return new CosmosClient(conn);
    });

    builder.Services.AddScoped<IRepSetSchemeRepository, CosmosRepSetSchemeRepository>();
}

var app = builder.Build();

// ------------------------------------------------------------
// SEED FAKE REPO (ONLY WHEN USING FAKE MODE)
// ------------------------------------------------------------
if (useFake)
{
    using var scope = app.Services.CreateScope();
    var repo = scope.ServiceProvider.GetRequiredService<IRepSetSchemeRepository>();

    foreach (var repSchemeSets in FakeRepSetScemeGenerator.GenerateFakeRepSchemeSets())
    {
        await repo.CreateAsync(repSchemeSets);
    }
}

// ------------------------------------------------------------
// HTTP PIPELINE
// ------------------------------------------------------------
var leaveOpenForPortfolioUse = true;
if (app.Environment.IsDevelopment() || leaveOpenForPortfolioUse)
{
    app.MapOpenApi(); // exposes the OpenApi documentation at: ~/openapi/v1.json
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Rep Recorder API");
    });
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.Run();
