using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public abstract class NewsEditDTO
    {   
        public string Key { get; set; }
        public abstract object GetValue();
    }
}
