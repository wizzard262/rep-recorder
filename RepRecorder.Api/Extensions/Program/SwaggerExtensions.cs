namespace RepRecorder.Api.Extensions.Program;

public static class SwaggerExtensions
{
    public static IServiceCollection AddSwaggerDocs(this IServiceCollection services)
    {
        services.AddOpenApi();
        return services;
    }

    public static WebApplication UseSwaggerDocs(this WebApplication app)
    {
        var leaveOpenForPortfolioUse = true;
        if (app.Environment.IsDevelopment() || leaveOpenForPortfolioUse)
        {
            app.MapOpenApi();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/openapi/v1.json", "Rep Recorder API");
            });
        }
        return app;
    }
}
