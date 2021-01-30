using System;
using System.Collections.Generic;
using System.Text;

namespace News4U_Data_Provider.DatabaseSettings
{
    public interface INews4UMongoIDatabaseSettings
    {
        string NewsCollectionName { get; set; }
        string EditorsCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
