namespace TopielApp.Entities
{
    public class ToDo
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Date { get; set; }
        public string Priority { get; set; }
        public string FragmentMap { get; set; }
        public string Camera { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }


    }
}
