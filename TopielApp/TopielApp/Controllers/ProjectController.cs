using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TopielApp.DTO;
using TopielApp.Entities;

namespace TopielApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly BIMAppContext _context;

        public ProjectController(BIMAppContext _context)
        {
            this._context = _context;
        }

        [HttpGet("allProjects")]
        public async Task<ActionResult<List<Project>>> GetAllProjects()
        {
            var projects = await _context.Projects.ToListAsync();
            return Ok(projects);
        }

        [HttpGet("getProject/{id}", Name ="GetProject")]
        public async Task<ActionResult<Project>> GetProjectById(int id)
        {
            var project = await _context.Projects.SingleOrDefaultAsync(x => x.Id == id);
            if(project== null)  return NotFound(new ProblemDetails() { Title = "Cant Find Project with that id" });
            return Ok(project);
        }

        [HttpPost("newProject")]
        public async Task<ActionResult<Project>> CreateProject(ProjectDto dto)
        {
            if (dto.Name.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Name" });
            if (dto.Description.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Description" });
            if (dto.Status.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Status" });
            if (dto.UserRole.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add User Role" });
            if (dto.FinishDate.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Finish Date" });
            var project = new Project()
            {
                Description = dto.Description,
                Status = dto.Status,
                Name = dto.Name,
                UserRole = dto.UserRole,
                FinishDate = dto.FinishDate,
                Cost = dto.Cost,
                Progress = dto.Progress,
            };
            if (_context.Projects.FirstOrDefault(x => x.Name == dto.Name) != null) return Ok("Project already exist");
            await _context.AddAsync(project);
            var result = await _context.SaveChangesAsync();
            if (result > 0) return CreatedAtRoute("GetProject", new { Id = project.Id }, project);
            return BadRequest(new ProblemDetails() { Title = "Cant save data, sth went wrong" });

        }
    }
}
