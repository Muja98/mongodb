using News4U_Data_Provider.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DTOs
{
    public class NewsInfoDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string MainPicturePath { get; set; }
        public List<Paragraph> Paragraphs { get; set; }
    }
}
