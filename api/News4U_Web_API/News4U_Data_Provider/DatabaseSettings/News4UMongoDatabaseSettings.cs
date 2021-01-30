using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DatabaseSettings
{
    public class News4UMongoDatabaseSettings : INews4UMongoIDatabaseSettings
    {
        public string NewsCollectionName { get; set; }
        public string EditorsCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
