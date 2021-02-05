using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.Entities
{
    public class News
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Title { get; set; }
        public DateTime DateTime { get; set; }
        public string MainPicturePath { get; set; }
        public string Field { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string EditorId { get; set; }

        public List<Paragraph> Paragraphs { get; set; }
        public List<Comment> Comments { get; set; }
        public List<string> Tags { get; set; }
        public Survey Survey { get; set; }
        public Chart Chart { get; set; }
    }
}
