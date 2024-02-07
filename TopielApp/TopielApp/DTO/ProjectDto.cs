using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        /////////////////////////////////////////////////////
        
        [Required(AllowEmptyStrings = true), DisplayFormat(ConvertEmptyStringToNull = false)]
        public string? ImageName { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }

        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
