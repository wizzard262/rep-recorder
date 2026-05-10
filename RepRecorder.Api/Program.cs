using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Json;
using RepRecorder.Api.Extensions.Program;

var builder = WebApplication.CreateBuilder(args);
var useFake = builder.Configuration.GetValue<bool>("UseFakeRepo");

// Services
builder.Services.AddCorsPolicy();
builder.Services.AddSwaggerDocs();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddRepositories(builder.Configuration, useFake);

var app = builder.Build();

// Pipeline
if (useFake)
{
    await app.SeedFakeRepoAsync();
}

app.UseHttpsRedirection();
app.UseCorsPolicy();
app.UseSwaggerDocs();
app.UseGlobalExceptionLogging();
app.MapRepSetSchemeEndpoints();

app.Run();
