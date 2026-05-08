using Microsoft.AspNetCore.Mvc;
using RepRecorder.Api.Domain;
using RepRecorder.Api.Dtos;
using RepRecorder.Api.Enums;
using RepRecorder.Api.Helpers;
using RepRecorder.Api.Repositories;

namespace RepRecorder.Api.Controllers;

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
