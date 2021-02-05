using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace News4U_Data_Provider.Entities
{
    public class Survey
    {
        public string Question { get; set; }
        public List<NamedValue> AnswerValue { get; set; }
    }
}
