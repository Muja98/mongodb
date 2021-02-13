using News4U_Data_Provider.DatabaseSettings;
using News4U_Data_Provider.Services.RepositoryContracts;
using System;
using System.Collections.Generic;
using System.Text;
using MongoDB.Driver;
using News4U_Data_Provider.Entities;
using System.Threading.Tasks;
using MongoDB.Driver.Linq;
using System.Linq;
using MongoDB.Bson;
using News4U_Data_Provider.DTOs;

namespace News4U_Data_Provider.Services.RepositoryServices
{
    public class NewsRepository: INewsRepository
    {
        private static readonly List<string> newsFields = new List<string>() { "Sport", "Hronika", "Korona", "Vremenska prognoza" };
        private readonly IMongoCollection<News> _news;

        public NewsRepository(INews4UMongoIDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _news = database.GetCollection<News>(settings.NewsCollectionName);
        }

        public async Task<IEnumerable<News>> GetNewsForEditor(string editorId, int from, int to)
        {
            var news = await _news.AsQueryable().Where(news => news.EditorId == editorId)
                                                .OrderByDescending(news => news.DateTime)                                
                                                .Skip(from).Take(to).ToListAsync();
            return news;
        }

        public async Task<News> GetNews(string newsId, int commentsCount)
        {
            var filter = Builders<News>.Filter.Eq("Id", newsId);
            var projection = Builders<News>.Projection.Slice(news => news.Comments, 0, commentsCount);
            var result = await _news.Find(filter).Project<News>(projection).FirstOrDefaultAsync();
            return result;
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

        public async Task AddNewsPictures(string newsId, string mainPicturePath, List<Paragraph> paragraphs)
        {
            var filter = Builders<News>.Filter.Eq("Id", newsId);
            var update = Builders<News>.Update;
            UpdateDefinition<News> set = null;
            if (!string.IsNullOrEmpty(mainPicturePath))
                set = update.Set("MainPicturePath", mainPicturePath);
            if (paragraphs != null)
                set = (set != null) ? set.Set("Paragraphs", paragraphs) : update.Set("Paragraphs", paragraphs);

            await _news.UpdateOneAsync(filter, set);
        }

        public async Task<IEnumerable<News>> GetAllNews(string title, string field, string tag, int from, int to)
        {
            var query = _news.AsQueryable();

            if (!string.IsNullOrEmpty(field))
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

            query = query.OrderByDescending(n => n.DateTime).Skip(from).Take(to);

            List<News> result = await query.ToListAsync();

            return result;
        }

        bool CompareTags(List<string> tags1, List<string> tags2)
        {
            bool found = false;
            int index = 0;

            while (!found && index < tags1.Count)
            {
                if (tags2.Contains(tags1[index]))
                    found = true;
                index++;
            }

            return found;
        }

        public async Task<IEnumerable<News>> GetRelatedNews(List<string> tags, string field, string newsId)
        {
            List<News> result = new List<News>();

            if(tags.Count > 0 )
            {
                List<News> newsWithCommonTags = await _news.AsQueryable()
                    .Where(n => n.Id != newsId && n.Tags.Any(t => tags.Contains(t)))
                    .Take(10)
                    .ToListAsync();

                result.AddRange(newsWithCommonTags);
            }

            if(result.Count < 10)
            {
                List<News> newsWithSameField = await _news.AsQueryable()
                .Where(n => n.Id != newsId && n.Field == field && !n.Tags.Any(t => tags.Contains(t)))
                .Take(10 - result.Count)
                .ToListAsync();

                result.AddRange(newsWithSameField);
            }

            return result;
        }

        public IEnumerable<string> GetAvailableNewsFields()
        {
            return newsFields;
        }

        public async Task VoteSurvey(string newsId, string surveyAnswerName)
        {
            //News news = await _news.Find(news => news.Id == newsId).FirstOrDefaultAsync();
            //news.Survey.AnswerValue[surveyIndex].Value++;

            var filter = Builders<News>.Filter.Where(x => x.Id == newsId && x.Survey.AnswerValue.Any(i => i.Name == surveyAnswerName));
            var update = Builders<News>.Update.Inc(x => x.Survey.AnswerValue[-1].Value, 1);
            await _news.UpdateOneAsync(filter, update);

            //News news = await _news.Find(news => news.Id == newsId).FirstOrDefaultAsync();

            //if(news != null && news.Survey != null)
            //{
            //    news.Survey.AnswerValue[surveyIndex].Value++;
            //    await _news.ReplaceOneAsync(x => x.Id == newsId, news);
            //}
        }

        public async Task<IEnumerable<NamedValue>> GetSurveyResult(string newsId)
        {
            News news = await _news.Find(news => news.Id == newsId).FirstOrDefaultAsync();
            if (news != null)
                return news.Survey.AnswerValue;
            else
                return null;
        }

        public async Task AddNewComment(string newsId, Comment comment)
        {
            comment.DateTime = DateTime.Now;
            IList<Comment> toAdd = new List<Comment>();
            toAdd.Add(comment);
            var filter = Builders<News>.Filter.Eq(news => news.Id, newsId);
            var update = Builders<News>.Update.PushEach(news => news.Comments, toAdd, position: 0);
            await _news.UpdateOneAsync(filter, update);
        }

        public async Task<IEnumerable<Comment>> LoadMoreComments(string newsId, int from, int count)
        {
            IList<Comment> comments = new List<Comment>();
            var filter = Builders<News>.Filter.Eq("Id", newsId);
            var projection = Builders<News>.Projection.Include("Id").Slice("Comments", from, count);
            var bsonDoc = await _news.Find(filter).Project(projection).SingleAsync();
            var bsonArray = bsonDoc.GetValue("Comments").AsBsonArray;
            foreach(var bsonComment in bsonArray)
            {
                Comment c = new Comment
                {
                    Text = bsonComment["Text"].ToString(),
                    AuthorsName = bsonComment["AuthorsName"].ToString(),
                    DateTime = (DateTime)bsonComment["DateTime"]
                };
                comments.Add(c);
            }
            return comments;
        }

        public async Task EditNews(string newsId, NewsEditDTO editValue)
        {
            var filter = Builders<News>.Filter.Eq("Id", newsId);
            var update = Builders<News>.Update.Set(editValue.Key, editValue.GetValue());
            await _news.UpdateOneAsync(filter, update);
        }

        public async Task<IEnumerable<News>> DeleteNewsByDate(string editorId, DateTime date)
        {
            var filter1 = Builders<News>.Filter.Eq("EditorId", editorId);
            var filter2 = Builders<News>.Filter.Lt("DateTime", date);

            var query = _news.AsQueryable();
            query = query.Where(n => n.EditorId == editorId);
            query = query.Where(n => n.DateTime > date);
            List<News> result = await query.ToListAsync();

            await _news.DeleteManyAsync(filter1 & filter2);

            return result;

        }

    }
}
