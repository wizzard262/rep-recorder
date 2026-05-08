using RepRecorder.Api.Domain;

namespace RepRecorder.Api.Dtos;

public record CreateRepSetSchemeRequest(
    DateTime Date,
    ExerciseMovement ExerciseMovement,
    int KilogramMass,
    int Repetitions)
{
    public RepSetScheme ToEntity() => new(
        id: Guid.NewGuid().ToString(),
        date: Date,
        exerciseMovement: ExerciseMovement,
        kilogramMass: KilogramMass,
        repetitions: Repetitions);
}
