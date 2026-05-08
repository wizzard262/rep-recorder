namespace RepRecorder.Api.Domain;

public record ExerciseMovement(string Name, ExerciseType Type, bool IsCompound);

public static class Movements
{
    // Push
    public static readonly ExerciseMovement BenchPress = new("Bench Press", ExerciseType.Push, true);
    public static readonly ExerciseMovement OverheadPress = new("Overhead Press", ExerciseType.Push, true);
    public static readonly ExerciseMovement InclineBenchPress = new("Incline Bench Press", ExerciseType.Push, true);
    public static readonly ExerciseMovement EzExtension = new("Ez Extension", ExerciseType.Push, false);

    // Pull
    public static readonly ExerciseMovement BentRow = new("Bent Row", ExerciseType.Pull, true);
    public static readonly ExerciseMovement DeadliftShrug = new("Deadlift Shrug", ExerciseType.Pull, true);
    public static readonly ExerciseMovement UprightRow = new("Upright Row", ExerciseType.Pull, true);
    public static readonly ExerciseMovement EzCurl = new("Ez Curl", ExerciseType.Pull, false);

    // Legs
    public static readonly ExerciseMovement Squat = new("Squat", ExerciseType.Legs, true);
    public static readonly ExerciseMovement LegExtension = new("Leg Extension", ExerciseType.Legs, false);
    public static readonly ExerciseMovement LegCurl = new("Leg Curl", ExerciseType.Legs, false);
    public static readonly ExerciseMovement CalfRaise = new("Calf Raise", ExerciseType.Legs, false);

    // Other
    public static readonly ExerciseMovement WristCurl = new("Wrist Curl", ExerciseType.Other, false);
    public static readonly ExerciseMovement ReverseWristCurl = new("Reverse Wrist Curl", ExerciseType.Other, false);

    public static readonly IReadOnlyList<ExerciseMovement> All =
        [
            BenchPress,
            OverheadPress,
            InclineBenchPress,
            EzExtension,
            BentRow,
            DeadliftShrug,
            UprightRow,
            EzCurl ,
            Squat ,
            LegExtension ,
            LegCurl ,
            CalfRaise ,
            WristCurl ,
            ReverseWristCurl
        ];
}