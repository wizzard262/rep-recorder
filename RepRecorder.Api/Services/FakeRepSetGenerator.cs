using Bogus;
using RepRecorder.Api.Domain;

namespace RepRecorder.Api.Services;

public static class FakeRepSetScemeGenerator
{
    public static RepSetScheme[] GenerateFakeRepSchemeSets()
    {
        var RepSetSchemeFaker = new Faker<RepSetScheme>("en_GB")
            .CustomInstantiator(f => new RepSetScheme(
                Guid.NewGuid().ToString(),
                f.Date.Past(1),
                f.PickRandom<ExerciseMovement>(Movements.All),
                f.Random.Int(30, 50),
                f.Random.Int(8, 12)
            ));

        var RepSetSchemes = RepSetSchemeFaker.Generate(50).ToArray();
        return RepSetSchemes;
    }
}
