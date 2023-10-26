namespace Backend.Business.Navigation
{
    public class NavigationModel
    {
        public Guid Id { get; set; }
        public Guid? ParentId { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string IconClass { get; set; } = string.Empty;
        public int Order { get; set; }
        public string Resource { get; set; } = string.Empty;
        public string ComponentPath { get; set; } = string.Empty;
        public List<NavigationModel> Children { get; set; } = new List<NavigationModel>();
        public bool IsShow { get; set; }
    }
}
