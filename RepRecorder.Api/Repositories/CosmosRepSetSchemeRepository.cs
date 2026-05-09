using System.Net;
using Microsoft.Azure.Cosmos;
using RepRecorder.Api.Abstractions;
using RepRecorder.Api.Domain;
using RepRecorder.Api.Enums;

namespace RepRecorder.Api.Repositories;

public class CosmosRepSetSchemeRepository(CosmosClient client, IConfiguration config) : IRepSetSchemeRepository
{
    private readonly Container? _container = client.GetContainer(config["Cosmos:DatabaseName"], config["Cosmos:ContainerName"]);

    public async Task<PaginatedList<RepSetScheme>> GetAllAsync(
        int pageNumber,
        int pageSize,
        SortOrder sortOrder,
        SortBy sortBy)
    {
        var pagingOffset = (pageNumber - 1) * pageSize;
        var order = sortOrder == SortOrder.asc ? "ASC" : "DESC";
        var sortField = sortBy switch
        {
            SortBy.date => "repSetScheme.date",
            SortBy.mass => "repSetScheme.kilogramMass",
            SortBy.reps => "repSetScheme.repetitions",
            SortBy.movement => "repSetScheme.exerciseMovement.name",
            _ => "repSetScheme.date"
        };

        var sql = $@"
        SELECT * FROM repSetScheme
        ORDER BY {sortField} {order}
        OFFSET {pagingOffset} LIMIT {pageSize}";

        var query = _container.GetItemQueryIterator<RepSetScheme>(new QueryDefinition(sql));
        var items = new List<RepSetScheme>();

        while (query.HasMoreResults)
        {
            var page = await query.ReadNextAsync();
            items.AddRange(page);
        }

        // Cosmos does NOT support COUNT(*) with ORDER BY, so we must run a separate count query
        var countQuery = _container.GetItemQueryIterator<int>(new QueryDefinition("SELECT VALUE COUNT(1) FROM repSetScheme"));
        var totalCount = 0;
        while (countQuery.HasMoreResults)
        {
            var page = await countQuery.ReadNextAsync();
            totalCount += page.FirstOrDefault();
        }

        return new PaginatedList<RepSetScheme>(
            items,
            totalCount,
            pageNumber,
            pageSize
        );
    }

    public async Task<RepSetScheme?> GetByIdAsync(Guid id)
    {
        try
        {
            var response = await _container.ReadItemAsync<RepSetScheme>(id.ToString(), new PartitionKey(id.ToString()));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<bool> DeleteByIdAsync(Guid id)
    {
        try
        {
            await _container.DeleteItemAsync<RepSetScheme>(id.ToString(), new PartitionKey(id.ToString()));
            return true;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return false;
        }
    }

    public async Task<RepSetScheme?> CreateAsync(RepSetScheme repSetScheme)
    {
        try
        {
            var response = await _container.CreateItemAsync(repSetScheme, new PartitionKey(repSetScheme.Id.ToString()));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
        {
            throw new InvalidOperationException($"An entity with id '{repSetScheme.Id}' already exists.");
        }
        catch (CosmosException ex)
        {
            throw new Exception(ex.Message);
        }
    }
}
