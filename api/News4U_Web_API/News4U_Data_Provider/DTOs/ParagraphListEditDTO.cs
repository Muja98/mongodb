using News4U_Data_Provider.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public class ParagraphListEditDTO : NewsEditDTO
    {
        public List<Paragraph> Paragraphs { get; set; }

        public override object GetValue()
        {
            return Paragraphs;
        }
    }
}
