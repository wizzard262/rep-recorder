using Microsoft.AspNetCore.Mvc;

using RepRecorder.Api.Dtos;
using RepRecorder.Api.Enums;
using RepRecorder.Api.Extensions;
using RepRecorder.Api.Repositories;

namespace RepRecorder.Api.Controllers;

// N.B. This controller is implemented using the traditional ControllerBase approach instead of the newer minimal API style.
// This is intentional to demonstrate both approaches in the codebase
// The endpoints and functionality are equivalent to what is defined in RepSetSchemeEndpoints.cs
// the control is not used in the actual API but is used in the tests to verify the behavior of the endpoints
// to change from minimal API to controller-based, in Program.cs replace "app.MapRepSetSchemeEndpoints();" with "app.MapControllers();"
[ApiController]
[Route("[controller]")]
public class RepSetSchemeController(IRepSetSchemeRepository repository) : ControllerBase
{
    private readonly IRepSetSchemeRepository _repository = repository;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] SortOrder sortOrder = SortOrder.asc,
        [FromQuery] SortBy sortBy = SortBy.date
        )
    {
        var result = await _repository.GetAllAsync(pageNumber, pageSize, sortOrder, sortBy);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var RepSetScheme = await _repository.GetByIdAsync(id);
        return RepSetScheme is null ? NotFound() : Ok(RepSetScheme);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteById(Guid id)
    {
        var isDeleted = await _repository.DeleteByIdAsync(id);
        return isDeleted ? Ok() : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateRepSetSchemeRequest repSetScheme)
    {
        if (Request.GetUserId() is not Guid userId)
        {
            return Unauthorized("User ID is missing from the request.");
        }

        var entity = repSetScheme.ToEntity();
        var created = await _repository.CreateAsync(entity);
        return CreatedAtAction(nameof(GetById), new { id = created?.Id }, created);
    }
}
