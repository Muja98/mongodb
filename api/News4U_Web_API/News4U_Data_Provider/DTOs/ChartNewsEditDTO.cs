using News4U_Data_Provider.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public class ChartNewsEditDTO : NewsEditDTO
    {
        public Chart Chart { get; set; }

        public override object GetValue()
        {
            return Chart;
        }
    }
}
