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
    public class ToDoController : ControllerBase
    {
        private readonly BIMAppContext _context;

        public ToDoController(BIMAppContext context)
        {
            _context = context;
        }

        [HttpGet("allToDo/{id}")]
        public async Task<ActionResult<List<ToDo>>> GetAllProjectsToDos(int id) {
            var result = await _context.ToDos.Where(x => x.ProjectId == id).ToListAsync();
            return Ok(result);
        }

        [HttpGet("getToDo/{projectId}/{toDoId}", Name ="GetNote")]
        public async Task<ActionResult<ToDo>> GetToDo(int projectId, int toDoId)
        {
            var result = await _context.ToDos.FirstOrDefaultAsync(x => x.ProjectId == projectId && x.Id == toDoId);
            if (result == null) return NotFound(new ProblemDetails() { Title = "No such toDo for this Project" });
            return Ok(result);
        }

        [HttpDelete("deleteToDo/{id}")]
        public async Task<ActionResult> DeleteToDo(int id)
        {
            var todo = await _context.ToDos.FirstOrDefaultAsync(x => x.Id == id);
            if (todo == null) return NotFound(new ProblemDetails() { Title = "No such ToDos" });
            _context.ToDos.Remove(todo);
            var result = await _context.SaveChangesAsync();
            if (result > 0) return Ok("Deleted ToDo");
            return BadRequest(new ProblemDetails() { Title = "Sth went wrong with saving changes" });
        }

        [HttpPost("addNewToDo")]
        public async Task<ActionResult<ToDo>> AddNewToDo(ToDoDTO dto)
        {
            if (dto.Priority.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Priority" });
            if (dto.Description.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Description" });
            if (dto.FragmentMap.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Select some object before adding note" });
            if (dto.Camera.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "No camera position" });
            if (await _context.Projects.FirstOrDefaultAsync(x => x.Id == dto.ProjectId) == null) return NotFound(new ProblemDetails() { Title = "No such project" });
            var todo = new ToDo()
            {
                Priority = dto.Priority,
                Description = dto.Description,
                FragmentMap = dto.FragmentMap,
                Camera = dto.Camera,
                Date = dto.Date.ToString(),
                ProjectId = dto.ProjectId,
            };
            _context.ToDos.Add(todo);
            var result =await _context.SaveChangesAsync();
            if (result > 0) return Ok(todo);
            return BadRequest(new ProblemDetails() { Title = "Sth went wrong during sevaing" });
            
        }
    }
}
