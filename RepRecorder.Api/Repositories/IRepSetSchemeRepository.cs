using RepRecorder.Api.Abstractions;
using RepRecorder.Api.Domain;
using RepRecorder.Api.Enums;

namespace RepRecorder.Api.Repositories;

public interface IRepSetSchemeRepository
{
    Task<PaginatedList<RepSetScheme>> GetAllAsync(
        int pageNumber,
        int pageSize,
        SortOrder sortOrder,
        SortBy sortBy
    );
    Task<RepSetScheme?> GetByIdAsync(Guid id);
    Task<bool> DeleteByIdAsync(Guid id);
    Task<RepSetScheme?> CreateAsync(RepSetScheme entity);
}