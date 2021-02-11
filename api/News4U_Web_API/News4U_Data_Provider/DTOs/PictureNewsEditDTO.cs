using News4U_Helpers;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public class PictureNewsEditDTO : NewsEditDTO
    {
        public string Picture { get; set; }

        public override object GetValue()
        {
            return Picture;
        }
    }
}
