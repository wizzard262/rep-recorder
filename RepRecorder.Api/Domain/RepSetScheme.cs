using Newtonsoft.Json;

namespace RepRecorder.Api.Domain;

public record RepSetScheme
{
    [JsonProperty("id")]
    public string Id { get; init; } // this GUID ID must be string for cosmos DB to accept as the "partition"?
    public DateTime Date { get; init; }
    public ExerciseMovement ExerciseMovement { get; init; }
    public int KilogramMass { get; init; }
    public int Repetitions { get; init; }

    public RepSetScheme(
        string? id,
        DateTime date,
        ExerciseMovement exerciseMovement,
        int kilogramMass,
        int repetitions
    )
    {
        Id = id ?? Guid.NewGuid().ToString();
        Date = date;
        ExerciseMovement = exerciseMovement;
        KilogramMass = kilogramMass;
        Repetitions = repetitions;
    }

    public RepSetScheme()
    {
        Id = Guid.NewGuid().ToString();
    }
}

