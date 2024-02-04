using System.ComponentModel.DataAnnotations;

namespace TopielApp.DTO
{
    public class ProjectDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string UserRole { get; set; }
        public string FinishDate { get; set; }

        public decimal Cost { get; set; } = 0;
        [Range(0, 100)]
        public int Progress { get; set; } = 0;
    }
}
