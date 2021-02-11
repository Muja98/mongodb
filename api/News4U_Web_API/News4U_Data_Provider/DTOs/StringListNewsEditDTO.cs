using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public class StringListNewsEditDTO: NewsEditDTO
    {
        public List<string> MyList { get; set; }

        public override object GetValue()
        {
            return MyList;
        }
    }
}
