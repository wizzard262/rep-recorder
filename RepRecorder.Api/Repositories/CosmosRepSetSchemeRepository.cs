using System.Net;
using Microsoft.Azure.Cosmos;
using RepRecorder.Api.Abstractions;
using RepRecorder.Api.Domain;
using RepRecorder.Api.Enums;
using Microsoft.Extensions.Logging;

namespace RepRecorder.Api.Repositories;

public class CosmosRepSetSchemeRepository : IRepSetSchemeRepository
{
    private readonly Container _container;
    private readonly ILogger<CosmosRepSetSchemeRepository> _logger;

    public CosmosRepSetSchemeRepository(CosmosClient client, IConfiguration config, ILogger<CosmosRepSetSchemeRepository> logger)
    {
        _container = client.GetContainer(config["Cosmos:DatabaseName"], config["Cosmos:ContainerName"]);
        _logger = logger;
    }

    public async Task<PaginatedList<RepSetScheme>> GetAllAsync(
        int pageNumber,
        int pageSize,
        SortOrder sortOrder,
        SortBy sortBy)
    {
        _logger.LogInformation("Fetching page {PageNumber} with size {PageSize}, sort {SortBy} {SortOrder}", pageNumber, pageSize, sortBy, sortOrder);

        var order = sortOrder == SortOrder.asc ? "ASC" : "DESC";

        // Cosmos requires alias "c"
        var sortField = sortBy switch
        {
            SortBy.date => "c.date",
            SortBy.mass => "c.kilogramMass",
            SortBy.reps => "c.repetitions",
            SortBy.movement => "c.exerciseMovement.name",
            _ => "c.date"
        };

        // Cosmos SQL must use FROM c
        var sql = $@"
        SELECT * 
        FROM c 
        ORDER BY {sortField} {order}";

        var query = _container.GetItemQueryIterator<RepSetScheme>(
            new QueryDefinition(sql),
            requestOptions: new QueryRequestOptions
            {
                MaxItemCount = pageSize
            });

        var items = new List<RepSetScheme>();

        // Skip pages until we reach the requested one
        for (var i = 1; i <= pageNumber; i++)
        {
            if (!query.HasMoreResults)
            {
                break;
            }

            var page = await query.ReadNextAsync();

            if (i == pageNumber)
            {
                items.AddRange(page);
            }
        }

        // Count query (fast path)
        var countQuery = _container.GetItemQueryIterator<int>(
            new QueryDefinition("SELECT VALUE COUNT(1) FROM c"));

        var totalCount = 0;
        while (countQuery.HasMoreResults)
        {
            var page = await countQuery.ReadNextAsync();
            totalCount += page.FirstOrDefault();
        }

        _logger.LogInformation("Fetched {Count} items out of total {TotalCount}", items.Count, totalCount);

        return new PaginatedList<RepSetScheme>(items, totalCount, pageNumber, pageSize);
    }


    public async Task<RepSetScheme?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching RepSetScheme with id {Id}", id);

        try
        {
            var response = await _container.ReadItemAsync<RepSetScheme>(id.ToString(), new PartitionKey(id.ToString()));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            _logger.LogWarning("RepSetScheme with id {Id} not found", id);
            return null;
        }
    }

    public async Task<bool> DeleteByIdAsync(Guid id)
    {
        _logger.LogInformation("Deleting RepSetScheme with id {Id}", id);

        try
        {
            await _container.DeleteItemAsync<RepSetScheme>(id.ToString(), new PartitionKey(id.ToString()));
            _logger.LogInformation("Deleted RepSetScheme with id {Id}", id);
            return true;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            _logger.LogWarning("RepSetScheme with id {Id} not found for deletion", id);
            return false;
        }
    }

    public async Task<RepSetScheme?> CreateAsync(RepSetScheme repSetScheme)
    {
        _logger.LogInformation("Creating RepSetScheme with id {Id}", repSetScheme.Id);

        try
        {
            var response = await _container.CreateItemAsync(repSetScheme, new PartitionKey(repSetScheme.Id.ToString()));
            _logger.LogInformation("Created RepSetScheme with id {Id}", repSetScheme.Id);
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.Conflict)
        {
            _logger.LogError("Conflict creating RepSetScheme with id {Id}", repSetScheme.Id);
            throw new InvalidOperationException($"An entity with id '{repSetScheme.Id}' already exists.");
        }
        catch (CosmosException ex)
        {
            _logger.LogError(ex, "Cosmos error creating RepSetScheme with id {Id}", repSetScheme.Id);
            throw;
        }
    }
}
