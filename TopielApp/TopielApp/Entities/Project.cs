using System.ComponentModel.DataAnnotations;

namespace TopielApp.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string UserRole { get; set; }
        public string FinishDate { get; set; }
       
        public decimal Cost { get; set; }
        [Range(0, 100)]
        public int Progress { get; set; }

        public List<ToDo> ToDos { get; set; } = new List<ToDo>();


    }
}
