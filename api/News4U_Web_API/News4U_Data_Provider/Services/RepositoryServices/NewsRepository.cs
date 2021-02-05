using News4U_Data_Provider.DatabaseSettings;
using News4U_Data_Provider.Services.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Driver;
using News4U_Data_Provider.Entities;
using System.Threading.Tasks;
using MongoDB.Driver.Linq;

namespace News4U_Data_Provider.Services.RepositoryServices
{
    public class NewsRepository: INewsRepository
    {
        private readonly IMongoCollection<News> _news;

        public NewsRepository(INews4UMongoIDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _news = database.GetCollection<News>(settings.NewsCollectionName);
        }

        public async Task<IEnumerable<News>> GetNewsForEditor(string editorId)
        {
            var news = await _news.Find(news => news.EditorId == editorId).ToListAsync();
            return news;
        }

        public async Task<News> GetNews(string newsId)
        {
            News news = await _news.Find(news => news.Id == newsId).FirstOrDefaultAsync();
            return news;
        }

        public async Task<string> AddNews(News news)
        {
            news.DateTime = DateTime.Now;

            await _news.InsertOneAsync(news);
            return news.Id;
        }

        public async Task<string> DeleteNews(string newsId)
        {
            string editorId = (from news in _news.AsQueryable()
                            where news.Id ==  newsId
                            select news.EditorId)
                            .First();

            var filter = Builders<News>.Filter.Eq("Id", newsId);
            var result = await _news.DeleteOneAsync(filter);

            return editorId;
        }

        public async Task<IEnumerable<News>> GetAllNews(string title, string field, string tag, int from, int to)
        {
            var query = _news.AsQueryable();

            if(!string.IsNullOrEmpty(field))
            {
                query = query.Where(n => n.Field == field);
            }

            if (!string.IsNullOrEmpty(tag))
            {
                query = query.Where(n => n.Tags.Contains(tag));
            }

            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(n => n.Title.ToLower().Contains(title.ToLower()));
            }

            query = query.Skip(from);

            List<News> news = await query.ToListAsync();

            List<News> result = new List<News>();

            int index = 0;

            while (index < to && index < news.Count)
            {
                result.Add(news[index]);
                index++;
            }

            return result ;
        }

        public async Task VoteSurvey(string newsId, int surveyIndex)
        {
            News news = await _news.Find(news => news.Id == newsId).FirstOrDefaultAsync();
            
            if(news != null && news.Survey != null)
            {
                news.Survey.AnswerValue[surveyIndex].Value++;
                await _news.ReplaceOneAsync(x => x.Id == newsId, news);
            }
        }

        public async Task<IEnumerable<NamedValue>> GetSurveyResult(string newsId)
        {
            News news = await _news.Find(news => news.Id == newsId).FirstOrDefaultAsync();
            if (news != null)
                return news.Survey.AnswerValue;
            else
                return null;
        }
    }
}
