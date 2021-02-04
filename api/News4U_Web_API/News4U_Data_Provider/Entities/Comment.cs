using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.Entities
{
    public class Comment
    {
        public string AuthorsName { get; set; }
        public string  Text { get; set; }
        public DateTime DateTime { get; set; }
    }
}
