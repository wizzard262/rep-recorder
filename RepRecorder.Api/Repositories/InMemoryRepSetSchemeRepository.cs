using RepRecorder.Api.Abstractions;
using RepRecorder.Api.Domain;
using RepRecorder.Api.Enums;
using System.Collections.Concurrent;

namespace RepRecorder.Api.Repositories;

public class InMemoryRepSetSchemeRepository : IRepSetSchemeRepository
{
    private readonly ConcurrentDictionary<Guid, RepSetScheme> _store = new();

    #region Public Methods

    public async Task<PaginatedList<RepSetScheme>> GetAllAsync(
        int pageNumber,
        int pageSize,
        SortOrder sortOrder,
        SortBy sortBy
    )
    {
        if (pageNumber < 1)
        {
            throw new ArgumentOutOfRangeException(nameof(pageNumber), "Page number must be at least 1.");
        }

        if (pageSize < 1)
        {
            throw new ArgumentOutOfRangeException(nameof(pageSize), "Page size must be at least 1.");
        }

        var all = _store.Values.AsQueryable();

        var items = (sortBy, sortOrder) switch
        {
            (SortBy.date, SortOrder.asc) => all.OrderBy(x => x.Date),
            (SortBy.date, SortOrder.desc) => all.OrderByDescending(x => x.Date),
            (SortBy.movement, SortOrder.asc) => all.OrderBy(x => x.ExerciseMovement.Name),
            (SortBy.movement, SortOrder.desc) => all.OrderByDescending(x => x.ExerciseMovement.Name),
            (SortBy.category, SortOrder.asc) => all.OrderBy(x => x.ExerciseMovement.Type),
            (SortBy.category, SortOrder.desc) => all.OrderByDescending(x => x.ExerciseMovement.Type),
            (SortBy.compound, SortOrder.asc) => all.OrderBy(x => x.ExerciseMovement.IsCompound),
            (SortBy.compound, SortOrder.desc) => all.OrderByDescending(x => x.ExerciseMovement.IsCompound),
            (SortBy.mass, SortOrder.asc) => all.OrderBy(x => x.KilogramMass),
            (SortBy.mass, SortOrder.desc) => all.OrderByDescending(x => x.KilogramMass),
            (SortBy.reps, SortOrder.asc) => all.OrderBy(x => x.Repetitions),
            (SortBy.reps, SortOrder.desc) => all.OrderByDescending(x => x.Repetitions),
            (SortBy.volume, SortOrder.asc) => all.OrderBy(x => x.KilogramMass * x.Repetitions),
            (SortBy.volume, SortOrder.desc) => all.OrderByDescending(x => x.KilogramMass * x.Repetitions),
            _ => all
        };

        await SimulateDbOperation();
        return new PaginatedList<RepSetScheme>(
            [.. items.Skip((pageNumber - 1) * pageSize).Take(pageSize)],
            items.Count(),
            pageNumber,
            pageSize);
    }

    public async Task<RepSetScheme?> GetByIdAsync(Guid id)
    {
        _store.TryGetValue(id, out var entity);
        await SimulateDbOperation();
        return entity;
    }

    public async Task<bool> DeleteByIdAsync(Guid id)
    {
        if (!_store.TryRemove(id, out _))  //  _ is a discard for an unused out var
        {
            throw new InvalidOperationException($"An entity with id '{id}' does not exists.");
        }
        await SimulateDbOperation();
        return true;
    }

    public async Task<RepSetScheme?> CreateAsync(RepSetScheme repSetScheme)
    {
        var guid = Guid.Parse(repSetScheme.Id);
        if (!_store.TryAdd(guid, repSetScheme))
        {
            throw new InvalidOperationException($"An entity with id '{repSetScheme.Id}' already exists.");
        }
        await SimulateDbOperation();
        return repSetScheme;
    }

    #endregion Public Methods

    private static async Task SimulateDbOperation()
    {
        // Simulate some latency to mimic a real database operation
        await Task.Delay(new Random().Next(40, 80));
    }
}
