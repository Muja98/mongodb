using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.Entities
{
    public class Paragraph
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id {get;set;}
        public string Text { get; set; }
        public string SubTitle { get; set; }
        public string Picture { get; set; }
    }
}
