using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public class EditorDTO
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string LastName { get; set; }
        public List<string> MyNews { get; set; }
    }
}
