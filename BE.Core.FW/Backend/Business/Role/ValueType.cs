using System.ComponentModel.DataAnnotations;

namespace Backend.Business.Role
{
    public class ValueType
    {
        public string Value { get; set; } = default!;
        public string Label { get; set; } = default!;
    }

    public class TreeView
    {
        public string? Title { get; set; }
        public string? Value { get; set; }
        public string? Key { get; set; }
        public bool? DisableCheckbox { get; set; }

        public List<TreeView> Children { get; set; } = default!;

    }
}
