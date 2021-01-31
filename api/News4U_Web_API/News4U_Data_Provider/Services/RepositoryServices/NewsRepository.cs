using News4U_Data_Provider.DatabaseSettings;
using News4U_Data_Provider.Services.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Driver;
using News4U_Data_Provider.Entities;

namespace News4U_Data_Provider.Services.RepositoryServices
{
    public class NewsRepository: INewsRepository
    {
        //private readonly IMongoCollection<News> _news;

        public NewsRepository(INews4UMongoIDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            //_news = database.GetCollection<News>(settings.NewsCollectionName);
        }
    }
}
