using RepRecorder.Api.Domain;
using RepRecorder.Api.Enums;
using RepRecorder.Api.Repositories;

namespace RepRecorder.Tests;

public class InMemoryRepositoryTests
{
    private static async Task<InMemoryRepSetSchemeRepository> CreateRepo(params RepSetScheme[] seedRepSetSchemes)
    {
        var repo = new InMemoryRepSetSchemeRepository();

        foreach (var repSetScheme in seedRepSetSchemes)
            await repo.CreateAsync(repSetScheme);

        return repo;
    }

    #region GetByIdAsync

    // ste:todo: fixe test 
    //[Fact]
    //public async Task GetByIdAsync_ExistingId_ReturnsEntity()
    //{
    //    // Arrange
    //    var id = Guid.NewGuid();
    //    var entity = new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.BentRow, 100, 4);
    //    var repo = await CreateRepo(entity);

    //    // Act
    //    var result = await repo.GetByIdAsync(id);

    //    // Assert
    //    Assert.Equal(entity, result);
    //}

    [Fact]
    public async Task GetByIdAsync_MissingId_ReturnsNull()
    {
        // Arrange
        var repo = await CreateRepo();

        // Act
        var result = await repo.GetByIdAsync(Guid.NewGuid());

        // Assert
        Assert.Null(result);
    }

    #endregion

    #region GetAllAsync

    [Fact]
    public async Task GetAllAsync_EmptyStore_ReturnsEmptyPage()
    {
        // Arrange
        var repo = await CreateRepo();

        // Act
        var result = await repo.GetAllAsync(pageNumber: 1, pageSize: 10, sortOrder: SortOrder.asc, SortBy.date);

        // Assert
        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
        Assert.Equal(0, result.TotalPages);
    }

    [Fact]
    public async Task GetAllAsync_FirstPage_ReturnsCorrectSlice()
    {
        // Arrange
        var repo = await CreateRepo(
            new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.BentRow, 100, 4),
            new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.LegCurl, 110, 5),
            new RepSetScheme(Guid.NewGuid().ToString().ToString(), DateTime.UtcNow, Movements.UprightRow, 120, 6));

        // Act
        var result = await repo.GetAllAsync(pageNumber: 1, pageSize: 2, sortOrder: SortOrder.asc, SortBy.date);

        // Assert
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(3, result.TotalCount);
        Assert.Equal(2, result.TotalPages);
    }

    [Fact]
    public async Task GetAllAsync_SecondPage_ReturnsRemainingItems()
    {
        // Arrange
        var repo = await CreateRepo(
            new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.BentRow, 200, 4),
            new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.UprightRow, 100, 6),
            new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.CalfRaise, 50, 2));

        // Act
        var result = await repo.GetAllAsync(pageNumber: 2, pageSize: 2, sortOrder: SortOrder.asc, SortBy.date);

        // Assert
        Assert.Single(result.Items);
        Assert.Equal(3, result.TotalCount);
    }

    [Fact]
    public async Task GetAllAsync_PageNumberLessThanOne_ThrowsArgumentOutOfRangeException()
    {
        // Arrange
        var repo = await CreateRepo();

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(
            () => repo.GetAllAsync(pageNumber: 0, pageSize: 0, sortOrder: SortOrder.asc, SortBy.date));
    }

    [Fact]
    public async Task GetAllAsync_PageSizeLessThanOne_ThrowsArgumentOutOfRangeException()
    {
        // Arrange
        var repo = await CreateRepo();

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(
            () => repo.GetAllAsync(pageNumber: 1, pageSize: 0, sortOrder: SortOrder.asc, SortBy.date));
    }

    #endregion

    #region CreateAsync

    // ste:todo: fixe test 
    //[Fact]
    //public async Task CreateAsync_NewEntity_StoresAndReturnsEntity()
    //{
    //    // Arrange
    //    var id = Guid.NewGuid();
    //    var repo = await CreateRepo();
    //    var entity = new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.BentRow, 200, 4);

    //    // Act
    //    var result = await repo.CreateAsync(entity);

    //    // Assert
    //    Assert.Equal(entity, result);
    //    Assert.Equal(entity, await repo.GetByIdAsync(id));
    //}

    // ste:todo: fixe test 
    //[Fact]
    //public async Task CreateAsync_DuplicateId_ThrowsInvalidOperationException()
    //{
    //    // Arrange
    //    var id = Guid.NewGuid();
    //    var repo = await CreateRepo(new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.BentRow, 200, 4));

    //    // Act & Assert
    //    await Assert.ThrowsAsync<InvalidOperationException>(
    //        () => repo.CreateAsync(new RepSetScheme(Guid.NewGuid().ToString(), DateTime.UtcNow, Movements.BentRow, 200, 4)));
    //}

    #endregion
}

