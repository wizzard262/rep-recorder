namespace RepRecorder.Api.Extensions.Program;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder UseGlobalExceptionLogging(this IApplicationBuilder app)
    {
        return app.Use(async (context, next) =>
        {
            try
            {
                await next();
            }
            catch (Exception ex)
            {
                // Resolve the factory
                var factory = context.RequestServices.GetRequiredService<ILoggerFactory>();

                // Create a logger with a custom category name
                var logger = factory.CreateLogger("GlobalException");

                // Log the error
                logger.LogError(ex, "Unhandled exception occurred");

                throw; // rethrow so the client still gets a 500
            }
        });
    }
}
