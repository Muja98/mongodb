using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.Entities
{
    public class Editor
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> MyNews { get; set; }
    }
}
