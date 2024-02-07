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
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProjectController(BIMAppContext _context, IWebHostEnvironment webHostEnvironment)
        {
            this._context = _context;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("allProjects")]
        public async Task<ActionResult<List<Project>>> GetAllProjects()
        {
            var projects = await _context.Projects.Select(x => new Project()
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description,
                Status = x.Status,
                UserRole = x.UserRole,
                FinishDate = x.FinishDate,
                Cost = x.Cost,
                Progress = x.Progress,
                ImageName = x.ImageName,
                ImageFile = x.ImageFile,
                ImageSrc = String.Format("{0}://{1}{2}/images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName),
            }).ToListAsync();
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
        public async Task<ActionResult<Project>> CreateProject([FromForm]ProjectDto dto)
        {
            if (dto.Name.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Name" });
            if (dto.Description.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Description" });
            if (dto.Status.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Status" });
            if (dto.UserRole.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add User Role" });
            if (dto.FinishDate.IsNullOrEmpty()) return BadRequest(new ProblemDetails() { Title = "Add Finish Date" });
            var imageName = await SaveImage(dto.ImageFile);
            
            var project = new Project()
            {
                Description = dto.Description,
                Status = dto.Status,
                Name = dto.Name,
                UserRole = dto.UserRole,
                FinishDate = dto.FinishDate,
                Cost = dto.Cost,
                Progress = dto.Progress,
                ImageFile = dto.ImageFile,
                ImageName = await SaveImage(dto.ImageFile),
                ImageSrc = dto.ImageSrc,
                //ImageSrc = String.Format("{0}://{1}{2}/images/{3}", Request.Scheme, Request.Host, Request.PathBase, imageName),
            };
            if (_context.Projects.FirstOrDefault(x => x.Name == dto.Name) != null) return Ok("Project already exist");

            await _context.AddAsync(project);
            var result = await _context.SaveChangesAsync();
            if (result > 0) return CreatedAtRoute("GetProject", new { Id = project.Id }, project);
            return BadRequest(new ProblemDetails() { Title = "Cant save data, sth went wrong" });

        }


        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName+DateTime.Now.ToString("yymmssfff")+Path.GetExtension(
                imageFile.FileName);
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", imageName);
            using(var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
                
            }
            return imageName;
        }

    }
}
