using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.Entities
{
    public class Chart
    {
        public List<NamedValue> Data { get; set; }
        public int SegmentSize { get; set; }
    }
}
