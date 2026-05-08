using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RepRecorder.Api.Abstractions;
using RepRecorder.Api.Controllers;
using RepRecorder.Api.Domain;
using RepRecorder.Api.Dtos;
using RepRecorder.Api.Repositories;

namespace RepRecorder.Tests;

public class RepRecorderControllerTests
{
    private static RepSetScheme MakeRepSetScheme(Guid? id = null) => new(
        id ?? Guid.NewGuid(),
        DateTime.UtcNow,
        Movements.BenchPress,
        2,
        3
        );

    private static async Task<RepSetSchemeController> CreateSystemUnderTest(params RepSetScheme[] seedRepSetSchemeData)
    {
        var repo = new InMemoryRepSetSchemeRepository();

        foreach (var repSetScheme in seedRepSetSchemeData)
        {
            repo.CreateAsync(repSetScheme).Wait();
        }

        var controller = new RepSetSchemeController(repo)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };

        controller.ControllerContext.HttpContext = new DefaultHttpContext();
        controller.ControllerContext.HttpContext.Request.Headers.Append("X-User-Id", Guid.NewGuid().ToString());

        return controller;
    }

    #region GetAll

    [Fact]
    public async Task GetAll_EmptyStore_ReturnsOkWithEmptyPage()
    {
        // Arrange
        var systemUnderTest = await CreateSystemUnderTest();

        // Act
        var result = await systemUnderTest.GetAll();

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        var paged = Assert.IsType<PaginatedList<RepSetScheme>>(ok.Value);
        Assert.Empty(paged.Items);
        Assert.Equal(0, paged.TotalCount);
    }

    [Fact]
    public async Task GetAll_WithItems_ReturnsOkWithPagedResult()
    {
        // Arrange
        var systemUnderTest = await CreateSystemUnderTest(MakeRepSetScheme(), MakeRepSetScheme(), MakeRepSetScheme());

        // Act
        var result = await systemUnderTest.GetAll(pageNumber: 1, pageSize: 2);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        var paged = Assert.IsType<PaginatedList<RepSetScheme>>(ok.Value);
        Assert.Equal(2, paged.Items.Count);
        Assert.Equal(3, paged.TotalCount);
        Assert.Equal(2, paged.TotalPages);
    }

    #endregion

    #region GetById

    [Fact]
    public async Task GetById_ExistingId_ReturnsOkWithEntity()
    {
        // Arrange
        var repSetScheme = MakeRepSetScheme();
        var systemUnderTest = await CreateSystemUnderTest(repSetScheme);

        // Act
        var result = await systemUnderTest.GetById(repSetScheme.Id);

        // Assert
        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(repSetScheme, ok.Value);
    }

    [Fact]
    public async Task GetById_MissingId_ReturnsNotFound()
    {
        // Arrange
        var systemUnderTest = await CreateSystemUnderTest();

        // Act
        var result = await systemUnderTest.GetById(Guid.NewGuid());

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    #endregion

    #region Create

    [Fact]
    public async Task Create_ValidEntity_ReturnsCreatedAtAction()
    {
        // Arrange
        var request = new CreateRepSetSchemeRequest(
                DateTime.Now,
                Movements.BenchPress,
                2,
                3
            );
        var systemUnderTest = await CreateSystemUnderTest();

        // Act
        var result = await systemUnderTest.Create(request);

        // Assert
        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(systemUnderTest.GetById), created.ActionName);
        var createdRepSetScheme = Assert.IsType<RepSetScheme>(created.Value);
        Assert.Equal(createdRepSetScheme.Id, created.RouteValues!["id"]);
    }

    #endregion
}
